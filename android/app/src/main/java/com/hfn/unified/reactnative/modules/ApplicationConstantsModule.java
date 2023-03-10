package com.hfn.unified.reactnative.modules;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.hfn.unified.BuildConfig;

import java.util.HashMap;
import java.util.Map;

public class ApplicationConstantsModule extends ReactContextBaseJavaModule {

    public ApplicationConstantsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("GOOGLE_APP_ID", BuildConfig.GOOGLE_APP_ID);
        constants.put("PUSH_NOTIFICATION_SENDER_ID", BuildConfig.PUSH_NOTIFICATION_SENDER_ID);
        constants.put("DONATION_URL", BuildConfig.DONATION_URL);
        constants.put("RECURRING_DONATION_URL", BuildConfig.RECURRING_DONATION_URL);
        constants.put("STATES_IN_COUNTRY_URL", BuildConfig.STATES_IN_COUNTRY_URL);
        constants.put("GOOGLE_PLACE_API_KEY", BuildConfig.GOOGLE_PLACE_API_KEY);
        constants.put("GOOGLE_GEOCODE_URL", BuildConfig.GOOGLE_GEOCODE_URL);
        constants.put("GOOGLE_PLACE_DETAILS_URL", BuildConfig.GOOGLE_PLACE_DETAILS_URL);
        constants.put("MY_SRCM_CITIES_URL", BuildConfig.MY_SRCM_CITIES_URL);
        constants.put("SEARCH_SEEKER_URL", BuildConfig.SEARCH_SEEKER_URL);
        constants.put("MYSRCM_CLIENT_ID", BuildConfig.MYSRCM_CLIENT_ID);
        return constants;
    }

    @NonNull
    @Override
    public String getName() {
        return "ApplicationConstants";
    }
}
