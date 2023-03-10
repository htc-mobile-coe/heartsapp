package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.profile.IntroSittingChannel;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SelfAttestIntroSittingRequest;
import org.json.JSONException;
import org.json.JSONObject;

public class SelfAttestIntroSittingRequestAssembler {
    public SelfAttestIntroSittingRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        return SelfAttestIntroSittingRequest.newBuilder()
                .setUId(jsonObj.optString("uId", ""))
                .setIdToken(jsonObj.optString("idToken", ""))
                .setNotes(jsonObj.optString("notes", ""))
                .setChannel(IntroSittingChannel.valueOf(jsonObj.optString("channel", "NONE")))
                .build();

    }
}
