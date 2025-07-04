package com.chatss;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;

public class SMSReceiver extends BroadcastReceiver {
    private static final String TAG = "📩 SMSReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "📥 onReceive called");

        Bundle bundle = intent.getExtras();
        if (bundle != null) {
            Object[] pdus = (Object[]) bundle.get("pdus");

            if (pdus != null && pdus.length > 0) {
                for (Object pdu : pdus) {
                    SmsMessage sms;
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        String format = bundle.getString("format");
                        sms = SmsMessage.createFromPdu((byte[]) pdu, format);
                    } else {
                        sms = SmsMessage.createFromPdu((byte[]) pdu);
                    }

                    if (sms != null) {
                        String messageBody = sms.getMessageBody();
                        String sender = sms.getOriginatingAddress();

                        if (sender != null && messageBody != null) {
                            Log.d(TAG, "✅ SMS from: " + sender + " | Body: " + messageBody);

                            // Start Headless JS Task
                            Intent serviceIntent = new Intent(context, SMSService.class);
                            serviceIntent.putExtra("sender", sender);
                            serviceIntent.putExtra("body", messageBody);

                            try {
                                context.startService(serviceIntent);
                                HeadlessJsTaskService.acquireWakeLockNow(context);
                                Log.d(TAG, "🚀 Headless JS service started");
                            } catch (Exception e) {
                                Log.e(TAG, "❌ Error starting service: ", e);
                            }
                        } else {
                            Log.w(TAG, "⚠️ SMS missing sender or body");
                        }
                    } else {
                        Log.w(TAG, "⚠️ SmsMessage is null");
                    }
                }
            } else {
                Log.w(TAG, "⚠️ No PDUs found in bundle");
            }
        } else {
            Log.w(TAG, "⚠️ Bundle is null in onReceive");
        }
    }
}
