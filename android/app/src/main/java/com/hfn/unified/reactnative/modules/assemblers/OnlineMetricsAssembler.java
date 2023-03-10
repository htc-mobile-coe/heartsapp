package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.OnlineMetrics;

public class OnlineMetricsAssembler {
    public String toJson(OnlineMetrics response) {
        return ProtobufToJsonConverter.toJSON(response);
    }
}