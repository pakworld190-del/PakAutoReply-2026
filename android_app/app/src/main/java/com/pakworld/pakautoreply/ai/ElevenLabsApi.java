package com.pakworld.pakautoreply.ai;

import android.content.Context;
import java.util.ArrayList;
import java.util.List;

/**
 * ElevenLabs Provider Adapter
 * Strict compliance with Sections 21 & 65:
 * ElevenLabs is an audio/voice platform. Text auto-reply is strictly guarded to prevent crashes.
 */
public class ElevenLabsApi implements AIProviderAdapter {

    @Override
    public AIProvider getProvider() {
        return AIProvider.ELEVENLABS;
    }

    @Override
    public String getDisplayName() {
        return "ElevenLabs";
    }

    @Override
    public String getApiKeyUrl() {
        return "https://elevenlabs.io/app/settings/api-keys";
    }

    @Override
    public boolean supportsText() {
        return false; // Text auto-reply is not supported on ElevenLabs voice endpoints
    }

    @Override
    public List<ModelInfo> getModels() {
        List<ModelInfo> list = new ArrayList<>();
        list.add(new ModelInfo("eleven_multilingual_v2", "Eleven Multilingual v2", "PAID", "BALANCED", "RECOMMENDED", true, false, "Hyper-realistic voice synthesis supporting Urdu and English."));
        list.add(new ModelInfo("eleven_v3", "Eleven v3 (Flagship Audio)", "PAID", "BALANCED", "BEST QUALITY", false, false, "Emotional speech and voice cloning model."));
        list.add(new ModelInfo("eleven_flash_v2_5", "Eleven Flash v2.5", "PAID", "FAST", "LOWEST COST", false, false, "Sub-75ms ultra-low latency speech synthesis."));
        return list;
    }

    @Override
    public boolean testApiKey(Context ctx, String apiKey) {
        return apiKey != null && apiKey.trim().length() >= 20;
    }

    @Override
    public String generateReply(Context ctx, String incomingMessage, String systemInstruction) {
        // Section 21 & 65 requirement: Do NOT crash, do NOT pretend it generates plain text LLM chat.
        return "ElevenLabs is currently configured for voice/agent capabilities. Text auto-reply is unavailable for this provider.";
    }
}
