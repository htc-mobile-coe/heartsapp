package com.hfn.unified.reactnative;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.hfn.unified.reactnative.modules.assemblers.PreceptorResponseAssembler;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.PreceptorRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.PreceptorResponse;

import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;

import static com.hfn.unified.reactnative.modules.Constants.ERROR_CLASS;
import static com.hfn.unified.reactnative.modules.Constants.ERROR_CODE;
import static com.hfn.unified.reactnative.modules.Constants.ERROR_DESCRIPTION;
import static com.hfn.unified.reactnative.modules.Constants.MESSAGE;
import static com.hfn.unified.reactnative.modules.Constants.PRECEPTOR_SESSION_STREAMING_ON_ERROR;
import static com.hfn.unified.reactnative.modules.Constants.PRECEPTOR_SESSION_STREAMING_ON_NEXT;
import static com.hfn.unified.reactnative.modules.Constants.PRECEPTOR_SESSION_STREAMING_ON_COMPLETED;

public class PreceptorSessionStreamContext implements StreamObserver<PreceptorResponse> {

    private ReactApplicationContext reactContext;
    private StreamObserver<PreceptorRequest> requestObserver;

    public PreceptorSessionStreamContext(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public void onNext(PreceptorResponse response) {
        WritableMap payload = Arguments.createMap();
        payload.putString(MESSAGE, new PreceptorResponseAssembler().toJson(response));

        this.reactContext
                .getJSModule(
                        DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(PRECEPTOR_SESSION_STREAMING_ON_NEXT, payload);
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
                .emit(PRECEPTOR_SESSION_STREAMING_ON_ERROR, payload);
    }

    @Override
    public void onCompleted() {
        this.reactContext
                .getJSModule(
                        DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(PRECEPTOR_SESSION_STREAMING_ON_COMPLETED, Arguments.createMap());
    }

    public void setRequestObserver(StreamObserver<PreceptorRequest> requestObserver) {
        this.requestObserver = requestObserver;
    }

    public StreamObserver<PreceptorRequest> getRequestObserver() {
        return this.requestObserver;
    }
}
