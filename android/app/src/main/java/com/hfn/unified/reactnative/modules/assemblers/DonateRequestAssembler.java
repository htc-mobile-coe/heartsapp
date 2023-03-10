package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.donation.DonateRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.DonateResponse;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.DonationItem;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.DonationLineItem;
import org.heartfulness.unifiedplatform.interfaces.grpc.donation.UserProfile;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class DonateRequestAssembler {

    public DonateRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        JSONObject requestObj = jsonObj.optJSONObject("request");
        JSONObject userProfileObj = requestObj.optJSONObject("userProfile");


        UserProfile userProfile = UserProfile.newBuilder()
                .setUserId(userProfileObj.optString("userId", ""))
                .setCitizenshipCountry(userProfileObj.optString("citizenshipCountry", ""))
                .setFirstName(userProfileObj.optString("firstName", ""))
                .setLastName(userProfileObj.optString("lastName", ""))
                .setAddressLine1(userProfileObj.optString("addressLine1", ""))
                .setAddressLine2(userProfileObj.optString("addressLine2", ""))
                .setPostalCode(userProfileObj.optString("postalCode", ""))
                .setCity(userProfileObj.optString("city", ""))
                .setState(userProfileObj.optString("state", ""))
                .setCountry(userProfileObj.optString("country", ""))
                .setEmailAddress(userProfileObj.optString("emailAddress", ""))
                .setPhoneNumber(userProfileObj.optString("phoneNumber", ""))
                .setTaxId(userProfileObj.optString("taxId", ""))
                .setMemberId(userProfileObj.optString("memberId", ""))
                .build();

        JSONArray lineItemsArray = requestObj.optJSONArray("lineItems");
        JSONObject firstItem = lineItemsArray.optJSONObject(0);
        JSONObject donationItemObj = firstItem.optJSONObject("donationItem");

        DonationLineItem donationLineItem = DonationLineItem.newBuilder()
                .setDonationId(firstItem.optString("id"))
                .setDonationItem(
                        DonationItem.newBuilder()
                        .setId(donationItemObj.optString("id", ""))
                        .setName(donationItemObj.optString("name", ""))
                        .setDescription(donationItemObj.optString("description", ""))
                        .setRegion(donationItemObj.optString("region", ""))
                        .setCurrency(donationItemObj.optString("currency", ""))
                        .setBillingAccountName(donationItemObj.optString("billingAccountName", ""))
                        .setIsActive(donationItemObj.optBoolean("isActive", false))
                        .build()
                )
                .setCurrency(firstItem.optString("currency", ""))
                .setAmount(firstItem.optDouble("amount", 0))
                .setIsRecurring(firstItem.optBoolean("isRecurring", false))
                .setRecurringStartDate(firstItem.optString("recurringStartDate", ""))
                .setRecurringFrequency(firstItem.optString("recurringFrequency", ""))
                .build();


        DonateRequest.Builder builder = DonateRequest.newBuilder()
                .addDonationLineItems(donationLineItem)
                .setIdToken(jsonObj.optString("idToken", ""))
                .setUserId(jsonObj.optString("uId", ""))
                .setUserProfile(userProfile);

        return builder.build();
    }

    public String toJson(DonateResponse response) {
        return ProtobufToJsonConverter.toJSON(response);
    }

    public String toJson(DonateRequest response) {
        return ProtobufToJsonConverter.toJSON(response);
    }
}
