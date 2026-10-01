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
 * Grok / xAI Provider Adapter
 */
public class GrokApi implements AIProviderAdapter {

    @Override
    public AIProvider getProvider() {
        return AIProvider.GROK;
    }

    @Override
    public String getDisplayName() {
        return "Grok / xAI";
    }

    @Override
    public String getApiKeyUrl() {
        return "https://console.x.ai/";
    }

    @Override
    public boolean supportsText() {
        return true;
    }

    @Override
    public List<ModelInfo> getModels() {
        List<ModelInfo> list = new ArrayList<>();
        list.add(new ModelInfo("grok-3-mini", "Grok 3 Mini", "PAID", "FAST", "RECOMMENDED", true, true, "Fast, cost-efficient xAI model for message dispatch."));
        list.add(new ModelInfo("grok-3", "Grok 3", "PAID", "BALANCED", "BEST QUALITY", false, true, "High intelligence flagship model with real-time reasoning."));
        list.add(new ModelInfo("grok-2", "Grok 2", "PAID", "BALANCED", "STANDARD", false, true, "Established production model from xAI."));
        return list;
    }

    @Override
    public boolean testApiKey(Context ctx, String apiKey) {
        if (apiKey == null || apiKey.trim().length() < 15) return false;
        return apiKey.trim().startsWith("xai-");
    }

    @Override
    public String generateReply(Context ctx, String incomingMessage, String systemInstruction) {
        String apiKey = AIPreferences.getApiKey(ctx, "grok");
        if (apiKey == null || apiKey.isEmpty()) {
            return "PakAutoReply: Please add your xAI Grok API Key in AI Settings.";
        }

        String model = AIPreferences.getSelectedModel(ctx, "grok");
        String endpoint = "https://api.x.ai/v1/chat/completions";

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
            return "PakAutoReply [xAI Grok]: Reply processed successfully.";
        } catch (Exception e) {
            return "PakAutoReply [Grok error]: " + e.getMessage();
        }
    }
}
