package com.skippbox.cabin;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.react.modules.network.ReactCookieJarContainer;
import com.google.common.collect.Iterables;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.KeyStoreBuilderParameters;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509KeyManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;

public class CertificateModule extends ReactContextBaseJavaModule {

    private static final String REACT_NAME = "Certificate";

    public CertificateModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_NAME;
    }

    public static void setupClient(OkHttpClient currentClient) {
        OkHttpClientProvider.replaceOkHttpClient(CertificateModule.getUnsafeOkHttpClientBuilder(currentClient, null).build());
    }

    static OkHttpClient.Builder getUnsafeOkHttpClientBuilder(OkHttpClient currentClient, KeyManager[] keyManagers) {
        try {
            // Create a trust manager that does not validate certificate chains
            final TrustManager[] trustAllCerts = new TrustManager[] { getTrustManager() };

            // Install the all-trusting trust manager
            final SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(keyManagers, trustAllCerts, new java.security.SecureRandom());
            // Create an ssl socket factory with our all-trusting manager
            final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

            OkHttpClient.Builder builder = currentClient.newBuilder();
            builder.sslSocketFactory(sslSocketFactory, (X509TrustManager)trustAllCerts[0]);
            builder.cookieJar(new ReactCookieJarContainer());
            builder.hostnameVerifier(new HostnameVerifier() {
                @Override
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            });

            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            return builder
                    .addInterceptor(logging)
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .writeTimeout(30, TimeUnit.SECONDS)
                    .readTimeout(30, TimeUnit.SECONDS);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @ReactMethod
    public void initClientWithCertificates(ReadableArray clusters, Promise promise) throws NoSuchAlgorithmException, InvalidAlgorithmParameterException, KeyManagementException {

        /*List<X509KeyManager> keys = new ArrayList<>();
        for (int i = 0; i < clusters.size(); i++) {
            ReadableMap cluster = clusters.getMap(i);
            ReadableMap certificate = cluster.hasKey("certificate") ? cluster.getMap("certificate") : null;

            if (certificate != null && certificate.hasKey("path")) {
                String password = cluster.hasKey("password") ? certificate.getString("password") : "";
                String path = certificate.getString("path");
                File file = new File(getReactApplicationContext().getFilesDir() + "/" + path);

                try {
                    FileInputStream fileStream = new FileInputStream(file);
                    KeyStore keyStore = KeyStore.getInstance("PKCS12");
                    keyStore.load(fileStream, password.toCharArray());
                    KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
                    kmf.init(keyStore, password.toCharArray());
                    keys.add(Iterables.getFirst(Iterables.filter(
                            Arrays.asList(kmf.getKeyManagers()), X509KeyManager.class), null));
                } catch (Exception e) {
                    Log.e("Cabin", "Error with cluster: " + cluster, e);
                    // wrong passphrase or something, ignore this certificate
                    // TODO: Reject promise with failed clusters ?
                }
            }
        }
        KeyManager[] keyManagers = keys.size() > 0 ? keys.toArray(new KeyManager[keys.size()]) : null*/

        OkHttpClient.Builder builder = getUnsafeOkHttpClientBuilder(OkHttpClientProvider.getOkHttpClient(), null);

        OkHttpClient client = builder.build();
        OkHttpClientProvider.replaceOkHttpClient(client);
        promise.resolve(true);
    }

    private static X509TrustManager getTrustManager() {
        return new X509TrustManager() {
            @Override
            public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
            }

            @Override
            public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
            }

            @Override
            public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                return new java.security.cert.X509Certificate[]{};
            }

        };
    }
}
