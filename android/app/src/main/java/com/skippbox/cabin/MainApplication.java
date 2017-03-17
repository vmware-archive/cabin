package com.skippbox.cabin;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;

import com.facebook.react.ReactApplication;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.rnfs.RNFSPackage;

import java.util.Arrays;
import java.util.List;

import co.apptailor.googlesignin.RNGoogleSigninPackage;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.asList(
                    new MainReactPackage(),
            new ReactNativeConfigPackage(),
                    new CabinPackage(),
                    new OrientationPackage(),
                    new ReactMaterialKitPackage(),
                    new RNGoogleSigninPackage(),
                    new RNFSPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
}
