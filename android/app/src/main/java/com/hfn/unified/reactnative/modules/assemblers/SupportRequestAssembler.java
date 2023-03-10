package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.profile.IntroSittingChannel;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SelfAttestIntroSittingRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SupportRequest;
import org.json.JSONException;
import org.json.JSONObject;

public class SupportRequestAssembler {
    public SupportRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        return SupportRequest.newBuilder()
                .setUId(jsonObj.optString("uId", ""))
                .setComment(jsonObj.optString("comment", ""))
                .setUserName(jsonObj.optString("userName", ""))
                .setUserEmail(jsonObj.optString("userEmail", ""))
                .setUserPhone(jsonObj.optString("userPhone", ""))
                .build();

    }
}
