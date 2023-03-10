package com.hfn.unified.reactnative.modules.assemblers;

import org.heartfulness.unifiedplatform.interfaces.grpc.profile.DeviceDetailRequest;
import org.json.JSONException;
import org.json.JSONObject;

public class DeviceDetailRequestAssembler {
    public DeviceDetailRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        return DeviceDetailRequest.newBuilder()
                .setUId(jsonObj.optString("uId", ""))
                .setIdToken(jsonObj.optString("idToken", ""))
                .setDeviceId(jsonObj.optString("deviceId", ""))
                .setFcmToken(jsonObj.optString("fcmToken", ""))
                .setAppVersion(jsonObj.optString("appVersion", ""))
                .setDeviceMake(jsonObj.optString("deviceMake", ""))
                .setDeviceModel(jsonObj.optString("deviceModel", ""))
                .setDeviceName(jsonObj.optString("deviceName", ""))
                .setPlatform(jsonObj.optString("platform", ""))
                .setOsVersion(jsonObj.optString("osVersion", ""))
                .setBuildCodeVersion(jsonObj.optString("buildCodeVersion", ""))
                .build();
    }
}
