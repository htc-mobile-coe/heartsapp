package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.profile.IntroSittingChannel;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SelfAttestIntroSittingRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.subscription.SubmitFeedbackRequest;
import org.json.JSONException;
import org.json.JSONObject;

public class SubmitFeedbackRequestAssembler {
    public SubmitFeedbackRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        return SubmitFeedbackRequest.newBuilder()
                .setUserId(jsonObj.optString("uId", ""))
                .setComments(jsonObj.optString("comments", ""))
                .setPriorityOptionId("4")
                .setProblemTypeOptionId("9")
                .build();

    }
}
