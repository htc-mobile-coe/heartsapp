package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationItemsRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.FetchDonationItemsResponse;
import org.json.JSONException;
import org.json.JSONObject;

public class FetchDonationItemsRequestAssembler {

    public FetchDonationItemsRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);

        FetchDonationItemsRequest.Builder builder = FetchDonationItemsRequest.newBuilder()
                .setIdToken(jsonObj.optString("idToken", ""))
                .setUserId(jsonObj.optString("uId", ""))
                .setCitizenshipCountry(jsonObj.optString("citizenshipCountry", ""))
                .setSortBy("");

        return builder.build();
    }

    public String toJson(FetchDonationItemsResponse response) {
        return ProtobufToJsonConverter.toJSON(response);
    }
}
