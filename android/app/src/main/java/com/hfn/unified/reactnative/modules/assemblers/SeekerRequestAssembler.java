package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SeekerRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SittingCommand;
import org.json.JSONException;
import org.json.JSONObject;

public class SeekerRequestAssembler {
    public SeekerRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        SeekerRequest.Builder builder = SeekerRequest.newBuilder()
                .setSeekerId(jsonObj.optString("seekerId", ""))
                .setDeviceId(jsonObj.optString("deviceId", ""))
                .setMeditationSessionId(jsonObj.optString("meditationSessionId", ""))
                .setVersion(jsonObj.optString("version", ""))
                .setNoOfAdditionalSeekers(jsonObj.optInt("noOfAdditionalSeekers", 0));

        command(jsonObj, builder);
        return builder.build();
    }

    private void command(JSONObject json, SeekerRequest.Builder builder) {
        builder.setCommand(SittingCommand.valueOf(json.optString("command", SittingCommand.INIT.name())));
    }
}
