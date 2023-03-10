package com.hfn.unified.reactnative;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.hfn.unified.reactnative.modules.assemblers.SeekerResponseAssembler;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SeekerRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SeekerResponse;

import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;

import static com.hfn.unified.reactnative.modules.Constants.ERROR_CLASS;
import static com.hfn.unified.reactnative.modules.Constants.ERROR_CODE;
import static com.hfn.unified.reactnative.modules.Constants.ERROR_DESCRIPTION;
import static com.hfn.unified.reactnative.modules.Constants.MESSAGE;
import static com.hfn.unified.reactnative.modules.Constants.SEEKER_SESSION_STREAMING_ON_ERROR;
import static com.hfn.unified.reactnative.modules.Constants.SEEKER_SESSION_STREAMING_ON_NEXT;
import static com.hfn.unified.reactnative.modules.Constants.SEEKER_SESSION_STREAMING_ON_COMPLETED;

public class SeekerSessionStreamContext implements StreamObserver<SeekerResponse> {

    private ReactApplicationContext reactContext;

    public SeekerSessionStreamContext(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public void onNext(SeekerResponse response) {
        WritableMap payload = Arguments.createMap();
        payload.putString(MESSAGE, new SeekerResponseAssembler().toJson(response));

        this.reactContext
                .getJSModule(
                        DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(SEEKER_SESSION_STREAMING_ON_NEXT, payload);
    }

    @Override
    public void onError(Throwable t) {
        WritableMap payload = Arguments.createMap();

        if(t instanceof StatusRuntimeException) {
            StatusRuntimeException re = (StatusRuntimeException)t;
            payload.putString(ERROR_CLASS, re.getClass().getName());

            if(re.getStatus() == null) {
                payload.putString(ERROR_CODE, "StatusNull");
            } else if(re.getStatus().getCode() == null) {
                payload.putString(ERROR_CODE, "StatusCodeNull");
                payload.putString(ERROR_DESCRIPTION, re.getStatus().getDescription());
            } else {
                payload.putString(ERROR_CODE, re.getStatus().getCode().name());
                payload.putString(ERROR_DESCRIPTION, re.getStatus().getDescription());
            }
        }

        Log.e(getClass().toString(), "onError: ",t );
        t.printStackTrace();


        payload.putString(MESSAGE, t.toString());

        this.reactContext
                .getJSModule(
                        DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(SEEKER_SESSION_STREAMING_ON_ERROR, payload);
    }

    @Override
    public void onCompleted() {
        this.reactContext
                .getJSModule(
                        DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(SEEKER_SESSION_STREAMING_ON_COMPLETED, Arguments.createMap());
    }

    private StreamObserver<SeekerRequest> requestObserver;

    public void setRequestObserver(StreamObserver<SeekerRequest> requestObserver) {
        this.requestObserver = requestObserver;
    }

    public StreamObserver<SeekerRequest> getRequestObserver() {
        return this.requestObserver;
    }
}
