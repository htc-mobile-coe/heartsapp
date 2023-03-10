package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SeekerResponse;

public class SeekerResponseAssembler {
    public String toJson(SeekerResponse response) {
        return ProtobufToJsonConverter.toJSON(response);
    }
}
