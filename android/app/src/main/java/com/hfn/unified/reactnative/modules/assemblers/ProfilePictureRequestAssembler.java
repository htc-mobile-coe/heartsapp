package com.hfn.unified.reactnative.modules.assemblers;

import android.util.Base64;

import org.heartfulness.unifiedplatform.interfaces.grpc.profile.UpdateProfilePictureRequest;

import com.google.protobuf.ByteString;
import com.google.protobuf.StringValue;
import org.json.JSONObject;
import org.json.JSONException;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import static com.hfn.unified.reactnative.modules.Constants.FIREBASE_ID_TOKEN;
import static com.hfn.unified.reactnative.modules.Constants.MESSAGE;
import com.hfn.unified.remote.GRPCClientFactory;

import java.io.UnsupportedEncodingException;

public class ProfilePictureRequestAssembler {
    public UpdateProfilePictureRequest fromJson(String json) throws JSONException, UnsupportedEncodingException {
        JSONObject mainObject = new JSONObject(json);

        byte[] pictureByte = Base64.decode(mainObject.optString("pictureData"), Base64.DEFAULT);
        UpdateProfilePictureRequest.Builder builder = UpdateProfilePictureRequest.newBuilder()
                .setUId(mainObject.optString("uId"))
                .setPictureData(ByteString.copyFrom(pictureByte))
                .setPictureName(mainObject.optString("pictureName"));
        
        return builder.build();
    }

    public StringValue getUId(String messageString) throws JSONException {
        JSONObject messageJson= new JSONObject(messageString);
        String uid = messageJson.getString("uId");
        return StringValue.newBuilder().setValue(uid).build();
    }

}
