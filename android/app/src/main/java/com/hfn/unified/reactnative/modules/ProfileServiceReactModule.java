package com.hfn.unified.reactnative.modules;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.google.protobuf.BoolValue;
import com.google.protobuf.StringValue;
import com.hfn.unified.reactnative.modules.assemblers.DeactivateProfileRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.DeviceDetailRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.FederatedIdentityAssembler;
import com.hfn.unified.reactnative.modules.assemblers.GetAuthenticatedProfileRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.LogRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.ProfileAssembler;
import com.hfn.unified.reactnative.modules.assemblers.SaveAuthenticatedProfileRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.ProfilePictureRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.SelfAttestIntroSittingRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.SittingDateRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.SupportRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.UserPreferencesAssembler;
import com.hfn.unified.remote.GRPCClientFactory;

import org.heartfulness.unifiedplatform.interfaces.grpc.federatedIdentity.FederatedIdentity;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.DeactivateProfileRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.DeviceDetailRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.GetAuthenticatedProfileRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.LogRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Profile;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SaveAuthenticatedProfileRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SaveUserPreferencesRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.UpdateProfilePictureRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SelfAttestIntroSittingRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SittingDateRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SupportRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.UserPreferences;
import org.json.JSONException;


import static com.hfn.unified.reactnative.modules.Constants.FIREBASE_ID_TOKEN;
import static com.hfn.unified.reactnative.modules.Constants.MESSAGE;

public class ProfileServiceReactModule extends ReactContextBaseJavaModule {

    public ProfileServiceReactModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void saveFederatedIdentity(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            FederatedIdentity request = new FederatedIdentityAssembler().fromJson(requestMap.getString(MESSAGE));
            Profile profile = GRPCClientFactory.get().profileService().saveFederatedIdentity(firebaseIdToken, request);
            String response = new ProfileAssembler().toJson(profile);
            responsePromise.resolve(response);
        } catch (JSONException e) {
            Log.d("GetSRDetailJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void saveProfile(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            SaveAuthenticatedProfileRequest request = new SaveAuthenticatedProfileRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            Profile profile = GRPCClientFactory.get().profileService().saveProfile(firebaseIdToken, request);
            String response = new ProfileAssembler().toJson(profile);
            responsePromise.resolve(response);
        } catch (JSONException e) {
            Log.d("GetSRDetailJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void updateProfilePicture(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            UpdateProfilePictureRequest request = new ProfilePictureRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            StringValue response = GRPCClientFactory.get().profileService().updateProfilePicture(firebaseIdToken, request);
            responsePromise.resolve(response.getValue());
        } catch (JSONException e) {
            Log.d("GetSRDetailJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void deleteProfilePicture(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            StringValue tokenId = new ProfilePictureRequestAssembler().getUId(requestMap.getString(MESSAGE));
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            BoolValue response = GRPCClientFactory.get().profileService().deleteProfilePicture(firebaseIdToken, tokenId);
            responsePromise.resolve(response.getValue());
        } catch (JSONException e) {
            Log.d("GetSRDetailJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }
    
    @ReactMethod
    public void registerFCMTokenAndDeviceDetails(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            DeviceDetailRequest request = new DeviceDetailRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            BoolValue boolValue = GRPCClientFactory.get().profileService().registerFCMTokenAndDeviceDetails(firebaseIdToken, request);
            responsePromise.resolve(boolValue.getValue());
        } catch (JSONException e) {
            Log.d("RNPSRM", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            Log.d("RNPSRM", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void getProfile(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            GetAuthenticatedProfileRequest request = new GetAuthenticatedProfileRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            Profile profile = GRPCClientFactory.get().profileService().getProfile(firebaseIdToken, request);
            String response = new ProfileAssembler().toJson(profile);
            responsePromise.resolve(response);
        } catch (JSONException e) {
            Log.d("GetSRDetailJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void selfAttestForIntroSitting(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            SelfAttestIntroSittingRequest request = new SelfAttestIntroSittingRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            BoolValue boolValue = GRPCClientFactory.get().profileService().selfAttestForIntroSitting(firebaseIdToken, request);
            responsePromise.resolve(boolValue.getValue());
        } catch (JSONException e) {
            Log.d("SAFISJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void addSupportRequest(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            SupportRequest request = new SupportRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            BoolValue boolValue = GRPCClientFactory.get().profileService().addSupportRequest(firebaseIdToken, request);
            responsePromise.resolve(boolValue.getValue());
        } catch (JSONException e) {
            Log.d("AddSRJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void logOnServer(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            LogRequest request = new LogRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            BoolValue boolValue = GRPCClientFactory.get().profileService().logOnServer(firebaseIdToken, request);
            responsePromise.resolve(boolValue.getValue());
        } catch (JSONException e) {
            Log.d("LogOnServerJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void deRegisterFCMToken(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            DeviceDetailRequest request = new DeviceDetailRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            BoolValue boolValue = GRPCClientFactory.get().profileService().deRegisterFCMToken(firebaseIdToken, request);
            responsePromise.resolve(boolValue.getValue());
        } catch (JSONException e) {
            Log.d("RNPSRM", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            Log.d("RNPSRM", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void deactivateProfile(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            DeactivateProfileRequest request = new DeactivateProfileRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            BoolValue boolValue = GRPCClientFactory.get().profileService().deactivateProfile(firebaseIdToken, request);
            responsePromise.resolve(boolValue.getValue());
        } catch (JSONException e) {
            Log.d("RNPSRM", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            Log.d("RNPSRM", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }
    @ReactMethod
    public void updateMeditationSittingDates(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            SittingDateRequest request = new SittingDateRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            BoolValue boolValue = GRPCClientFactory.get().profileService().updateMeditationSittingDates(firebaseIdToken, request);
            responsePromise.resolve(boolValue.getValue());
        } catch (JSONException e) {
            Log.d("RNPSRM", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            Log.d("RNPSRM", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }
    @ReactMethod
    public void saveUserPreferences(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            SaveUserPreferencesRequest request = new UserPreferencesAssembler().fromJson(requestMap.getString(MESSAGE));
            BoolValue response = GRPCClientFactory.get().profileService().saveUserPreferences(firebaseIdToken, request);
            responsePromise.resolve(response.getValue());
        } catch (JSONException e) {
            Log.d("GetSRDetailJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void getUserPreferences(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            StringValue tokenId = new UserPreferencesAssembler().getUId(requestMap.getString(MESSAGE));
            UserPreferences userPreferences = GRPCClientFactory.get().profileService()
                    .getUserPreferences(requestMap.getString(FIREBASE_ID_TOKEN), tokenId);
            String response = new UserPreferencesAssembler().toJson(userPreferences);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }
    @NonNull
    @Override
    public String getName() {
        return "ProfileService";
    }
}