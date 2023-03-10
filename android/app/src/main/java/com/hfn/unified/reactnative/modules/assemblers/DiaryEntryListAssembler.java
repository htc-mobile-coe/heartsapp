package com.hfn.unified.reactnative.modules.assemblers;

import com.google.protobuf.Timestamp;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.DiaryEntryList;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.GetDiaryEntriesRequest;
import org.json.JSONException;
import org.json.JSONObject;

public class DiaryEntryListAssembler {
    public static String toJson(DiaryEntryList diaryEntryList) throws JSONException {
        return ProtobufToJsonConverter.toJSON(diaryEntryList);

    }
}
