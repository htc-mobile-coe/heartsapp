package com.hfn.unified.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.hfn.unified.reactnative.modules.ApplicationBootstrapModule;
import com.hfn.unified.reactnative.modules.ApplicationConstantsModule;
import com.hfn.unified.reactnative.modules.DonationServiceReactModule;
import com.hfn.unified.reactnative.modules.MeditationServiceReactModule;
import com.hfn.unified.reactnative.modules.DeviceCapabilitiesReactModule;
import com.hfn.unified.reactnative.modules.ProfileServiceReactModule;
import com.hfn.unified.reactnative.modules.SubscriptionServiceReactModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ReactPackage implements com.facebook.react.ReactPackage {

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ApplicationBootstrapModule(reactContext));
        modules.add(new ProfileServiceReactModule(reactContext));
        modules.add(new MeditationServiceReactModule(reactContext));
        modules.add(new SubscriptionServiceReactModule(reactContext));
        modules.add(new DonationServiceReactModule(reactContext));
        modules.add(new ApplicationConstantsModule(reactContext));
        modules.add(new DeviceCapabilitiesReactModule(reactContext));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
