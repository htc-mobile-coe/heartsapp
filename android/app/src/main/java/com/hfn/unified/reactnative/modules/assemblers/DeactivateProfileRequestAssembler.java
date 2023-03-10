package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.profile.DeactivateProfileRequest;
import org.json.JSONException;
import org.json.JSONObject;

public class DeactivateProfileRequestAssembler {
    public DeactivateProfileRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        return DeactivateProfileRequest.newBuilder()
                .setUId(jsonObj.optString("uId", ""))
                .build();
    }
}
