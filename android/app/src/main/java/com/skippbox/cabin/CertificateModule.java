package com.skippbox.cabin;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.react.modules.network.ReactCookieJarContainer;

import java.io.File;
import java.io.FileInputStream;
import java.security.InvalidAlgorithmParameterException;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.OkHttpClient;

public class CertificateModule extends ReactContextBaseJavaModule {

    private static final String REACT_NAME = "Certificate";

    public CertificateModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_NAME;
    }

    @ReactMethod
    public void initClientWithCertificates(ReadableArray clusters, Promise promise) throws NoSuchAlgorithmException, InvalidAlgorithmParameterException, KeyManagementException {
        List<KeyManager> keys = new ArrayList<>();
        final X509TrustManager trustManager = getTrustManager();

        for (int i = 0; i < clusters.size(); i++) {
            ReadableMap cluster = clusters.getMap(i);
            ReadableMap certificate = cluster.hasKey("certificate") ? cluster.getMap("certificate") : null;

            if (certificate != null && certificate.hasKey("path")) {
                char[] password = certificate.getString("password").toCharArray();
                try {
                    KeyStore keyStore = KeyStore.getInstance("PKCS12");

                    keyStore.load(new FileInputStream(new File(getReactApplicationContext().getFilesDir() + "/" + certificate.getString("path"))), password);
                    KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
                    kmf.init(keyStore, password);
                    keys.addAll(Arrays.asList(kmf.getKeyManagers()));
                } catch (Exception e) {
                    Log.e("Cabin", "Error with cluster: " + cluster, e);
                    // wrong passphrase or something, ignore this certificate
                    // TODO: Reject promise with failed clusters ?
                }
            }
        }
        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(keys.size() > 0 ? keys.toArray(new KeyManager[keys.size()]) : null, new TrustManager[]{trustManager}, null);

        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(0, TimeUnit.MILLISECONDS)
                .readTimeout(0, TimeUnit.MILLISECONDS)
                .writeTimeout(0, TimeUnit.MILLISECONDS)
                .cookieJar(new ReactCookieJarContainer())
                .sslSocketFactory(sslContext.getSocketFactory(), trustManager)
                .build();

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
