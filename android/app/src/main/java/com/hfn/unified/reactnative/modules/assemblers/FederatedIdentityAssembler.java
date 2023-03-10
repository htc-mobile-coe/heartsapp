package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.federatedIdentity.AuthCredentials;
import org.heartfulness.unifiedplatform.interfaces.grpc.federatedIdentity.AuthenticatedOnlineProfile;
import org.heartfulness.unifiedplatform.interfaces.grpc.federatedIdentity.FacebookProviderData;
import org.heartfulness.unifiedplatform.interfaces.grpc.federatedIdentity.FederatedIdentity;
import org.heartfulness.unifiedplatform.interfaces.grpc.federatedIdentity.FirebaseEmailProviderData;
import org.heartfulness.unifiedplatform.interfaces.grpc.federatedIdentity.GoogleProviderData;
import org.heartfulness.unifiedplatform.interfaces.grpc.federatedIdentity.IdentityType;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class FederatedIdentityAssembler {

    public FederatedIdentity fromJson(String json) throws JSONException {
        JSONObject mainObject = new JSONObject(json);
        FederatedIdentity.Builder builder = FederatedIdentity.newBuilder();
        authenticatedOnlineProfile(mainObject, builder);
        return builder.build();
    }

    private static final String PROFILE = "profile";

    private void authenticatedOnlineProfile(JSONObject federatedIdentityJson, FederatedIdentity.Builder identityBuilder) throws JSONException {
        if (federatedIdentityJson.opt(PROFILE) != null) {
            JSONObject json = federatedIdentityJson.getJSONObject(PROFILE);
            AuthenticatedOnlineProfile.Builder builder = AuthenticatedOnlineProfile.newBuilder()
                    .setUId(json.optString("uId", ""))
                    .setAnonymous(json.optBoolean("anonymous", false))
                    .setScreenName(json.optString("screenName", ""));
            identityType(json, builder);
            googleProviderData(json, builder);
            facebookProviderData(json, builder);
            firebaseEmailProviderData(json, builder);
            authCredentials(json, builder);
            identityBuilder.setProfile(builder.build());
        }
    }

    private void identityType(JSONObject json, AuthenticatedOnlineProfile.Builder builder) throws JSONException {
        builder.setIdentityType(IdentityType.valueOf(json.optString("identityType", IdentityType.UNRECOGNIZED.name())));
    }

    private static final String GOOGLE_PROVIDER_DATA = "googleProviderData";

    private void googleProviderData(JSONObject json, AuthenticatedOnlineProfile.Builder builder) throws JSONException {
        if (json.opt(GOOGLE_PROVIDER_DATA) != null) {
            JSONObject providerDataJson = json.getJSONObject(GOOGLE_PROVIDER_DATA);

            GoogleProviderData.Builder providerDataBuilder = GoogleProviderData.newBuilder()
                    .setUid(providerDataJson.optString("uid", ""))
                    .setDisplayName(providerDataJson.optString("displayName", ""))
                    .setPhotoURL(providerDataJson.optString("photoURL", ""))
                    .setProviderId(providerDataJson.optString("providerId", ""));

            if (providerDataJson.optJSONArray("email") != null) {
                JSONArray arr = providerDataJson.getJSONArray("email");

                for (int i = 0; i < arr.length(); i++) {
                    providerDataBuilder.addEmail(arr.getString(i));
                }
            }

            if (providerDataJson.optJSONArray("phoneNumber") != null) {
                JSONArray arr = providerDataJson.getJSONArray("phoneNumber");

                for (int i = 0; i < arr.length(); i++) {
                    providerDataBuilder.addPhoneNumber(arr.getString(i));
                }
            }

            builder.setGoogleProviderData(providerDataBuilder.build());
        }
    }

    private static final String FACEBOOK_PROVIDER_DATA = "facebookProviderData";

    private void facebookProviderData(JSONObject json, AuthenticatedOnlineProfile.Builder builder) throws JSONException {
        if (json.opt(FACEBOOK_PROVIDER_DATA) != null) {
            JSONObject providerDataJson = json.getJSONObject(FACEBOOK_PROVIDER_DATA);

            FacebookProviderData.Builder providerDataBuilder = FacebookProviderData.newBuilder()
                    .setUid(providerDataJson.optString("uid", ""))
                    .setDisplayName(providerDataJson.optString("displayName", ""))
                    .setPhotoURL(providerDataJson.optString("photoURL", ""))
                    .setProviderId(providerDataJson.optString("providerId", ""));

            if (providerDataJson.optJSONArray("email") != null) {
                JSONArray arr = providerDataJson.getJSONArray("email");

                for (int i = 0; i < arr.length(); i++) {
                    providerDataBuilder.addEmail(arr.getString(i));
                }
            }

            if (providerDataJson.optJSONArray("phoneNumber") != null) {
                JSONArray arr = providerDataJson.getJSONArray("phoneNumber");

                for (int i = 0; i < arr.length(); i++) {
                    providerDataBuilder.addPhoneNumber(arr.getString(i));
                }
            }

            builder.setFacebookProviderData(providerDataBuilder.build());
        }
    }

    private static final String FIREBASE_EMAIL_PROVIDER_DATA = "firebaseEmailProviderData";

    private void firebaseEmailProviderData(JSONObject json, AuthenticatedOnlineProfile.Builder builder) throws JSONException {
        if (json.opt(FIREBASE_EMAIL_PROVIDER_DATA) != null) {
            JSONObject providerDataJson = json.getJSONObject(FIREBASE_EMAIL_PROVIDER_DATA);

            FirebaseEmailProviderData.Builder providerDataBuilder = FirebaseEmailProviderData.newBuilder()
                    .setUid(providerDataJson.optString("uid", ""))
                    .setDisplayName(providerDataJson.optString("displayName", ""))
                    .setPhotoURL(providerDataJson.optString("photoURL", ""))
                    .setProviderId(providerDataJson.optString("providerId", ""));

            if (providerDataJson.optJSONArray("email") != null) {
                JSONArray arr = providerDataJson.getJSONArray("email");

                for (int i = 0; i < arr.length(); i++) {
                    providerDataBuilder.addEmail(arr.getString(i));
                }
            }

            if (providerDataJson.optJSONArray("phoneNumber") != null) {
                JSONArray arr = providerDataJson.getJSONArray("phoneNumber");

                for (int i = 0; i < arr.length(); i++) {
                    providerDataBuilder.addPhoneNumber(arr.getString(i));
                }
            }

            builder.setFirebaseEmailProviderData(providerDataBuilder.build());
        }
    }

    private void authCredentials(JSONObject json, AuthenticatedOnlineProfile.Builder builder) throws JSONException {
        if (json.opt("authCredentials") != null) {
            JSONObject dataJson = json.getJSONObject("authCredentials");

            AuthCredentials.Builder authCredentials = AuthCredentials.newBuilder()
                    .setApiKey(dataJson.optString("apiKey", ""))
                    .setIdToken(dataJson.optString("idToken", ""))
                    .setExpirationTime(dataJson.optInt("expirationTime", 0));

            builder.setAuthCredentials(authCredentials.build());
        }
    }
}
