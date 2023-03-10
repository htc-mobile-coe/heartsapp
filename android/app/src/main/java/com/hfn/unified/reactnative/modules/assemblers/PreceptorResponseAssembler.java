package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.PreceptorResponse;

public class PreceptorResponseAssembler {
    public String toJson(PreceptorResponse response) {
        return ProtobufToJsonConverter.toJSON(response);
    }
}
