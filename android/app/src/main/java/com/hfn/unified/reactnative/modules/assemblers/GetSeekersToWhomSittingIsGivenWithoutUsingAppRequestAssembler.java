package com.hfn.unified.reactnative.modules.assemblers;

import com.google.protobuf.Timestamp;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.GetSeekersToWhomSittingIsGivenWithoutUsingAppRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SeekerInfoResponse;
import org.json.JSONException;
import org.json.JSONObject;

public class GetSeekersToWhomSittingIsGivenWithoutUsingAppRequestAssembler {
    public GetSeekersToWhomSittingIsGivenWithoutUsingAppRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        return GetSeekersToWhomSittingIsGivenWithoutUsingAppRequest.newBuilder()
                .setPageToken(jsonObj.optInt("pageToken", 0))
                .setPageSize(jsonObj.optInt("pageSize", 0))
                .build();

    }

    public String toJson(SeekerInfoResponse response) {
        return ProtobufToJsonConverter.toJSON(response);
    }
}
