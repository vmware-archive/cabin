package com.skippbox.cabin;

import android.net.Uri;
import android.util.Log;

import com.esotericsoftware.yamlbeans.YamlReader;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.model.Info;
import com.google.common.io.Files;
import com.google.common.util.concurrent.ListenableFuture;
import com.google.common.util.concurrent.MoreExecutors;
import com.google.protobuf.ByteString;

import org.kamranzafar.jtar.TarEntry;
import org.kamranzafar.jtar.TarInputStream;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.GZIPInputStream;

import hapi.chart.ChartOuterClass;
import hapi.chart.MetadataOuterClass;
import hapi.chart.TemplateOuterClass;
import hapi.release.InfoOuterClass;
import hapi.release.ReleaseOuterClass;
import hapi.services.tiller.ReleaseServiceGrpc;
import hapi.services.tiller.Tiller;
import io.grpc.CallOptions;
import io.grpc.Channel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.internal.GrpcUtil;
import io.grpc.stub.StreamObserver;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okio.BufferedSink;
import okio.Okio;

class GRPCManager extends ReactContextBaseJavaModule {

    private static final String CHART_FILENAME = "Chart.yaml";
    private static final String PROTO_VERSION = "v2.0.0";

    GRPCManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "GRPCManager";
    }

    @ReactMethod
    public void fetchReleasesForHost(String host, final Promise promise) {
        Tiller.ListReleasesRequest.Builder request = Tiller.ListReleasesRequest.newBuilder();
        Channel channel = ManagedChannelBuilder.forTarget(host).usePlaintext(true).build();
        final List<ReleaseOuterClass.Release> releases = new ArrayList<>();
        StreamObserver<Tiller.ListReleasesResponse> observer = new StreamObserver<Tiller.ListReleasesResponse>() {
            @Override
            public void onNext(Tiller.ListReleasesResponse response) {
                releases.addAll(response.getReleasesList());
            }

            @Override
            public void onError(Throwable t) {
                promise.reject("0", t.getLocalizedMessage());
            }

            @Override
            public void onCompleted() {
                WritableArray result = Arguments.createArray();

                for (ReleaseOuterClass.Release release: releases) {
                    WritableMap r = Arguments.createMap();
                    r.putString("name", release.getName());
                    r.putString("manifest", release.getManifest());
                    r.putInt("version", release.getVersion());
                    r.putString("namespace", release.getNamespace());

                    ChartOuterClass.Chart chart = release.getChart();
                    WritableMap c = Arguments.createMap();
                    c.putString("name", chart.getMetadata().getName());
                    c.putString("home", chart.getMetadata().getHome());
                    c.putString("version", chart.getMetadata().getVersion());
                    c.putString("description", chart.getMetadata().getDescription());
                    r.putMap("chart", c);

                    InfoOuterClass.Info info = release.getInfo();
                    WritableMap i = Arguments.createMap();
                    i.putInt("status", info.getStatus().getCodeValue());
                    i.putDouble("firstDeployed", info.getFirstDeployed().getSeconds());
                    i.putDouble("lastDeployed", info.getLastDeployed().getSeconds());
                    i.putDouble("deleted", info.getDeleted().getSeconds());
                    r.putMap("info", i);

                    result.pushMap(r);
                }
                promise.resolve(result);
            }
        };
        final ReleaseServiceGrpc.ReleaseServiceStub stub = ReleaseServiceGrpc.newStub(channel);
        stub.withOption(CallOptions.Key.of("x-helm-api-client", ""), PROTO_VERSION).listReleases(request.build(), observer);
    }

    @ReactMethod
    public void deleteRelease(String releaseName, String host, final Promise promise) {
        Tiller.UninstallReleaseRequest.Builder request = Tiller.UninstallReleaseRequest.newBuilder();
        Channel channel = ManagedChannelBuilder.forTarget(host).usePlaintext(true).build();
        final ListenableFuture<Tiller.UninstallReleaseResponse> future = ReleaseServiceGrpc.newFutureStub(channel).withOption(CallOptions.Key.of("x-helm-api-client", ""), PROTO_VERSION).uninstallRelease(request.build());
        future.addListener(new Runnable() {
            @Override
            public void run() {
                promise.resolve("ok");
            }
        }, MoreExecutors.directExecutor());
    }

    @ReactMethod
    public void deployChartAtURL(String url, String host, final Promise promise) {
        File downloadedFile = null;
        File archiveFolder = null;
        try {
            ChartOuterClass.Chart.Builder chart = ChartOuterClass.Chart.newBuilder();

            downloadedFile = downloadChartFile(url);
            archiveFolder = decompressArchive(downloadedFile);

            YamlReader reader = new YamlReader(new FileReader(archiveFolder + File.separator + CHART_FILENAME));
            Map map = (Map) reader.read();

            MetadataOuterClass.Metadata.Builder metadata = MetadataOuterClass.Metadata.newBuilder();
            metadata.setVersion((String) map.get("version"));
            metadata.setName((String) map.get("name"));
            metadata.setDescription((String) map.get("description"));
            metadata.setHome((String) map.get("home"));
            ArrayList<String> keywords = (ArrayList<String>) map.get("keywords");
            if (keywords != null) {
                metadata.addAllKeywords(keywords);
            }
            chart.setMetadata(metadata);

            File[] templates = new File(archiveFolder, "templates").listFiles();
            for (int i = 0; i < templates.length; i++) {
                File fileTemplate = templates[i];
                TemplateOuterClass.Template.Builder template = TemplateOuterClass.Template.newBuilder();
                template.setName(fileTemplate.getName());
                template.setData(ByteString.copyFrom(Files.toByteArray(fileTemplate)));
                chart.addTemplates(i, template);
            }

            Tiller.InstallReleaseRequest.Builder request = Tiller.InstallReleaseRequest.newBuilder();
            request.setChart(chart);
            request.setNamespace("default");

            Channel channel = ManagedChannelBuilder.forTarget(host).usePlaintext(true).build();
            final ListenableFuture<Tiller.InstallReleaseResponse> future = ReleaseServiceGrpc.newFutureStub(channel).withOption(CallOptions.Key.of("x-helm-api-client", ""), PROTO_VERSION).installRelease(request.build());
            future.addListener(new Runnable() {
                @Override
                public void run() {
                    promise.resolve("ok");
                }
            }, MoreExecutors.directExecutor());
        } catch (Exception e) {
            promise.reject(e);
        } finally {
            if (downloadedFile != null) {
                downloadedFile.delete();
            }
            if (archiveFolder != null) {
                archiveFolder.delete();
            }
        }
    }

    private File downloadChartFile(String stringUrl) throws IOException {
        OkHttpClient client = new OkHttpClient();
        Uri url = Uri.parse(stringUrl);

        Request request = new Request.Builder().url(url.toString()).build();
        Response response = client.newCall(request).execute();

        File downloadedFile = new File(getReactApplicationContext().getCacheDir(), url.getLastPathSegment());
        BufferedSink sink = Okio.buffer(Okio.sink(downloadedFile));
        sink.writeAll(response.body().source());
        sink.close();
        return downloadedFile;
    }

    private File decompressArchive(File downloadedFile) throws IOException, InterruptedException {
        TarInputStream inputStream = new TarInputStream(new BufferedInputStream(new GZIPInputStream(new FileInputStream(downloadedFile))));
        File outDestination = new File(getReactApplicationContext().getCacheDir(), File.separator + "chart");

        outDestination.mkdirs();
        BufferedOutputStream outputStream;
        TarEntry entry;
        String dirName = null;
        while ((entry = inputStream.getNextEntry()) != null) {
            int count;
            byte data[] = new byte[4096];

            if (entry.isDirectory()) {
                new File(outDestination, File.separator + entry.getName()).mkdirs();
                continue;
            } else {
                int di = entry.getName().lastIndexOf('/');
                if (di != -1) {
                    new File(outDestination, File.separator + entry.getName().substring(0, di)).mkdirs();
                }
            }
            int pos = entry.getName().indexOf(File.separatorChar);
            if (pos != -1 && dirName == null) {
                dirName = entry.getName().substring(0, pos);
            }
            outputStream = new BufferedOutputStream(new FileOutputStream(outDestination + File.separator + entry.getName()));

            while ((count = inputStream.read(data)) != -1) {
                outputStream.write(data, 0, count);
            }
            outputStream.flush();
            outputStream.close();
        }
        return new File(outDestination, dirName);
    }
}
