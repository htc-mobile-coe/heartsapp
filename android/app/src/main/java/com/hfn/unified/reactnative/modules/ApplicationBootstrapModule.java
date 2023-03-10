package com.hfn.unified.reactnative.modules;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class ApplicationBootstrapModule extends ReactContextBaseJavaModule {

    public ApplicationBootstrapModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void initialize(final ReadableMap requestMap, final Promise responsePromise) {

    }

    @ReactMethod
    public void cleanup(final ReadableMap requestMap, final Promise responsePromise) {

    }

    @NonNull
    @Override
    public String getName() {
        return "ApplicationBootstrap";
    }
}
