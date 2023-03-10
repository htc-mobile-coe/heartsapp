package com.hfn.unified.reactnative.modules.assemblers;

import com.google.protobuf.StringValue;
import com.google.protobuf.Timestamp;

import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SaveUserPreferencesRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.UserPreferences;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Objects;

public class UserPreferencesAssembler {


    public SaveUserPreferencesRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        JSONObject userPreferencesJSON = jsonObj.getJSONObject("userPreferences");

        return SaveUserPreferencesRequest.newBuilder()
                .setUId(jsonObj.optString("uId"))
                .setIsSubscribedToWeeklyInspiration(userPreferencesJSON.getBoolean("isSubscribedToWeeklyInspiration"))
                .setLanguage(userPreferencesJSON.optString("language",""))
                .setShouldPlayRelaxationAudioBeforeMeditation(userPreferencesJSON.getBoolean("shouldPlayRelaxationAudioBeforeMeditation"))
                .setTimeOfConsent(Timestamp.newBuilder().setSeconds(userPreferencesJSON.optLong("timeOfConsent")).build())
                .setIsMorningMeditationReminderEnabled(userPreferencesJSON.getBoolean("isMorningMeditationReminderEnabled"))
                .setMorningMeditationTime(Timestamp.newBuilder().setSeconds(userPreferencesJSON.optLong("morningMeditationTime")).build())
                .setIsEveningMeditationReminderEnabled(userPreferencesJSON.getBoolean("isEveningMeditationReminderEnabled"))
                .setEveningCleaningTime(Timestamp.newBuilder().setSeconds(userPreferencesJSON.optLong("eveningCleaningTime")).build())
                .setIsReminderForNextSittingEnabled(userPreferencesJSON.getBoolean("isReminderForNextSittingEnabled"))
                .setNextSittingReminderIntervalInDays(userPreferencesJSON.getInt("nextSittingReminderIntervalInDays"))
                .build();
    }

    public String toJson(UserPreferences userPreferences) {
        return ProtobufToJsonConverter.toJSON(userPreferences);
    }

    public StringValue getUId(String messageString) throws JSONException {
        JSONObject jsonObject = new JSONObject(messageString);
        String uid = Objects.requireNonNull(jsonObject.get("uId")).toString();
        return StringValue.newBuilder().setValue(uid).build();
    }

}
