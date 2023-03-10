package com.hfn.unified.reactnative.modules.assemblers;

import com.google.protobuf.Timestamp;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SaveSittingsGivenWithoutUsingAppRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SeekerInfo;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class SaveSittingsGivenWithoutUsingAppRequestAssembler {
    public SaveSittingsGivenWithoutUsingAppRequest fromJson(String json) throws JSONException {
        JSONObject jsonObj = new JSONObject(json);
        List<SeekerInfo> seekerInfo = convertToStringList(jsonObj.optJSONArray("seekerInfo"));

        return SaveSittingsGivenWithoutUsingAppRequest.newBuilder()
                .setStartTime(Timestamp.newBuilder()
                .setSeconds(jsonObj.getJSONObject("startTime").optLong("seconds", 0)).build())
                .setEndTime(Timestamp.newBuilder()
                .setSeconds(jsonObj.getJSONObject("endTime").optLong("seconds", 0)).build())
                .setNoOfPeople(jsonObj.optInt("noOfPeople", 0))
                .addAllSeekerInfo(seekerInfo)
                .setComments(jsonObj.optString("comments", ""))
                .build();

    }

    private List<SeekerInfo> convertToStringList(JSONArray jsonArray) {

        ArrayList<SeekerInfo> list = new ArrayList<SeekerInfo>();
        for (int i=0, l=jsonArray.length(); i<l; i++){
            JSONObject obj = jsonArray.optJSONObject(i);
            list.add(SeekerInfo.newBuilder()
                    .setSeekerId(obj.optString("seekerId"))
                    .setSeekerName(obj.optString("seekerName"))
                    .build()
            );
        }
        return list;
    }
}
