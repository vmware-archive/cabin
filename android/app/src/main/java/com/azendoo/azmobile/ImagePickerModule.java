package com.azendoo.azmobile;

import android.app.Activity;
import android.content.ClipData;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.support.v7.app.AlertDialog;
import android.widget.ArrayAdapter;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ImagePickerModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final String REACT_MODULE = "UIImagePickerManager";

    private static final String ERROR_NO_ACTIVITY = "E_NO_ACTIVITY";
    private static final String ERROR_UNKNOWN = "E_UNKNOWN";

    private static final int REQUEST_CAPTURE = 0x0001;
    private static final int REQUEST_PICK = 0x0002;

    public ImagePickerModule(ReactApplicationContext reactContext) {
        super(reactContext);

        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return REACT_MODULE;
    }

    @ReactMethod
    public void showImagePicker(final ReadableMap options, final Promise promise) {
        String cancelButtonTitle = getReactApplicationContext().getString(android.R.string.cancel);

        final List<String> titles = new ArrayList<>();
        final List<String> actions = new ArrayList<>();

        if (options.hasKey("takePhotoButtonTitle") &&
                getReactApplicationContext().getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA)) {
            titles.add(options.getString("takePhotoButtonTitle"));
            actions.add("photo");
        }
        if (options.hasKey("chooseFromLibraryButtonTitle")) {
            titles.add(options.getString("chooseFromLibraryButtonTitle"));
            actions.add("library");
        }

        if (options.hasKey("customButtons")) {
            ReadableMap buttons = options.getMap("customButtons");
            ReadableMapKeySetIterator it = buttons.keySetIterator();
            // Keep the current size as the iterator returns the keys in the reverse order they are defined
            int currentIndex = titles.size();
            while (it.hasNextKey()) {
                String key = it.nextKey();

                titles.add(currentIndex, key);
                actions.add(currentIndex, buttons.getString(key));
            }
        }

        if (options.hasKey("cancelButtonTitle")) {
            cancelButtonTitle = options.getString("cancelButtonTitle");
        }
        titles.add(cancelButtonTitle);
        actions.add("cancel");

        AlertDialog.Builder builder = null;
        ArrayAdapter<String> adapter = null;
        try {
            Activity currentActivity = getCurrentActivity();

            adapter = new ArrayAdapter<>(currentActivity,
                    android.R.layout.select_dialog_item, titles);
            builder = new AlertDialog.Builder(currentActivity);
            if (options.hasKey("title")) {
                builder.setTitle(options.getString("title"));
            }
        } catch (Exception e) {
            promise.reject(ERROR_NO_ACTIVITY, "No Activity currently attached", e);
            return;
        }

        final WritableMap response = Arguments.createMap();

        builder.setAdapter(adapter, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int index) {
                String action = actions.get(index);

                switch (action) {
                    case "photo":
                        showImagePickerCamera(options, promise);
                        break;
                    case "library":
                        showImagePickerLibrary(options, promise);
                        break;
                    case "cancel":
                        response.putBoolean("didCancel", true);
                        promise.resolve(response);
                        break;
                    default: // custom button
                        response.putString("customButton", action);
                        promise.resolve(response);
                }
            }
        });

        AlertDialog dialog = builder.create();

        dialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                dialog.dismiss();
                response.putBoolean("didCancel", true);
                promise.resolve(response);
            }
        });
        dialog.show();
    }

    private Uri mTmpFileUri;

    @ReactMethod
    public void showImagePickerCamera(final ReadableMap options, final Promise promise) {
        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE); // ACTION_VIDEO_CAPTURE

        try {
            String filename = "image-" + UUID.randomUUID().toString();
            File imageFile = null;
            imageFile = File.createTempFile(filename, ".jpg", getReactApplicationContext().getCacheDir());
            if (!imageFile.setWritable(true, false)) {
                throw new IOException("Unable to set write permission on file");
            }
            mTmpFileUri = Uri.fromFile(imageFile);
            intent.putExtra(MediaStore.EXTRA_OUTPUT, mTmpFileUri);
        } catch (IOException e) {
            promise.reject(ERROR_UNKNOWN, "Cannot save tmp file", e);
        }
        intent.putExtra("outputX", 2048);
        intent.putExtra("outputY", 2048);
        startActivityForResult(intent, REQUEST_CAPTURE, promise);
    }

    @ReactMethod
    public void showImagePickerLibrary(final ReadableMap options, final Promise promise) {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("*/*");
        if (Build.VERSION.SDK_INT >= 18) {
            intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        }
//        intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);
        intent.addCategory(Intent.CATEGORY_OPENABLE);

        startActivityForResult(intent, REQUEST_PICK, promise);
    }

    private Promise mPromise = null;

    private void startActivityForResult(Intent intent, int requestCode, final Promise promise) {
        Activity currentActivity = getCurrentActivity();

        try {
            currentActivity.startActivityForResult(intent, requestCode);
            mPromise = promise;
        } catch (Exception e) {
            promise.reject(ERROR_NO_ACTIVITY, "No activity attached", e);
        }
    }

    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        if (mPromise == null || (requestCode != REQUEST_CAPTURE && requestCode != REQUEST_PICK)) {
            return;
        }

        final WritableMap response = Arguments.createMap();

        if (resultCode == Activity.RESULT_CANCELED) {
            response.putBoolean("didCancel", true);
            mPromise.resolve(response);
        } else if (resultCode == Activity.RESULT_OK) {
            WritableArray uris = Arguments.createArray();

            if (mTmpFileUri != null && requestCode == REQUEST_CAPTURE) {
                WritableMap uri = Arguments.createMap();
                uri.putString(UriUtils.URI_PARAM, mTmpFileUri.toString());
                uri.putString(UriUtils.TYPE_PARAM, "image/jpeg");
                uri.putString(UriUtils.FILENAME_PARAM, mTmpFileUri.getLastPathSegment());
                uris.pushMap(uri);
            } else {
                ClipData clip = data.getClipData();

                if (clip != null) {
                    for (int i = 0; i < clip.getItemCount(); i++) {
                        WritableMap uriMap = Arguments.createMap();
                        Uri uri = clip.getItemAt(i).getUri();
                        uriMap.putString(UriUtils.URI_PARAM, uri.toString());
                        uriMap.putString(UriUtils.TYPE_PARAM, UriUtils.getTypeForUri(getReactApplicationContext(), uri));
                        uriMap.putString(UriUtils.FILENAME_PARAM, UriUtils.getFilenameForUri(getReactApplicationContext(), uri));
                        uris.pushMap(uriMap);
                    }
                } else {
                    WritableMap uriMap = Arguments.createMap();
                    Uri uri = data.getData();
                    uriMap.putString(UriUtils.URI_PARAM, uri.toString());
                    uriMap.putString(UriUtils.TYPE_PARAM, UriUtils.getTypeForUri(getReactApplicationContext(), uri));
                    uriMap.putString(UriUtils.FILENAME_PARAM, UriUtils.getFilenameForUri(getReactApplicationContext(), uri));
                    uris.pushMap(uriMap);
                }
            }
            response.putArray("medias", uris);
            mPromise.resolve(response);
        } else {
            mPromise.reject(ERROR_UNKNOWN, "Unable to get result from library/camera");
        }
        mTmpFileUri = null;
        mPromise = null;
    }
}
