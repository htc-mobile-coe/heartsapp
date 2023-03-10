package com.hfn.unified.reactnative.modules;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.AudioManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.hfn.unified.R;

public class DeviceCapabilitiesReactModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactApplicationContext;
    public DeviceCapabilitiesReactModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactApplicationContext = reactContext;
    }


    @ReactMethod
    public void hasDoNotDisturbPermission(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            if( Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ) {
                NotificationManager notificationManager = (NotificationManager) reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE);
                // if user granted access else ask for permission
                if ( !notificationManager.isNotificationPolicyAccessGranted()) {
                    responsePromise.resolve(false);
                }else {
                    responsePromise.resolve(true);
                }
            }else{
                responsePromise.resolve(true);
            }

        } catch(Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void requestDoNotDisturbPermission(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                NotificationManager notificationManager = (NotificationManager) reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE);
                // if user granted access else ask for permission
                if (!notificationManager.isNotificationPolicyAccessGranted()) {

                    Intent intent = new Intent(
                            android.provider.Settings
                                    .ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);

                    if (intent.resolveActivity(reactApplicationContext.getPackageManager()) != null) {
                        reactApplicationContext.startActivity(intent);
                    }
                }
            }
            responsePromise.resolve(true);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }


    @ReactMethod
    public void enableDoNotDisturbMode(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            if (Build.VERSION.SDK_INT < 23) {
                AudioManager audioManager = (AudioManager)reactApplicationContext.getSystemService(Context.AUDIO_SERVICE);
                audioManager.setRingerMode(AudioManager.RINGER_MODE_SILENT);
                audioManager.setStreamMute(AudioManager.STREAM_MUSIC,false);
                responsePromise.resolve(true);
            } else if( Build.VERSION.SDK_INT >= 23 ) {
                NotificationManager notificationManager = (NotificationManager) reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE);
                // if user granted access else ask for permission
                if ( notificationManager.isNotificationPolicyAccessGranted()) {
                    AudioManager audioManager = (AudioManager) reactApplicationContext.getSystemService(Context.AUDIO_SERVICE);
                    audioManager.setRingerMode(AudioManager.RINGER_MODE_SILENT);
                    audioManager.setStreamMute(AudioManager.STREAM_MUSIC,false);
                    notificationManager.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_NONE);
                    responsePromise.resolve(true);
                }else{
                    responsePromise.resolve(false);
                }
            }
        } catch ( Exception e ) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void disableDoNotDisturbMode(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            if (Build.VERSION.SDK_INT < 23) {
                AudioManager audioManager = (AudioManager)reactApplicationContext.getSystemService(Context.AUDIO_SERVICE);
                audioManager.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
                audioManager.setStreamMute(AudioManager.STREAM_MUSIC,false);
                responsePromise.resolve(true);
            } else if( Build.VERSION.SDK_INT >= 23 ) {
                NotificationManager notificationManager = (NotificationManager)reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE);
                // if user granted access else ask for permission
                if ( notificationManager.isNotificationPolicyAccessGranted()) {
                    AudioManager audioManager = (AudioManager) reactApplicationContext.getSystemService(Context.AUDIO_SERVICE);
                    audioManager.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
                    audioManager.setStreamMute(AudioManager.STREAM_MUSIC,false);
                    notificationManager.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_ALL);
                    responsePromise.resolve(true);
                }else{
                    responsePromise.resolve(false);
                }
            }
        } catch ( Exception e ) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "DeviceCapabilitiesService";
    }
}
