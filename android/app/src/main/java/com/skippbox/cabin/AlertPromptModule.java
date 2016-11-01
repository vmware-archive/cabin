package com.skippbox.cabin;

import android.app.Activity;
import android.app.FragmentManager;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.modules.dialog.AlertFragment;

import java.util.Map;

public class AlertPromptModule extends ReactContextBaseJavaModule {

    /* package */ static final String ACTION_BUTTON_CLICKED = "buttonClicked";
    /* package */ static final String ACTION_DISMISSED = "dismissed";
    /* package */ static final String KEY_BUTTON_POSITIVE = "buttonPositive";
    /* package */ static final String KEY_BUTTON_NEGATIVE = "buttonNegative";
    /* package */ static final String KEY_BUTTON_NEUTRAL = "buttonNeutral";

    /* package */ static final String FRAGMENT_TAG =
            "com.facebook.catalyst.react.dialog.DialogModule";

    /* package */ static final Map<String, Object> CONSTANTS = MapBuilder.<String, Object>of(
            ACTION_BUTTON_CLICKED, ACTION_BUTTON_CLICKED,
            ACTION_DISMISSED, ACTION_DISMISSED,
            KEY_BUTTON_POSITIVE, DialogInterface.BUTTON_POSITIVE,
            KEY_BUTTON_NEGATIVE, DialogInterface.BUTTON_NEGATIVE,
            KEY_BUTTON_NEUTRAL, DialogInterface.BUTTON_NEUTRAL);

    public AlertPromptModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "DialogPromptModuleAndroid";
    }

    @Override
    public Map<String, Object> getConstants() {
        return CONSTANTS;
    }

    @ReactMethod
    public void prompt(@Nullable String title, @Nullable String message, ReadableArray actions, Callback actionCallback) {
        Activity activity = getCurrentActivity();

        if (activity == null) {
            return ;
        }
        FragmentManager manager = activity.getFragmentManager();
        AlertFragment oldFragment = (AlertFragment) manager.findFragmentByTag(FRAGMENT_TAG);
        if (oldFragment != null) {
            oldFragment.dismiss();
        }
        Bundle args = new Bundle();
        args.putString("title", title);
        args.putString("message", message);
        args.putStringArray("actions", toStringArray(actions));
        AlertPromptFragment alertPromptFragment = new AlertPromptFragment(new AlertFragmentListener(actionCallback), args);
        alertPromptFragment.show(manager, FRAGMENT_TAG);
    }

    @Nullable
    public static String[] toStringArray(ReadableArray array) {
        if (array == null) {
            return null;
        }
        final int size = array.size();
        String[] ret = new String[size];

        for (int i = 0; i < size; i++) {
            ret[i] = array.getString(i);
        }
        return ret;
    }

    /* package */ class AlertFragmentListener {

        private final Callback mCallback;
        private boolean mCallbackConsumed = false;

        AlertFragmentListener(Callback callback) {
            mCallback = callback;
        }

        void onClick(DialogInterface dialog, int which, String text) {
            if (!mCallbackConsumed) {
                if (getReactApplicationContext().hasActiveCatalystInstance()) {
                    mCallback.invoke(ACTION_BUTTON_CLICKED, which, text);
                    mCallbackConsumed = true;
                }
            }
        }

        void onDismiss(DialogInterface dialog) {
            if (!mCallbackConsumed) {
                if (getReactApplicationContext().hasActiveCatalystInstance()) {
                    mCallback.invoke(ACTION_DISMISSED);
                    mCallbackConsumed = true;
                }
            }
        }
    }
}
