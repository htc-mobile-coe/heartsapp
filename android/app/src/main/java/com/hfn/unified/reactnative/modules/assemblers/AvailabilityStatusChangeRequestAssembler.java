package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.AvailabilityStatusChangeRequest;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.TimeZone;

public class AvailabilityStatusChangeRequestAssembler {
    public AvailabilityStatusChangeRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        AvailabilityStatusChangeRequest.Builder builder = AvailabilityStatusChangeRequest.newBuilder()
                .setPreceptorId(jsonObj.optString("preceptorId", ""))
                .setStatus(jsonObj.optBoolean("status", false))
                .setTimeZoneId(TimeZone.getDefault().getID());
        return builder.build();
    }
}
