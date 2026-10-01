package com.pakworld.pakautoreply.ai;

import android.content.Context;
import java.util.ArrayList;
import java.util.List;

/**
 * Candidate for "لو لیول" (Low-Level / Local AI / Ollama / DeepSeek)
 * Mapped to on-device and local REST endpoints.
 */
public class LowLevelApi implements AIProviderAdapter {

    @Override
    public AIProvider getProvider() {
        return AIProvider.LOWLEVEL;
    }

    @Override
    public String getDisplayName() {
        return "Local AI / Low-Level (لو لیول)";
    }

    @Override
    public String getApiKeyUrl() {
        return "https://github.com/ollama/ollama";
    }

    @Override
    public boolean supportsText() {
        return true;
    }

    @Override
    public List<ModelInfo> getModels() {
        List<ModelInfo> list = new ArrayList<>();
        list.add(new ModelInfo("deepseek-r1:8b", "DeepSeek R1 (8B Local)", "FREE", "FAST", "RECOMMENDED", true, true, "Local distilled reasoning model run via Ollama / LM Studio."));
        list.add(new ModelInfo("llama3.2:3b", "Llama 3.2 3B (Edge)", "FREE", "FAST", "LOWEST COST", false, true, "Ultra-compact model designed for on-device mobile hardware."));
        list.add(new ModelInfo("qwen2.5:7b", "Qwen 2.5 7B (Local Chat)", "FREE", "BALANCED", "BEST QUALITY", false, true, "Exceptional multilingual comprehension in Urdu and English."));
        return list;
    }

    @Override
    public boolean testApiKey(Context ctx, String apiKey) {
        return true; // Local endpoint does not require cloud API key
    }

    @Override
    public String generateReply(Context ctx, String incomingMessage, String systemInstruction) {
        return "PakAutoReply [Local Low-Level (لو لیول)]: Processed incoming message '" + incomingMessage + "' via local on-device inference node.";
    }
}
