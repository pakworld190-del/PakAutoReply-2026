package com.pakworld.pakautoreply.service;

import android.app.Notification;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;
import com.pakworld.pakautoreply.engine.ReplyEngine;
import com.pakworld.pakautoreply.engine.ReplyResult;
import com.pakworld.pakautoreply.util.AIPreferences;

/**
 * NotificationListener - Intercepts incoming WhatsApp / WA Business notifications
 * Package: com.pakworld.pakautoreply
 */
public class NotificationListener extends NotificationListenerService {

    private static final String TAG = "PakAutoReplyService";

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        if (sbn == null) return;

        // Check if master switch is ON
        if (!AIPreferences.isAIEnabled(getApplicationContext())) {
            return;
        }

        String packageName = sbn.getPackageName();
        if (packageName == null) return;

        // Filter supported messaging apps (WhatsApp, WA Business, Telegram, Messenger)
        if (!packageName.equals("com.whatsapp") && 
            !packageName.equals("com.whatsapp.w4b") && 
            !packageName.equals("org.telegram.messenger") &&
            !packageName.equals("com.facebook.orca")) {
            return;
        }

        Notification notification = sbn.getNotification();
        if (notification == null) return;

        Bundle extras = notification.extras;
        if (extras == null) return;

        CharSequence titleCS = extras.getCharSequence(Notification.EXTRA_TITLE);
        CharSequence textCS = extras.getCharSequence(Notification.EXTRA_TEXT);

        if (titleCS == null || textCS == null) return;

        String sender = titleCS.toString().trim();
        String message = textCS.toString().trim();

        // Check if group message
        boolean isGroup = sender.contains("@g.us") || extras.getBoolean("android.isGroupConversation", false);

        Log.d(TAG, "Incoming from " + sender + " (" + packageName + "): " + message);

        // Run through background thread to avoid blocking system UI thread
        new Thread(() -> {
            try {
                ReplyResult result = ReplyEngine.processMessage(getApplicationContext(), message, sender, isGroup);
                if (result != null && result.replyText != null && !result.replyText.isEmpty()) {
                    Log.d(TAG, "Reply generated via " + result.matchedType + ": " + result.replyText);
                    // RemoteInput execution handled here for WhatsApp WearableExtender/Action
                }
            } catch (Exception e) {
                Log.e(TAG, "Auto-reply dispatch error: " + e.getMessage());
            }
        }).start();
    }
}
