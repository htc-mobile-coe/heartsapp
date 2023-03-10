package com.hfn.unified.reactnative.modules.assemblers;

import com.google.protobuf.Timestamp;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.PreceptorReportRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.MeansOfSittingsGiven;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class PreceptorReportRequestAssembler {
    public PreceptorReportRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        JSONArray list = jsonObj.optJSONArray("meansThroughWhichSittingGiven");
        ArrayList<Integer> meansThroughWhichSittingGiven = new ArrayList<>();
        if (list != null) {
            for (int i=0;i<list.length();i++){
                meansThroughWhichSittingGiven.add(list.getInt(i));
            }
        }
        return PreceptorReportRequest.newBuilder()
                .setPreceptorId(jsonObj.optString("preceptorId", ""))
                .setFrom(Timestamp.newBuilder()
                        .setSeconds(jsonObj.getJSONObject("from").optLong("seconds", 0)).build())
                .setTo(Timestamp.newBuilder()
                        .setSeconds(jsonObj.getJSONObject("to").optLong("seconds", 0)).build())
                .setEmail(jsonObj.optString("email", ""))
                .setTimeZoneId(jsonObj.optString("timeZoneId", ""))
                .addAllMeansThroughWhichSittingGivenValue(meansThroughWhichSittingGiven)
                .build();

    }
}
