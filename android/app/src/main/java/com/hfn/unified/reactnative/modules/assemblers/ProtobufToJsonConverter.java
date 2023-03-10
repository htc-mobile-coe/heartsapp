package com.hfn.unified.reactnative.modules.assemblers;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.FieldNamingStrategy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.lang.reflect.Field;

public class ProtobufToJsonConverter {
    private static ExclusionStrategy protobufExclusionStrategy = new ExclusionStrategy() {
        @Override
        public boolean shouldSkipField(FieldAttributes f) {
            if (!f.getName().endsWith("_")) {
                return true;
            }
            if (f.getName().startsWith("bitField")) {
                return true;
            }
            return false;
        }

        @Override
        public boolean shouldSkipClass(Class<?> clazz) {
            return false;
        }
    };

    private static FieldNamingStrategy customPolicy = new FieldNamingStrategy() {
        @Override
        public String translateName(Field f) {
            String fieldName = f.getName();
            int index = fieldName.lastIndexOf('_');

            if (index == fieldName.length() - 1) {
                return fieldName.substring(0, index);
            }

            return fieldName;
        }
    };

    public static String toJSON(Object obj) {
        Gson gson = new GsonBuilder()
                .setExclusionStrategies(protobufExclusionStrategy)
                .setFieldNamingStrategy(customPolicy)
                .setPrettyPrinting()
                .create();

        return gson.toJson(obj);
    }


}
