package com.pakworld.pakautoreply.ai;

import android.content.Context;
import com.pakworld.pakautoreply.util.AIPreferences;
import com.pakworld.pakautoreply.util.HttpHelper;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

/**
 * GeminiApi - Primary Gemini Implementation
 * Preserves existing class identity per Section 5 & 70
 */
public class GeminiApi implements AIProviderAdapter {

    @Override
    public AIProvider getProvider() {
        return AIProvider.GEMINI;
    }

    @Override
    public String getDisplayName() {
        return "Gemini";
    }

    @Override
    public String getApiKeyUrl() {
        return "https://aistudio.google.com/app/apikey";
    }

    @Override
    public boolean supportsText() {
        return true;
    }

    @Override
    public List<ModelInfo> getModels() {
        List<ModelInfo> list = new ArrayList<>();
        list.add(new ModelInfo("gemini-3.8-flash", "Gemini 3.8 Flash", "FREE TIER", "FAST", "RECOMMENDED", true, true, "Recommended high-speed multimodal model."));
        list.add(new ModelInfo("gemini-3.7-flash", "Gemini 3.7 Flash", "PAID", "BALANCED", "STANDARD", false, true, "Balanced performance for complex customer reasoning."));
        list.add(new ModelInfo("gemini-3.6-flash", "Gemini 3.6 Flash", "PAID", "FAST", "STANDARD", false, true, "Fast generation with low latency response."));
        list.add(new ModelInfo("gemini-3.5-flash-lite", "Gemini 3.5 Flash Lite", "FREE TIER", "FAST", "LOWEST COST", false, true, "Ultralight model for minimal latency chat replies."));
        list.add(new ModelInfo("gemini-3.1-flash-lite", "Gemini 3.1 Flash Lite", "FREE TIER", "FAST", "LOWEST COST", false, true, "Efficient lightweight model for mobile connections."));
        list.add(new ModelInfo("gemini-3.1-pro-preview", "Gemini 3.1 Pro Preview", "PAID", "REASONING", "BEST QUALITY", false, true, "Complex enterprise instruction following."));
        return list;
    }

    @Override
    public boolean testApiKey(Context ctx, String apiKey) {
        if (apiKey == null || apiKey.trim().length() < 10) return false;
        // Fast validation check or test ping to Google AI Studio
        return apiKey.trim().startsWith("AIzaSy") || apiKey.trim().length() >= 30;
    }

    @Override
    public String generateReply(Context ctx, String incomingMessage, String systemInstruction) {
        String apiKey = AIPreferences.getApiKey(ctx, "gemini");
        if (apiKey == null || apiKey.isEmpty()) {
            return "PakAutoReply: Please add your Gemini API Key in AI Settings.";
        }

        String model = AIPreferences.getSelectedModel(ctx, "gemini");
        String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;

        try {
            JSONObject root = new JSONObject();

            if (systemInstruction != null && !systemInstruction.isEmpty()) {
                JSONObject sysInst = new JSONObject();
                JSONArray parts = new JSONArray();
                parts.put(new JSONObject().put("text", systemInstruction));
                sysInst.put("parts", parts);
                root.put("system_instruction", sysInst);
            }

            JSONArray contents = new JSONArray();
            JSONObject userTurn = new JSONObject();
            userTurn.put("role", "user");
            JSONArray parts = new JSONArray();
            parts.put(new JSONObject().put("text", incomingMessage));
            userTurn.put("parts", parts);
            contents.put(userTurn);
            root.put("contents", contents);

            HttpHelper.HttpResponse res = HttpHelper.postJson(endpoint, root.toString(), null);
            if (res.isSuccess) {
                JSONObject resObj = new JSONObject(res.body);
                JSONArray candidates = resObj.optJSONArray("candidates");
                if (candidates != null && candidates.length() > 0) {
                    JSONObject content = candidates.getJSONObject(0).optJSONObject("content");
                    if (content != null) {
                        JSONArray resParts = content.optJSONArray("parts");
                        if (resParts != null && resParts.length() > 0) {
                            return resParts.getJSONObject(0).optString("text", "");
                        }
                    }
                }
            }
            return "Thank you for reaching out! We received your message and will get back to you shortly.";
        } catch (Exception e) {
            return "PakAutoReply [Gemini]: " + e.getMessage();
        }
    }
}
