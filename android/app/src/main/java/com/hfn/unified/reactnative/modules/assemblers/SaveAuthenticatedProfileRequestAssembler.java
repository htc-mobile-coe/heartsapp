package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Gender;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.IntroSittingChannel;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.NullableBool;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Profile;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SaveAuthenticatedProfileRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Stage;
import org.json.JSONException;
import org.json.JSONObject;

public class SaveAuthenticatedProfileRequestAssembler {
    public SaveAuthenticatedProfileRequest fromJson(String json) throws JSONException {
        JSONObject mainObject = new JSONObject(json);
        SaveAuthenticatedProfileRequest.Builder builder = SaveAuthenticatedProfileRequest.newBuilder()
                .setUId(mainObject.optString("uId", ""))
                .setIdToken(mainObject.optString("idToken", ""));
        profile(mainObject, builder);
        return builder.build();
    }

    private static final String PROFILE = "profile";

    private void profile(JSONObject requestJson, SaveAuthenticatedProfileRequest.Builder identityBuilder) throws JSONException {
        if (requestJson.opt(PROFILE) != null) {
            JSONObject json = requestJson.getJSONObject(PROFILE);
            Profile.Builder builder = Profile.newBuilder()
                    .setProfileId(json.optString("profileId", ""))
                    .setEmail(json.optString("email", ""))
                    .setFirstName(json.optString("firstName", ""))
                    .setLastName(json.optString("lastName", ""))
                    .setProfession(json.optString("profession", ""))
                    .setUId(json.optString("uId", ""))
                    .setIsTrainer(json.optBoolean("isTrainer", false))
                    .setPhone(json.optString("phone", ""))
                    .setAddressLine1(json.optString("addressLine1", ""))
                    .setAddressLine2(json.optString("addressLine2", ""))
                    .setAddressLine3(json.optString("addressLine3", ""))
                    .setCity(json.optString("city", ""))
                    .setStateCode(json.optString("stateCode", ""))
                    .setPostalCode(json.optString("postalCode", ""))
                    .setCountryCode(json.optString("countryCode", ""))
                    .setPhotoURL(json.optString("photoURL", ""))
                    .setLatitude(json.optDouble("latitude", 0.0))
                    .setLongitude(json.optDouble("longitude", 0.0))
                    .setZone(json.optString("zone", ""))
                    .setEmergencyContact(json.optString("emergencyContact", ""))
                    .setPrintName(json.optString("printName", ""))
                    .setAimsId(json.optString("aimsId", ""))
                    .setNodalCenter(json.optLong("nodalCenter", 0))
                    .setFirstSittingDate(json.optString("firstSittingDate", ""))
                    .setSecondSittingDate(json.optString("secondSittingDate", ""))
                    .setThirdSittingDate(json.optString("thirdSittingDate", ""))
                    .setIntroducedBy(json.optString("introducedBy", ""))
                    .setCitizenship(json.optString("citizenship", ""))
                    .setPrefect(json.optString("prefect", ""))
                    .setDob(json.optString("dob", ""))
                    .setDoj(json.optString("doj", ""))
                    .setVolunteer(json.optString("volunteer", ""))
                    .setSkills(json.optString("skills", ""))
                    .setAbhyasiId(json.optString("abhyasiId", ""))
                    .setCurrentPreceptor(json.optString("currentPreceptor", ""))
                    .setLandline(json.optString("landline", ""))
                    .setAnonymous(json.optBoolean("anonymous", true))
                    .setCountryName(json.optString("countryName", ""))
                    .setStateName(json.optString("stateName", ""))
                    .setCityPlaceId(json.optString("cityPlaceId", ""))
                    .setIntroSittingSelfAttestDone(json.optBoolean("introSittingSelfAttestDone", false))
                    .setIntroSittingSelfAttestNotes(json.optString("introSittingSelfAttestNotes", ""))
                    .setIsLocationVisibleToPublic(NullableBool.newBuilder().setData(json.optBoolean("isLocationVisibleToPublic", false)))
                    .setIsNameVisibleToPublic(NullableBool.newBuilder().setData(json.optBoolean("isNameVisibleToPublic", false)))
                    .setIsPhotoVisibleToPublic(NullableBool.newBuilder().setData(json.optBoolean("isPhotoVisibleToPublic", false)));


            gender(json, builder);
            stage(json, builder);
            introSittingChannel(json, builder);

            identityBuilder.setProfile(builder.build());
        }
    }

    private void gender(JSONObject json, Profile.Builder builder) throws JSONException {
        builder.setGender(json.has("gender") ? Gender.forNumber(json.optInt("gender")): Gender.UNKNOWN);
    }

    private void stage(JSONObject json, Profile.Builder builder) throws JSONException {
        builder.setStage(Stage.valueOf(json.optString("stage", Stage.NEWBIE.name())));
    }

    private void introSittingChannel(JSONObject json, Profile.Builder builder) throws JSONException {
        builder.setIntroSittingChannel(IntroSittingChannel.valueOf(json.optString("introSittingChannel", IntroSittingChannel.NONE.name())));
    }
}
