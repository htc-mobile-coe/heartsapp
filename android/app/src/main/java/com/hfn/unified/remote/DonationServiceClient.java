package com.hfn.unified.remote;

import android.content.Context;

import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;

import org.heartfulness.unifiedplatform.interfaces.grpc.donation.DonateRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.DonateResponse;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.DonationServiceGrpc;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationItemsRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationItemsResponse;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationsRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationsResponse;
import org.heartfulness.unifiedplatform.interfaces.grpc.federatedIdentity.FederatedIdentity;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.Profile;
import org.heartfulness.unifiedplatform.interfaces.grpc.profile.ProfileServiceGrpc;

import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.android.AndroidChannelBuilder;
import io.grpc.auth.MoreCallCredentials;

public class DonationServiceClient {
    private static final Logger logger = Logger.getLogger(ProfileServiceClient.class.getName());
    private ManagedChannel channel;
    private DonationServiceGrpc.DonationServiceBlockingStub blockingStub;
    final ManagedChannelBuilder channelB;

    DonationServiceClient(String host, int port, Context context) {
        channelB = AndroidChannelBuilder.forAddress(host, port).context(context);
        channelB.idleTimeout(2, TimeUnit.MINUTES);
        channel = channelB.build();
        blockingStub = DonationServiceGrpc.newBlockingStub(channel);
    }

    private void ensureChannelOpened() {
        if (channel == null || channel.isShutdown() || channel.isTerminated()) {
            channel = channelB.build();
            blockingStub = DonationServiceGrpc.newBlockingStub(channel);
        }
    }

    public DonationServiceGrpc.DonationServiceBlockingStub getBlockingStub(String firebaseIdToken) {
        ensureChannelOpened();
        return blockingStub.withCallCredentials(MoreCallCredentials.from(GoogleCredentials.create(new AccessToken(firebaseIdToken, null))));
    }

    public DonateResponse donate(String firebaseIdToken, DonateRequest request) {
        return getBlockingStub(firebaseIdToken).donate(request);
    }

    public FetchDonationItemsResponse fetchDonationItems(String firebaseIdToken, FetchDonationItemsRequest request) {
        return getBlockingStub(firebaseIdToken).fetchDonationItems(request);
    }

    public FetchDonationsResponse fetchDonations(String firebaseIdToken, FetchDonationsRequest request) {
        return getBlockingStub(firebaseIdToken).fetchDonations(request);
    }
}
