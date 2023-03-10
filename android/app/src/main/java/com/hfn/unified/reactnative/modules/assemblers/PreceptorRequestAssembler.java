package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.PreceptorRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SittingCommand;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.TimeZone;

public class PreceptorRequestAssembler {
    public PreceptorRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        PreceptorRequest.Builder builder = PreceptorRequest.newBuilder()
                .setPreceptorId(jsonObj.optString("preceptorId", ""))
                .setDeviceId(jsonObj.optString("deviceId", ""))
                .setMeditationSessionId(jsonObj.optString("meditationSessionId", ""))
                .setVersion(jsonObj.optString("version", ""))
                .setTimeZoneId(TimeZone.getDefault().getID());

        command(jsonObj, builder);
        return builder.build();
    }

    private void command(JSONObject json, PreceptorRequest.Builder builder) {
        builder.setCommand(SittingCommand.valueOf(json.optString("command", SittingCommand.INIT.name())));
    }
}
