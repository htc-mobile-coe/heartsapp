package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SittingDateRequest;
import org.json.JSONException;
import org.json.JSONObject;

public class SittingDateRequestAssembler {
    public SittingDateRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        return SittingDateRequest.newBuilder()
                .setUId(jsonObj.optString("uId", ""))
                .setSittingDate(jsonObj.optString("sittingDate", ""))
                .setSittingNumber(jsonObj.optInt("sittingNumber", 1))
                .build();
    }
}
