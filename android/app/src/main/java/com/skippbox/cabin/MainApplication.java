package com.skippbox.cabin;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;

import com.facebook.react.modules.network.OkHttpClientProvider;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.rnfs.RNFSPackage;
import com.reactnativenavigation.NavigationApplication;

import java.util.Arrays;
import java.util.List;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import okhttp3.OkHttpClient;

public class MainApplication extends NavigationApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return getPackages();
        }
    };

    protected List<ReactPackage> getPackages() {
        return Arrays.asList(
                new MainReactPackage(),
                new SnackbarPackage(),
                new RNFetchBlobPackage(),
                new RNGoogleSigninPackage(),
                new ReactNativeConfigPackage(),
                new CabinPackage(),
                new OrientationPackage(),
                new ReactMaterialKitPackage(),
                new RNFSPackage()
        );
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        CertificateModule.setupClient(OkHttpClientProvider.getOkHttpClient());
    }

    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
