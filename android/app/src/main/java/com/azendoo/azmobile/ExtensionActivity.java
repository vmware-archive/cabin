package com.azendoo.azmobile;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.rnfs.RNFSPackage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.annotation.Nullable;

public class ExtensionActivity extends ReactActivity {

    private Intent mIntent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        mIntent = getIntent();
        super.onCreate(savedInstanceState);
    }

    @Override
    protected String getMainComponentName() {
        return "Extension";
    }

    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.asList(
                new MainReactPackage(),
                new CookieManagerPackage(),
                new ReactAzendooPackage(),
                new ReactMaterialKitPackage(),
                new RNDeviceInfo(),
                new LinearGradientPackage(),
                new RNFSPackage()
        );
    }

    @Nullable
    @Override
    protected Bundle getLaunchOptions() {
        final String action = mIntent.getAction();
        Bundle options = new Bundle();

        options.putString("type", "SHARE");
        if (mIntent.hasExtra(Intent.EXTRA_TEXT)) {
            String body = mIntent.getStringExtra(Intent.EXTRA_TEXT);

            if (mIntent.hasExtra(Intent.EXTRA_SUBJECT)) {
                body = mIntent.getStringExtra(Intent.EXTRA_SUBJECT) + " " + body;
            }
            options.putString("text", body);
        }
        if (mIntent.hasExtra(Intent.EXTRA_STREAM)) {
            Bundle[] files = null;

            if (action.equals(Intent.ACTION_SEND_MULTIPLE)) {
                ArrayList<Uri> uris = mIntent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
                final int length = uris.size();
                files = new Bundle[length];
                for (int i = 0; i < length; i++) {
                    files[i] = UriUtils.getFileBundle(getApplicationContext(), uris.get(i));
                }
            } else if (action.equals(Intent.ACTION_SEND)) {
                files = new Bundle[1];
                Uri uri = mIntent.getParcelableExtra(Intent.EXTRA_STREAM);
                files[0] = UriUtils.getFileBundle(getApplicationContext(), uri);
            }
            if (files != null)
                options.putParcelableArray("files", files);
        }
        return options;
    }
}
