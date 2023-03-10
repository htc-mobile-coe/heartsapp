package com.hfn.unified.reactnative.modules.assemblers;

import com.google.protobuf.Timestamp;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.GetUserSessionsRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.MeansOfSittingsGiven;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.MeditationSessionList;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SittingType;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class GetUserSessionsRequestAssembler {
    public GetUserSessionsRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        JSONArray list = jsonObj.optJSONArray("meansThroughWhichSittingGiven");
        ArrayList<Integer> meansThroughWhichSittingGiven = new ArrayList<>();
        if (list != null) {
            for (int i=0;i<list.length();i++){
                meansThroughWhichSittingGiven.add(list.getInt(i));
            }
        }
        return GetUserSessionsRequest.newBuilder()
                .setUserId(jsonObj.optString("userId", ""))
                .setPageToken(jsonObj.optInt("pageToken", 0))
                .setFrom(Timestamp.newBuilder()
                        .setSeconds(jsonObj.getJSONObject("from").optLong("seconds", 0)).build())
                .setTo(Timestamp.newBuilder()
                        .setSeconds(jsonObj.getJSONObject("to").optLong("seconds", 0)).build())
                .setPageSize(jsonObj.optInt("pageSize", 10))
                .setSittingType(SittingType.forNumber(jsonObj.optInt("sittingType", 0)))
                .addAllMeansThroughWhichSittingGivenValue(meansThroughWhichSittingGiven)
                .build();

    }

    public static String toJson(MeditationSessionList meditationSessionList) throws JSONException {
        return ProtobufToJsonConverter.toJSON(meditationSessionList);

    }
}
