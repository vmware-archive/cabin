package com.skippbox.cabin;

import android.content.Context;
import android.util.Log;

import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.react.modules.network.ReactCookieJarContainer;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.OkHttpClient;

class CabinOkHttpClientProvider {

    static void initialize(Context context) {
        try {
            OkHttpClientProvider.replaceOkHttpClient(CabinOkHttpClientProvider.createClient(context));
        } catch (Exception e) {
            // ignored
            Log.e("Cabin", e.getMessage(), e);
        }
    }

    private static OkHttpClient createClient(Context context) throws UnrecoverableKeyException, IOException, CertificateException, NoSuchAlgorithmException, KeyManagementException, KeyStoreException {
        return new OkHttpClient.Builder()
                .connectTimeout(0, TimeUnit.MILLISECONDS)
                .readTimeout(0, TimeUnit.MILLISECONDS)
                .writeTimeout(0, TimeUnit.MILLISECONDS)
                .cookieJar(new ReactCookieJarContainer())
                .sslSocketFactory(getSocketFactory(context), getTrustManager())
                .build();
    }

    public static SSLSocketFactory getSocketFactory(Context context) throws UnrecoverableKeyException, IOException, CertificateException, NoSuchAlgorithmException, KeyManagementException, KeyStoreException {

        // ** Keep this to support certificate authority check **
        //CertificateFactory cf = CertificateFactory.getInstance("X.509");
        //InputStream caRootInput = context.getAssets().open("MySSLCertificate_here.crt");
        //Certificate caRoot;
        //caRoot = cf.generateCertificate(caRootInput);
        // KeyStore and Trustmanager for SSL Certificate
        //KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
        //keyStore.load(null, null);
        //keyStore.setCertificateEntry("caRoot", caRoot);
        //TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        //tmf.init(keyStore);
        final X509TrustManager trustManager = CabinOkHttpClientProvider.getTrustManager();
        TrustManager[] tmf = new TrustManager[]{trustManager};

        // KeyStore and KeyManager for Client Certificate
        KeyManager[] keyManagers = new KeyManager[] {};
        String path = "apiserver.p12";
        String password = "";
        File authCert = new File(context.getFilesDir() + "/" + path);
        try {
            FileInputStream authCertStream = new FileInputStream(authCert);
            KeyStore keystore_auth = KeyStore.getInstance("PKCS12");
            keystore_auth.load(authCertStream, password.toCharArray());
            KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
            kmf.init(keystore_auth, password.toCharArray());
            keyManagers = kmf.getKeyManagers();
        } catch (Exception e) {
            // wrong path or password; ignored
        }

        SSLContext sslcontext = SSLContext.getInstance("TLSv1");
        sslcontext.init(keyManagers, tmf, null);
        return sslcontext.getSocketFactory();
    }

    public static X509TrustManager getTrustManager() {
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
