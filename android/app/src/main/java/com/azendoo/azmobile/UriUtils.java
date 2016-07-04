package com.azendoo.azmobile;

import android.content.ContentResolver;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;

public class UriUtils {

    public static final String URI_PARAM = "uri";
    public static final String FILENAME_PARAM = "filename";
    public static final String TYPE_PARAM = "type";

    public static String getFilenameForUri(Context context, Uri uri) {
        String result = null;
        if (uri.getScheme().equals("content")) {
            Cursor cursor = context.getContentResolver().query(uri, new String[] {OpenableColumns.DISPLAY_NAME}, null, null, null);
            try {
                if (cursor != null && cursor.moveToFirst()) {
                    result = cursor.getString(cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME));
                }
            } finally {
                if (cursor != null)
                    cursor.close();
            }
        }
        if (result == null) {
            result = uri.getPath();
            int cut = result.lastIndexOf('/');
            if (cut != -1) {
                result = result.substring(cut + 1);
            }
        }
        return result;
    }

    public static String getTypeForUri(Context context, Uri uri) {
        ContentResolver contentResolver = context.getContentResolver();

        return contentResolver.getType(uri);
    }

    public static Bundle getFileBundle(Context context, Uri uri) {
        Bundle bundle = new Bundle();

        bundle.putString(UriUtils.URI_PARAM, uri.toString());
        bundle.putString(UriUtils.FILENAME_PARAM, getFilenameForUri(context, uri));
        bundle.putString(UriUtils.TYPE_PARAM, getTypeForUri(context, uri));
        // TODO: If image, get size
        return bundle;
    }
}
