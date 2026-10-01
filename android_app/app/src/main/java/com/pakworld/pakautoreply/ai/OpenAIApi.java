package com.pakworld.pakautoreply.ai;

import android.content.Context;
import com.pakworld.pakautoreply.util.AIPreferences;
import com.pakworld.pakautoreply.util.HttpHelper;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * OpenAI / ChatGPT Provider Adapter
 */
public class OpenAIApi implements AIProviderAdapter {

    @Override
    public AIProvider getProvider() {
        return AIProvider.OPENAI;
    }

    @Override
    public String getDisplayName() {
        return "ChatGPT / OpenAI";
    }

    @Override
    public String getApiKeyUrl() {
        return "https://platform.openai.com/api-keys";
    }

    @Override
    public boolean supportsText() {
        return true;
    }

    @Override
    public List<ModelInfo> getModels() {
        List<ModelInfo> list = new ArrayList<>();
        list.add(new ModelInfo("gpt-5.4-mini", "GPT-5.4 Mini", "PAID", "FAST", "RECOMMENDED", true, true, "High-speed compact model with high conversational accuracy."));
        list.add(new ModelInfo("gpt-5.4", "GPT-5.4", "PAID", "BALANCED", "BEST QUALITY", false, true, "Flagship reasoning and instruction following."));
        list.add(new ModelInfo("gpt-4o-mini", "GPT-4o Mini", "PAID", "FAST", "LOWEST COST", false, true, "Cost-effective, low-latency model optimized for chat."));
        list.add(new ModelInfo("gpt-4o", "GPT-4o (Omni)", "PAID", "BALANCED", "BEST QUALITY", false, true, "Multimodal flagship conversational model."));
        list.add(new ModelInfo("gpt-4.1-mini", "GPT-4.1 Mini", "PAID", "FAST", "BALANCED", false, true, "Balanced continuous messaging model."));
        return list;
    }

    @Override
    public boolean testApiKey(Context ctx, String apiKey) {
        if (apiKey == null || apiKey.trim().length() < 15) return false;
        return apiKey.trim().startsWith("sk-");
    }

    @Override
    public String generateReply(Context ctx, String incomingMessage, String systemInstruction) {
        String apiKey = AIPreferences.getApiKey(ctx, "openai");
        if (apiKey == null || apiKey.isEmpty()) {
            return "PakAutoReply: Please add your OpenAI API Key in AI Settings.";
        }

        String model = AIPreferences.getSelectedModel(ctx, "openai");
        String endpoint = "https://api.openai.com/v1/chat/completions";

        try {
            JSONObject root = new JSONObject();
            root.put("model", model);

            JSONArray messages = new JSONArray();
            if (systemInstruction != null && !systemInstruction.isEmpty()) {
                messages.put(new JSONObject().put("role", "system").put("content", systemInstruction));
            }
            messages.put(new JSONObject().put("role", "user").put("content", incomingMessage));
            root.put("messages", messages);

            Map<String, String> headers = new HashMap<>();
            headers.put("Authorization", "Bearer " + apiKey.trim());

            HttpHelper.HttpResponse res = HttpHelper.postJson(endpoint, root.toString(), headers);
            if (res.isSuccess) {
                JSONObject resObj = new JSONObject(res.body);
                JSONArray choices = resObj.optJSONArray("choices");
                if (choices != null && choices.length() > 0) {
                    JSONObject msg = choices.getJSONObject(0).optJSONObject("message");
                    if (msg != null) return msg.optString("content", "");
                }
            }
            return "PakAutoReply [OpenAI]: Automated response received.";
        } catch (Exception e) {
            return "PakAutoReply [OpenAI error]: " + e.getMessage();
        }
    }
}
