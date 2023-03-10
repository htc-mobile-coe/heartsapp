package com.hfn.unified.reactnative.modules.assemblers;

import com.google.protobuf.Timestamp;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.DiaryEntry;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.Rating;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SupportRequest;
import org.json.JSONException;
import org.json.JSONObject;

public class DiaryEntryAssembler {
    public DiaryEntry fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        return DiaryEntry.newBuilder()
                .setUserId(jsonObj.optString("userId", ""))
                .setText(jsonObj.optString("text", ""))
                .setId(jsonObj.optString("id", ""))
                .setEntryTime(Timestamp.newBuilder()
                        .setSeconds(jsonObj.getJSONObject("entryTime").optLong("seconds", 0)).build())
                .setMoodRating(Rating.forNumber(jsonObj.optInt("moodRating")))
                .setMeditationSessionId(jsonObj.optString("meditationSessionId", ""))
                .build();

    }
}
