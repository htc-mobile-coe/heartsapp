package com.hfn.unified.reactnative.modules;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.hfn.unified.reactnative.modules.assemblers.SubmitFeedbackRequestAssembler;
import com.hfn.unified.remote.GRPCClientFactory;

import org.heartfulness.unifiedplatform.interfaces.grpc.subscription.SubmitFeedbackRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.subscription.SubmitFeedbackResponse;

import org.json.JSONException;

import static com.hfn.unified.reactnative.modules.Constants.FIREBASE_ID_TOKEN;
import static com.hfn.unified.reactnative.modules.Constants.MESSAGE;

public class SubscriptionServiceReactModule extends ReactContextBaseJavaModule {

    public SubscriptionServiceReactModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void submitFeedbackToHelpDesk(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            SubmitFeedbackRequest request = new SubmitFeedbackRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            SubmitFeedbackResponse response = GRPCClientFactory.get().subscriptionService().submitFeedbackToHelpDesk(firebaseIdToken, request);
            responsePromise.resolve(true);
        } catch (JSONException e) {
            Log.d("SFTHDJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "SubscriptionService";
    }
}
