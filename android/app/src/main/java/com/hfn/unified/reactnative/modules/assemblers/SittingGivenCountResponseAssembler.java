package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SittingGivenCountResponse;

public class SittingGivenCountResponseAssembler {
    public String toJson(SittingGivenCountResponse response) {
        return ProtobufToJsonConverter.toJSON(response);
    }
}