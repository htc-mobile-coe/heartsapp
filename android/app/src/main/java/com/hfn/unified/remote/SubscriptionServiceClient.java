package com.hfn.unified.remote;

import android.content.Context;

import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.protobuf.BoolValue;

import org.heartfulness.unifiedplatform.interfaces.grpc.federatedIdentity.FederatedIdentity;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.DeviceDetailRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.GetAuthenticatedProfileRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Profile;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.ProfileServiceGrpc;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SaveAuthenticatedProfileRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.SelfAttestIntroSittingRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.subscription.SubmitFeedbackRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.subscription.SubmitFeedbackResponse;
import org.heartfulness.unifiedplatform.interfaces.grpc.subscription.SubscriptionServiceGrpc;

import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.android.AndroidChannelBuilder;
import io.grpc.auth.MoreCallCredentials;

public class SubscriptionServiceClient {
    private static final Logger logger = Logger.getLogger(SubscriptionServiceClient.class.getName());
    private ManagedChannel channel;
    private SubscriptionServiceGrpc.SubscriptionServiceBlockingStub blockingStub;
    final ManagedChannelBuilder channelB;

    SubscriptionServiceClient(String host, int port, Context context) {
        channelB = AndroidChannelBuilder.forAddress(host, port).context(context);
        channelB.idleTimeout(2, TimeUnit.MINUTES);
        channel = channelB.build();
        blockingStub = SubscriptionServiceGrpc.newBlockingStub(channel);
    }

    private void ensureChannelOpened() {
        if (channel == null || channel.isShutdown() || channel.isTerminated()) {
            channel = channelB.build();
            blockingStub = SubscriptionServiceGrpc.newBlockingStub(channel);
        }
    }

    public SubscriptionServiceGrpc.SubscriptionServiceBlockingStub getBlockingStub(String firebaseIdToken) {
        ensureChannelOpened();
        return blockingStub.withCallCredentials(MoreCallCredentials.from(GoogleCredentials.create(new AccessToken(firebaseIdToken, null))));
    }


    public SubmitFeedbackResponse submitFeedbackToHelpDesk(String firebaseIdToken, SubmitFeedbackRequest request) {
        return getBlockingStub(firebaseIdToken).submitFeedback(request);
    }
}
