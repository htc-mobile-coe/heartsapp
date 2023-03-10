package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.PreceptorDNDRequest;
import org.json.JSONException;
import org.json.JSONObject;

public class PreceptorDNDRequestAssembler {
    public PreceptorDNDRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        PreceptorDNDRequest.Builder builder = PreceptorDNDRequest.newBuilder()
                .setPreceptorId(jsonObj.optString("preceptorId", ""))
                .setDeviceId(jsonObj.optString("deviceId", ""))
                .setDndDurationInSeconds(jsonObj.optInt("dndDurationInSeconds", 0));

        return builder.build();
    }
}
