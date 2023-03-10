package com.hfn.unified.remote;

import android.content.Context;
import android.util.Log;

import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.protobuf.BoolValue;
import com.google.protobuf.StringValue;

import org.heartfulness.unifiedplatform.interfaces.grpc.federatedIdentity.FederatedIdentity;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.PreceptorDNDRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.DeactivateProfileRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.DeviceDetailRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.GetAuthenticatedProfileRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.LogRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Profile;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.ProfileServiceGrpc;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SaveAuthenticatedProfileRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SaveUserPreferencesRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.UpdateProfilePictureRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SelfAttestIntroSittingRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SittingDateRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SupportRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.UserPreferences;

import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.android.AndroidChannelBuilder;
import io.grpc.auth.MoreCallCredentials;

public class ProfileServiceClient {
    private static final Logger logger = Logger.getLogger(ProfileServiceClient.class.getName());
    private ManagedChannel channel;
    private ProfileServiceGrpc.ProfileServiceBlockingStub blockingStub;
    final ManagedChannelBuilder channelB;

    ProfileServiceClient(String host, int port, Context context) {
        channelB = AndroidChannelBuilder.forAddress(host, port).context(context);
        channelB.idleTimeout(2, TimeUnit.MINUTES);
        channel = channelB.build();
        blockingStub = ProfileServiceGrpc.newBlockingStub(channel);
    }

    private void ensureChannelOpened() {
        if (channel == null || channel.isShutdown() || channel.isTerminated()) {
            channel = channelB.build();
            blockingStub = ProfileServiceGrpc.newBlockingStub(channel);
        }
    }

    public ProfileServiceGrpc.ProfileServiceBlockingStub getBlockingStub(String firebaseIdToken) {
        ensureChannelOpened();
        return blockingStub.withCallCredentials(MoreCallCredentials.from(GoogleCredentials.create(new AccessToken(firebaseIdToken, null))));
    }


    public Profile saveFederatedIdentity(String firebaseIdToken, FederatedIdentity request) {
        return getBlockingStub(firebaseIdToken).saveFederatedIdentity(request);
    }

    public BoolValue registerFCMTokenAndDeviceDetails(String firebaseIdToken, DeviceDetailRequest request) {
        return getBlockingStub(firebaseIdToken).registerFCMTokenAndDeviceDetails(request);
    }

    public BoolValue deRegisterFCMToken(String firebaseIdToken, DeviceDetailRequest request) {
        return getBlockingStub(firebaseIdToken).deRegisterFCMToken(request);
    }

    public BoolValue deactivateProfile(String firebaseIdToken, DeactivateProfileRequest request) {
        return getBlockingStub(firebaseIdToken).deactivateProfile(request);
    }

    public Profile getProfile(String firebaseIdToken, GetAuthenticatedProfileRequest request) {
        return getBlockingStub(firebaseIdToken).getProfile(request);
    }

    public Profile saveProfile(String firebaseIdToken, SaveAuthenticatedProfileRequest request) {
        return getBlockingStub(firebaseIdToken).saveProfile(request);
    }

    public StringValue updateProfilePicture(String firebaseIdToken, UpdateProfilePictureRequest request) {
        return getBlockingStub(firebaseIdToken).updateProfilePicture(request);
    }

    public BoolValue deleteProfilePicture(String firebaseIdToken, StringValue id) {
        return getBlockingStub(firebaseIdToken).deleteProfilePicture(id);
    }

    public BoolValue selfAttestForIntroSitting(String firebaseIdToken, SelfAttestIntroSittingRequest request) {
        return getBlockingStub(firebaseIdToken).selfAttestForIntroSitting(request);
    }

    public BoolValue addSupportRequest(String firebaseIdToken, SupportRequest request) {
        return getBlockingStub(firebaseIdToken).addSupportRequest(request);
    }

    public BoolValue updateMeditationSittingDates(String firebaseIdToken, SittingDateRequest request) {
        return getBlockingStub(firebaseIdToken).updateMeditationSittingDates(request);
    }

    public UserPreferences getUserPreferences(String firebaseIdToken, StringValue id) {
        return getBlockingStub(firebaseIdToken).getUserPreferences(id);
    }

    public BoolValue saveUserPreferences(String firebaseIdToken, SaveUserPreferencesRequest request) {
        return getBlockingStub(firebaseIdToken).saveUserPreferences(request);
    }
    public BoolValue logOnServer(String firebaseIdToken, LogRequest request) {
        return getBlockingStub(firebaseIdToken).logOnServer(request);
    }
}
