package com.hfn.unified.remote;

import android.content.Context;
import android.util.Log;

import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.protobuf.BoolValue;

import org.heartfulness.unifiedplatform.interfaces.grpc.federatedIdentity.FederatedIdentity;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.MeditationServiceGrpc;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.DeviceDetailRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Profile;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.ProfileServiceGrpc;

import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.android.AndroidChannelBuilder;
import io.grpc.auth.MoreCallCredentials;

public class MeditationServiceClient {
    private static final Logger logger = Logger.getLogger(MeditationServiceClient.class.getName());

    private ManagedChannel channel;
    private ManagedChannel channelAsync;
    volatile private MeditationServiceGrpc.MeditationServiceBlockingStub blockingStub;
    volatile private MeditationServiceGrpc.MeditationServiceStub asyncStub;

    private final ManagedChannelBuilder channelB;
    private final ManagedChannelBuilder channelAsyncB;

    MeditationServiceClient(String host, int port, Context context) {
        channelB = AndroidChannelBuilder.forAddress(host, port).context(context).directExecutor();
        //  channelB.keepAliveTime(1, TimeUnit.MINUTES);
        channel = channelB.build();
        channelB.idleTimeout(2, TimeUnit.MINUTES);
        blockingStub = MeditationServiceGrpc.newBlockingStub(channel);

        channelAsyncB = AndroidChannelBuilder.forAddress(host, port).context(context).directExecutor();
        channelAsyncB.keepAliveTime(1, TimeUnit.MINUTES);
        channelAsyncB.idleTimeout(2, TimeUnit.MINUTES);
        channelAsync = channelAsyncB.build();
        asyncStub = MeditationServiceGrpc.newStub(channelAsync);
    }

    private void ensureChannelOpened() {
        if(channel == null || channel.isShutdown() || channel.isTerminated()){
            channel = channelB.build();
            blockingStub = MeditationServiceGrpc.newBlockingStub(channel);
        }

        if(channelAsync == null || channelAsync.isShutdown() || channelAsync.isTerminated()){
            channelAsync = channelAsyncB.build();
            asyncStub = MeditationServiceGrpc.newStub(channelAsync);
        }
    }

    public MeditationServiceGrpc.MeditationServiceBlockingStub getBlockingStub(String firebaseIdToken) {
        ensureChannelOpened();
        //TODO:  Move wait time to firebase config
        return blockingStub.withDeadlineAfter(120, TimeUnit.SECONDS).withCallCredentials( MoreCallCredentials.from(GoogleCredentials.create(new AccessToken(firebaseIdToken, null))));
    }

    public MeditationServiceGrpc.MeditationServiceStub getAsyncStub(String firebaseIdToken) {
        ensureChannelOpened();
        return asyncStub.withCallCredentials( MoreCallCredentials.from(GoogleCredentials.create(new AccessToken(firebaseIdToken, null))));
    }
}
