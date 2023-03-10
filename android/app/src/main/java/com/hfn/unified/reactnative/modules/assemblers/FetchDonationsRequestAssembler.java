package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationItemsRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationItemsResponse;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationsRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationsResponse;
import org.json.JSONException;
import org.json.JSONObject;

public class FetchDonationsRequestAssembler {

    public FetchDonationsRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);

        FetchDonationsRequest.Builder builder = FetchDonationsRequest.newBuilder()
                .setIdToken(jsonObj.optString("idToken", ""))
                .setUserId(jsonObj.optString("uId", ""))
                .setSortBy("");

        return builder.build();
    }

    public String toJson(FetchDonationsResponse response) {
        return ProtobufToJsonConverter.toJSON(response);
    }
}
