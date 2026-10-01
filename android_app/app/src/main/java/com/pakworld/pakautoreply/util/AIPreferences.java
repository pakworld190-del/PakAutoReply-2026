package com.pakworld.pakautoreply.util;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * AIPreferences - SharedPreferences manager for PakAutoReply-2026 (v1.9.4)
 * Package: com.pakworld.pakautoreply
 * 
 * Strict compliance with Section 8, 9, 48, 53, 73:
 * - Separate preference keys per provider (no cross-pollution)
 * - Existing gemini_api_key and gemini_model compatibility strictly preserved
 */
public class AIPreferences {

    private static final String PREF_NAME = "pakautoreply_ai_prefs";

    // Master AI Switch
    public static final String KEY_AI_ENABLED = "ai_reply_enabled";

    // Selected AI Provider
    public static final String KEY_SELECTED_PROVIDER = "selected_ai_provider"; // "gemini", "openai", "grok", "meta", "elevenlabs", "lowlevel"

    // Backward-Compatible & Standard Provider-Specific API Keys
    public static final String KEY_GEMINI_API_KEY     = "gemini_api_key"; // Legacy compatibility preserved!
    public static final String KEY_OPENAI_API_KEY     = "openai_api_key";
    public static final String KEY_XAI_API_KEY        = "xai_api_key";
    public static final String KEY_META_API_KEY       = "meta_api_key";
    public static final String KEY_ELEVENLABS_API_KEY = "elevenlabs_api_key";
    public static final String KEY_LOWLEVEL_API_KEY   = "lowlevel_api_key";

    // Provider-Specific Selected Models
    public static final String KEY_GEMINI_MODEL       = "gemini_model"; // Legacy compatibility preserved!
    public static final String KEY_OPENAI_MODEL       = "openai_model";
    public static final String KEY_XAI_MODEL          = "xai_model";
    public static final String KEY_META_MODEL         = "meta_model";
    public static final String KEY_ELEVENLABS_MODEL   = "elevenlabs_model";
    public static final String KEY_LOWLEVEL_MODEL     = "lowlevel_model";

    // Instructions & Settings
    public static final String KEY_TEACH_INSTRUCTION   = "ai_system_instruction";
    public static final String KEY_WEBSITE_URL         = "ai_website_url";
    public static final String KEY_REPLY_PREFIX        = "ai_reply_prefix";
    public static final String KEY_REPLY_DELAY         = "ai_reply_delay_seconds";
    public static final String KEY_IGNORE_GROUPS       = "ai_ignore_group_messages";

    private static SharedPreferences getPrefs(Context context) {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public static boolean isAIEnabled(Context context) {
        return getPrefs(context).getBoolean(KEY_AI_ENABLED, true);
    }

    public static void setAIEnabled(Context context, boolean enabled) {
        getPrefs(context).edit().putBoolean(KEY_AI_ENABLED, enabled).apply();
    }

    public static String getSelectedProvider(Context context) {
        return getPrefs(context).getString(KEY_SELECTED_PROVIDER, "gemini");
    }

    public static void setSelectedProvider(Context context, String providerId) {
        getPrefs(context).edit().putString(KEY_SELECTED_PROVIDER, providerId).apply();
    }

    /**
     * Get API key for specific provider
     */
    public static String getApiKey(Context context, String providerId) {
        SharedPreferences p = getPrefs(context);
        switch (providerId.toLowerCase()) {
            case "openai": return p.getString(KEY_OPENAI_API_KEY, "");
            case "grok": return p.getString(KEY_XAI_API_KEY, "");
            case "meta": return p.getString(KEY_META_API_KEY, "");
            case "elevenlabs": return p.getString(KEY_ELEVENLABS_API_KEY, "");
            case "lowlevel": return p.getString(KEY_LOWLEVEL_API_KEY, "");
            case "gemini":
            default:
                // Check legacy direct key first for 100% backward compatibility
                String legacy = p.getString("gemini_api_key", "");
                if (legacy.isEmpty()) {
                    legacy = p.getString(KEY_GEMINI_API_KEY, "");
                }
                return legacy;
        }
    }

    /**
     * Save API key for specific provider
     */
    public static void setApiKey(Context context, String providerId, String key) {
        SharedPreferences.Editor editor = getPrefs(context).edit();
        switch (providerId.toLowerCase()) {
            case "openai": editor.putString(KEY_OPENAI_API_KEY, key); break;
            case "grok": editor.putString(KEY_XAI_API_KEY, key); break;
            case "meta": editor.putString(KEY_META_API_KEY, key); break;
            case "elevenlabs": editor.putString(KEY_ELEVENLABS_API_KEY, key); break;
            case "lowlevel": editor.putString(KEY_LOWLEVEL_API_KEY, key); break;
            case "gemini":
            default:
                editor.putString(KEY_GEMINI_API_KEY, key);
                editor.putString("gemini_api_key", key); // Sync legacy key
                break;
        }
        editor.apply();
    }

    /**
     * Get selected model for specific provider
     */
    public static String getSelectedModel(Context context, String providerId) {
        SharedPreferences p = getPrefs(context);
        switch (providerId.toLowerCase()) {
            case "openai": return p.getString(KEY_OPENAI_MODEL, "gpt-4o-mini");
            case "grok": return p.getString(KEY_XAI_MODEL, "grok-3-mini");
            case "meta": return p.getString(KEY_META_MODEL, "llama-3.3-70b-instruct");
            case "elevenlabs": return p.getString(KEY_ELEVENLABS_MODEL, "eleven_multilingual_v2");
            case "lowlevel": return p.getString(KEY_LOWLEVEL_MODEL, "deepseek-r1:8b");
            case "gemini":
            default:
                return p.getString(KEY_GEMINI_MODEL, "gemini-3.8-flash");
        }
    }

    /**
     * Save selected model for specific provider
     */
    public static void setSelectedModel(Context context, String providerId, String modelId) {
        SharedPreferences.Editor editor = getPrefs(context).edit();
        switch (providerId.toLowerCase()) {
            case "openai": editor.putString(KEY_OPENAI_MODEL, modelId); break;
            case "grok": editor.putString(KEY_XAI_MODEL, modelId); break;
            case "meta": editor.putString(KEY_META_MODEL, modelId); break;
            case "elevenlabs": editor.putString(KEY_ELEVENLABS_MODEL, modelId); break;
            case "lowlevel": editor.putString(KEY_LOWLEVEL_MODEL, modelId); break;
            case "gemini":
            default:
                editor.putString(KEY_GEMINI_MODEL, modelId);
                editor.putString("gemini_model", modelId);
                break;
        }
        editor.apply();
    }

    public static String getSystemInstruction(Context context) {
        return getPrefs(context).getString(KEY_TEACH_INSTRUCTION, 
            "You are customer service assistant for PakAutoReply-2026. Reply politely and concisely in Urdu or English.");
    }

    public static void setSystemInstruction(Context context, String instruction) {
        getPrefs(context).edit().putString(KEY_TEACH_INSTRUCTION, instruction).apply();
    }

    public static String getWebsiteUrl(Context context) {
        return getPrefs(context).getString(KEY_WEBSITE_URL, "https://pakworld.pk");
    }

    public static void setWebsiteUrl(Context context, String url) {
        getPrefs(context).edit().putString(KEY_WEBSITE_URL, url).apply();
    }

    public static String getReplyPrefix(Context context) {
        return getPrefs(context).getString(KEY_REPLY_PREFIX, "[AI Reply] ");
    }

    public static boolean isIgnoreGroups(Context context) {
        return getPrefs(context).getBoolean(KEY_IGNORE_GROUPS, false);
    }
}
