/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 * <p>
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
package com.skippbox.cabin;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.annotation.Nullable;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.Buffer;
import okio.ByteString;

@ReactModule(name = "WebSocketModule", canOverrideExistingModule = true)
public class CabinWebsocketModule extends ReactContextBaseJavaModule {

    private final Map<Integer, WebSocket> mWebSocketConnections = new HashMap<>();

    public CabinWebsocketModule(ReactApplicationContext context) {
        super(context);
    }

    private void sendEvent(String eventName, WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public String getName() {
        return "WebSocketModule";
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }

    @ReactMethod
    public void connect(
            final String url,
            @Nullable final ReadableArray protocols,
            @Nullable final ReadableMap headers,
            final int id) {
        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .readTimeout(0, TimeUnit.MINUTES)
                .build(); // Disable timeouts for read

        Request.Builder builder = new Request.Builder()
                .tag(id)
                .url(url);

        if (headers != null) {
            ReadableMapKeySetIterator iterator = headers.keySetIterator();

            if (!headers.hasKey("origin")) {
                builder.addHeader("origin", setDefaultOrigin(url));
            }

            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                if (ReadableType.String.equals(headers.getType(key))) {
                    builder.addHeader(key, headers.getString(key));
                } else {
                    FLog.w(
                            ReactConstants.TAG,
                            "Ignoring: requested " + key + ", value not a string");
                }
            }
        } else {
            builder.addHeader("origin", setDefaultOrigin(url));
        }

        if (protocols != null && protocols.size() > 0) {
            StringBuilder protocolsValue = new StringBuilder("");
            for (int i = 0; i < protocols.size(); i++) {
                String v = protocols.getString(i).trim();
                if (!v.isEmpty() && !v.contains(",")) {
                    protocolsValue.append(v);
                    protocolsValue.append(",");
                }
            }
            if (protocolsValue.length() > 0) {
                protocolsValue.replace(protocolsValue.length() - 1, protocolsValue.length(), "");
                builder.addHeader("Sec-WebSocket-Protocol", protocolsValue.toString());
            }
        }

        client.newWebSocket(builder.build(), new WebSocketListener() {

            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                mWebSocketConnections.put(id, webSocket);
                WritableMap params = Arguments.createMap();
                params.putInt("id", id);
                sendEvent("websocketOpen", params);
            }

            @Override
            public void onClosing(WebSocket websocket, int code, String reason) {
                WritableMap params = Arguments.createMap();
                params.putInt("id", id);
                params.putInt("code", code);
                params.putString("reason", reason);
                sendEvent("websocketClosed", params);
            }

            @Override
            public void onFailure(WebSocket websocket, Throwable t, Response response) {
                notifyWebSocketFailed(id, t.getMessage());
            }

            @Override
            public void onMessage(WebSocket websocket, String text) {
                WritableMap params = Arguments.createMap();
                params.putInt("id", id);
                params.putString("data", text);
                params.putString("type", "binary");
                sendEvent("websocketMessage", params);
            }
        });

        // Trigger shutdown of the dispatcher's executor so this process can exit cleanly
        client.dispatcher().executorService().shutdown();
    }

    @ReactMethod
    public void close(int code, String reason, int id) {
        WebSocket client = mWebSocketConnections.get(id);
        if (client == null) {
            // WebSocket is already closed
            // Don't do anything, mirror the behaviour on web
            return;
        }
        try {
            client.close(code, reason);
            mWebSocketConnections.remove(id);
        } catch (Exception e) {
            FLog.e(
                    ReactConstants.TAG,
                    "Could not close WebSocket connection for id " + id,
                    e);
        }
    }

    @ReactMethod
    public void send(String message, int id) {
        WebSocket client = mWebSocketConnections.get(id);
        if (client == null) {
            // This is a programmer error
            throw new RuntimeException("Cannot send a message. Unknown WebSocket id " + id);
        }
        try {
            client.send(message);
        } catch (Exception e) {
            notifyWebSocketFailed(id, e.getMessage());
        }
    }

    @ReactMethod
    public void sendBinary(String base64String, int id) {
        WebSocket client = mWebSocketConnections.get(id);
        if (client == null) {
            // This is a programmer error
            throw new RuntimeException("Cannot send a message. Unknown WebSocket id " + id);
        }
        try {
            client.send(ByteString.decodeBase64(base64String));
        } catch (Exception e) {
            notifyWebSocketFailed(id, e.getMessage());
        }
    }

    @ReactMethod
    public void ping(int id) {
        WebSocket client = mWebSocketConnections.get(id);
        if (client == null) {
            // This is a programmer error
            throw new RuntimeException("Cannot send a message. Unknown WebSocket id " + id);
        }
        try {
            Buffer buffer = new Buffer();
        } catch (Exception e) {
            notifyWebSocketFailed(id, e.getMessage());
        }
    }

    private void notifyWebSocketFailed(int id, String message) {
        WritableMap params = Arguments.createMap();
        params.putInt("id", id);
        params.putString("message", message);
        sendEvent("websocketFailed", params);
    }

    /**
     * Set a default origin
     *
     * @return A string of the endpoint converted to HTTP protocol
     */
    private static String setDefaultOrigin(String uri) {
        try {
            String defaultOrigin;
            String scheme = "";

            URI requestURI = new URI(uri);
            if (requestURI.getScheme().equals("wss")) {
                scheme += "https";
            } else if (requestURI.getScheme().equals("ws")) {
                scheme += "http";
            }

            if (requestURI.getPort() != -1) {
                defaultOrigin = String.format(
                        "%s://%s:%s",
                        scheme,
                        requestURI.getHost(),
                        requestURI.getPort());
            } else {
                defaultOrigin = String.format("%s://%s/", scheme, requestURI.getHost());
            }

            return defaultOrigin;
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("Unable to set " + uri + " as default origin header.");
        }
    }
}