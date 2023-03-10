package com.hfn.unified.reactnative.modules.assemblers;

import com.google.protobuf.Timestamp;

import org.heartfulness.unifiedplatform.interfaces.grpc.profile.IntroSittingChannel;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SelfAttestIntroSittingRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.LogRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Log;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class LogRequestAssembler {
    public LogRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        LogRequest.Builder builder = LogRequest.newBuilder()
                .setUId(jsonObj.optString("uId", ""));

        logs(jsonObj, builder);

        return builder.build();
    }

    private void logs(JSONObject json, LogRequest.Builder builder) throws JSONException {
        JSONArray arr = json.optJSONArray("logs");

        for (int i = 0; i < arr.length(); i++) {
            builder.addLogs(log(arr.getJSONObject(i)));
        }
    }

    private Log log(JSONObject json) throws JSONException {
        return Log.newBuilder()
                .setTime(time(json.getJSONObject("time")))
                .setMessage(json.getString("message"))
                .putAllPayload(payload(json.getJSONObject("payload"))).build();
    }

    private Timestamp time(JSONObject json) throws JSONException {
        return Timestamp.newBuilder().setSeconds(json.getLong("seconds")).build();
    }

    private Map<String, String> payload(JSONObject json) throws JSONException {

        Map<String, String> payloadMap = new HashMap<>();
        Iterator<String> it = json.keys();

        while(it.hasNext()) {
            String key = it.next();
            payloadMap.put(key, json.getString(key));
        }

        return payloadMap;
    }
}