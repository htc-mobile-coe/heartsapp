package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.MeditationSession;

public class MeditationSessionAssembler {
    public String toJson(MeditationSession response) {
        return ProtobufToJsonConverter.toJSON(response);
    }
}
