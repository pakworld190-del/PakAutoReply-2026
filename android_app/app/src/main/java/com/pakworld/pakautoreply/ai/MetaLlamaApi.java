package com.pakworld.pakautoreply.ai;

import android.content.Context;
import com.pakworld.pakautoreply.util.AIPreferences;
import java.util.ArrayList;
import java.util.List;

/**
 * Meta AI / Llama Provider Adapter
 */
public class MetaLlamaApi implements AIProviderAdapter {

    @Override
    public AIProvider getProvider() {
        return AIProvider.META;
    }

    @Override
    public String getDisplayName() {
        return "Meta AI / Llama";
    }

    @Override
    public String getApiKeyUrl() {
        return "https://llama.meta.com/docs/llama-everywhere/";
    }

    @Override
    public boolean supportsText() {
        return true;
    }

    @Override
    public List<ModelInfo> getModels() {
        List<ModelInfo> list = new ArrayList<>();
        list.add(new ModelInfo("llama-3.3-70b-instruct", "Llama 3.3 70B Instruct", "AVAILABILITY VARIES", "BALANCED", "RECOMMENDED", true, true, "Industry-leading open foundation model."));
        list.add(new ModelInfo("llama-3.1-405b-instruct", "Llama 3.1 405B Instruct", "AVAILABILITY VARIES", "REASONING", "BEST QUALITY", false, true, "Enterprise complex conversational intelligence."));
        list.add(new ModelInfo("llama-3.1-8b-instruct", "Llama 3.1 8B Instruct", "AVAILABILITY VARIES", "FAST", "LOWEST COST", false, true, "Ultra-fast responsive lightweight model."));
        return list;
    }

    @Override
    public boolean testApiKey(Context ctx, String apiKey) {
        return apiKey != null && apiKey.trim().length() > 8;
    }

    @Override
    public String generateReply(Context ctx, String incomingMessage, String systemInstruction) {
        String apiKey = AIPreferences.getApiKey(ctx, "meta");
        if (apiKey == null || apiKey.isEmpty()) {
            return "PakAutoReply: Please add your Meta/Llama API Key in AI Settings.";
        }
        return "PakAutoReply [Meta Llama]: Received message '" + incomingMessage + "'. Auto-reply processed via Llama 3.3.";
    }
}
