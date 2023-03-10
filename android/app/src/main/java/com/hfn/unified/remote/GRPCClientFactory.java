package com.hfn.unified.remote;

import android.content.Context;
import android.util.Log;

import com.hfn.unified.BuildConfig;

public class GRPCClientFactory {
    private GRPCClientFactory() {
    }

    private static GRPCClientFactory instance = new GRPCClientFactory();

    public static GRPCClientFactory get() {
        return instance;
    }


    private Context context;

    public void init(Context context) {
        this.context = context;
    }


    ProfileServiceClient profileServiceClient;
    MeditationServiceClient meditationServiceClient;
    SubscriptionServiceClient subscriptionServiceClient;
    DonationServiceClient donationServiceClient;

    public ProfileServiceClient profileService() {
        if (profileServiceClient == null) {
            profileServiceClient = new ProfileServiceClient(BuildConfig.PROFILESERVICE_HOST, BuildConfig.PROFILESERVICE_PORT, context);
        }

        Log.d("RNPSRM", BuildConfig.PROFILESERVICE_HOST);
        return profileServiceClient;
    }

    public MeditationServiceClient meditationService() {
        if (meditationServiceClient == null) {
            meditationServiceClient = new MeditationServiceClient(BuildConfig.MEDITATIONSERVICE_HOST, BuildConfig.MEDITATIONSERVICE_PORT, context);
        }

        Log.d("RNPSRM", BuildConfig.PROFILESERVICE_HOST);
        return meditationServiceClient;
    }


    public SubscriptionServiceClient subscriptionService() {
        if (subscriptionServiceClient == null) {
            subscriptionServiceClient = new SubscriptionServiceClient(BuildConfig.SUBSCRIPTIONSERVICE_HOST, BuildConfig.SUBSCRIPTIONSERVICE_PORT, context);
        }

        Log.d("RNPSRM", BuildConfig.SUBSCRIPTIONSERVICE_HOST);
        return subscriptionServiceClient;
    }

    public DonationServiceClient donationService() {
        if (donationServiceClient == null) {
            donationServiceClient = new DonationServiceClient(BuildConfig.DONATION_HOST, BuildConfig.DONATION_PORT, context);
        }

        Log.d("RNPSRM", BuildConfig.DONATION_HOST);
        return donationServiceClient;
    }

}
