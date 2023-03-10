package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.DiaryEntry;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.GetDiaryEntryBySessionIdRequest;
import org.json.JSONException;
import org.json.JSONObject;

public class GetDiaryEntryBySessionIdRequestAssembler {
    public GetDiaryEntryBySessionIdRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        return GetDiaryEntryBySessionIdRequest.newBuilder()
                .setUserId(jsonObj.optString("userId", ""))
                .setMeditationSessionId(jsonObj.optString("meditationSessionId", ""))
                .build();

    }

    public static String toJson(DiaryEntry diaryEntry) throws JSONException {
        return ProtobufToJsonConverter.toJSON(diaryEntry);

    }
}
