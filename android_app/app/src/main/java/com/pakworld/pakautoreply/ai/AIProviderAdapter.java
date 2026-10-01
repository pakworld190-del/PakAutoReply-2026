package com.pakworld.pakautoreply.ai;

import android.content.Context;
import java.util.List;

/**
 * AIProviderAdapter interface
 * Defined in Section 69
 */
public interface AIProviderAdapter {
    AIProvider getProvider();
    String getDisplayName();
    String getApiKeyUrl();
    List<ModelInfo> getModels();
    boolean testApiKey(Context ctx, String apiKey);
    String generateReply(Context ctx, String incomingMessage, String systemInstruction);
    boolean supportsText();
}
