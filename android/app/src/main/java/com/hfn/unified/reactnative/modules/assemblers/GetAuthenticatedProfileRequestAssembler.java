package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.profile.DeviceDetailRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.GetAuthenticatedProfileRequest;
import org.json.JSONException;
import org.json.JSONObject;

public class GetAuthenticatedProfileRequestAssembler {
    public GetAuthenticatedProfileRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        return GetAuthenticatedProfileRequest.newBuilder()
                .setUId(jsonObj.optString("uId", ""))
                .setIdToken(jsonObj.optString("idToken", ""))
                .setProfileId(jsonObj.optString("profileId", ""))
                .setEmail(jsonObj.optString("email", ""))
                .build();

    }
}
