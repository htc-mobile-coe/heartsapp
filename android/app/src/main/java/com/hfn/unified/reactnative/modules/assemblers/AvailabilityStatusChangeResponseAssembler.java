package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.AvailabilityStatusChangeResponse;

public class AvailabilityStatusChangeResponseAssembler {
    public String toJson(AvailabilityStatusChangeResponse response) {
        return ProtobufToJsonConverter.toJSON(response);
    }
}
