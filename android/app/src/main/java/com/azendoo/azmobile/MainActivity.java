package com.azendoo.azmobile;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import com.BV.LinearGradient.LinearGradientPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.shell.MainReactPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.rnfs.RNFSPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    private ReactNativePushNotificationPackage mNativePushNotificationPackage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Initialize this package before calling onCreate as onCreate will instantiate the packages
        mNativePushNotificationPackage = new ReactNativePushNotificationPackage(this);
        super.onCreate(savedInstanceState);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Companion";
    }

    @Override
    protected String getJSBundleFile() {
        return CodePush.getBundleUrl();
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.asList(
                new MainReactPackage(),
                new CookieManagerPackage(),
                new ReactAzendooPackage(),
                new ReactMaterialKitPackage(),
                new RNDeviceInfo(),
                new CodePush("XgYF9ovl6tAfEoJo3Lq1xh_WIDn-EJI7ESLZe", this, BuildConfig.DEBUG),
                new LinearGradientPackage(),
                mNativePushNotificationPackage,
                new RNFSPackage(),
                new WebViewBridgePackage()
        );
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        String action = intent.getAction();
        Uri uri = intent.getData();

        // TODO: Remove once https://github.com/facebook/react-native/pull/7739 is merged
        if (Intent.ACTION_VIEW.equals(action) && uri != null &&
                mReactInstanceManager != null && mReactInstanceManager.getCurrentReactContext() != null) {
            WritableMap map = Arguments.createMap();

            map.putString("url", uri.toString());
            mReactInstanceManager.getCurrentReactContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("openURL", map);
        }
        mNativePushNotificationPackage.newIntent(intent);
    }

    private ReactInstanceManager mReactInstanceManager;

    @Override
    protected ReactInstanceManager createReactInstanceManager() {
        mReactInstanceManager = super.createReactInstanceManager();
        return mReactInstanceManager;
    }
}
