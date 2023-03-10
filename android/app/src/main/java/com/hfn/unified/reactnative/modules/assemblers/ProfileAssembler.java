package com.hfn.unified.reactnative.modules.assemblers;


import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Gender;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Preferences;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Profile;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Stage;
import org.json.JSONException;
import org.json.JSONObject;

public class ProfileAssembler {

    public Profile fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        Profile.Builder builder = Profile.newBuilder()
                .setUId(jsonObj.optString("uId", ""))
                .setProfileId(jsonObj.optString("profileId", ""))
                .setEmail(jsonObj.optString("email", ""))
                .setFirstName(jsonObj.optString("firstName", ""))
                .setLastName(jsonObj.optString("lastName", ""))
                .setProfession(jsonObj.optString("profession", ""))
                .setPhone(jsonObj.optString("phone", ""))
                .setAddressLine1(jsonObj.optString("addressLine1", ""))
                .setAddressLine2(jsonObj.optString("addressLine2", ""))
                .setAddressLine3(jsonObj.optString("addressLine3", ""))
                .setCity(jsonObj.optString("city", ""))
                .setStateCode(jsonObj.optString("stateCode", ""))
                .setPostalCode(jsonObj.optString("postalCode", ""))
                .setCountryCode(jsonObj.optString("countryCode", ""))
                .setPhotoURL(jsonObj.optString("photoURL", ""))
                .setZone(jsonObj.optString("zone", ""))
                .setEmergencyContact(jsonObj.optString("emergencyContact", ""))
                .setPrintName(jsonObj.optString("printName", ""))
                .setAimsId(jsonObj.optString("aimsId", ""))
                .setFirstSittingDate(jsonObj.optString("firstSittingDate", ""))
                .setSecondSittingDate(jsonObj.optString("secondSittingDate", ""))
                .setThirdSittingDate(jsonObj.optString("thirdSittingDate", ""))
                .setIntroducedBy(jsonObj.optString("introducedBy", ""))
                .setCitizenship(jsonObj.optString("citizenship", ""))
                .setPrefect(jsonObj.optString("prefect", ""))
                .setDob(jsonObj.optString("dob", ""))
                .setDoj(jsonObj.optString("doj", ""))
                .setVolunteer(jsonObj.optString("volunteer", ""))
                .setSkills(jsonObj.optString("skills", ""))
                .setAbhyasiId(jsonObj.optString("abhyasiId", ""))
                .setCurrentPreceptor(jsonObj.optString("currentPreceptor", ""))
                .setLandline(jsonObj.optString("landline", ""))
                .setCountryName(jsonObj.optString("countryName", ""))
                .setStateName(jsonObj.optString("stateName", ""))
                .setCityPlaceId(jsonObj.optString("cityPlaceId", ""))
                .setIsTrainer(jsonObj.optBoolean("isTrainer"))
                .setLatitude(jsonObj.optDouble("latitude"))
                .setLongitude(jsonObj.optDouble("longitude"))
                .setNodalCenter(jsonObj.optLong("nodalCenter"))
                .setAnonymous(jsonObj.optBoolean("anonymous"));
        gender(jsonObj, builder);
        stage(jsonObj, builder);
        preferences(jsonObj, builder);
        return builder.build();
    }

    private void gender(JSONObject json, Profile.Builder builder) {
        builder.setGender(Gender.valueOf(json.optString("identityType", Gender.MALE.name())));
    }

    private void stage(JSONObject json, Profile.Builder builder) {
        builder.setStage(Stage.valueOf(json.optString("stage", Stage.NEWBIE.name())));
    }

    private void preferences(JSONObject json, Profile.Builder builder) throws JSONException {
        if (json.opt("preferences") != null) {
            JSONObject dataJson = json.getJSONObject("preferences");
            builder.setPreferences(Preferences.newBuilder()
                    .setEmailSubscribe(dataJson.optBoolean("emailSubscribe"))
                    .setMobileAppAlerts(dataJson.optBoolean("mobileAppAlerts"))
                    .setSmsSubscribe(dataJson.optBoolean("smsSubscribe"))
                    .build());
        }
    }

    public String toJson(Profile profile) {
        return ProtobufToJsonConverter.toJSON(profile);
    }

}
