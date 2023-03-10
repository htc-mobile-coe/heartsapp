package com.hfn.unified.reactnative.modules;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.hfn.unified.reactnative.modules.assemblers.DonateRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.FetchDonationItemsRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.FetchDonationsRequestAssembler;
import com.hfn.unified.remote.GRPCClientFactory;

import org.heartfulness.unifiedplatform.interfaces.grpc.donation.DonateRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.DonateResponse;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationItemsRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationItemsResponse;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationsRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationsResponse;
import org.json.JSONException;

import static com.hfn.unified.reactnative.modules.Constants.FIREBASE_ID_TOKEN;
import static com.hfn.unified.reactnative.modules.Constants.MESSAGE;

public class DonationServiceReactModule extends ReactContextBaseJavaModule {

    public DonationServiceReactModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void fetchDonationItems(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            FetchDonationItemsRequest request = new FetchDonationItemsRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            FetchDonationItemsResponse donateResponse = GRPCClientFactory.get().donationService().fetchDonationItems(firebaseIdToken, request);
            String response = new FetchDonationItemsRequestAssembler().toJson(donateResponse);
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
    public void fetchDonations(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            FetchDonationsRequest request = new FetchDonationsRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            FetchDonationsResponse donateResponse = GRPCClientFactory.get().donationService().fetchDonations(firebaseIdToken, request);
            String response = new FetchDonationsRequestAssembler().toJson(donateResponse);
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
    public void donate(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            DonateRequest request = new DonateRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            DonateResponse donateResponse = GRPCClientFactory.get().donationService().donate(firebaseIdToken, request);
            String response = new DonateRequestAssembler().toJson(donateResponse);
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

    @NonNull
    @Override
    public String getName() {
        return "DonationService";
    }
}
