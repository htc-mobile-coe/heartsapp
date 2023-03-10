package com.hfn.unified.reactnative.modules.assemblers;

import com.google.protobuf.Timestamp;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.DiaryEntry;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.GetDiaryEntriesRequest;
import org.json.JSONException;
import org.json.JSONObject;

public class GetDiaryEntriesRequestAssembler {
    public GetDiaryEntriesRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        return GetDiaryEntriesRequest.newBuilder()
                .setUserId(jsonObj.optString("userId", ""))
                .setFromTime(Timestamp.newBuilder().setSeconds(jsonObj.optLong("fromTime", 0)).build())
                .setPageSize(jsonObj.optInt("pageSize", 10))
                .setPageToken(jsonObj.optInt("pageToken", 10))
                .build();

    }
}
