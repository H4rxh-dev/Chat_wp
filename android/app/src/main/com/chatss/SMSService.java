package com.chatss;

import android.content.Intent;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.headless.HeadlessJsTaskConfig;

import javax.annotation.Nullable;

public class SMSService extends HeadlessJsTaskService {
    @Override
    protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        WritableMap data = Arguments.createMap();
        data.putString("sender", intent.getStringExtra("sender"));
        data.putString("body", intent.getStringExtra("body"));

        return new HeadlessJsTaskConfig(
            "SMSReceiverTask", // MUST match task name in index.js
            data,
            5000, // timeout in ms
            true  // run even if app is killed
        );
    }
}
