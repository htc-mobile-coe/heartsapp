package com.hfn.unified.reactnative.modules.assemblers;

import com.google.protobuf.BoolValue;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.MeditationSession;

public class SeekerExitSessionAssembler {
    public String toJson(BoolValue response) {
        return ProtobufToJsonConverter.toJSON(response);
    }
}
