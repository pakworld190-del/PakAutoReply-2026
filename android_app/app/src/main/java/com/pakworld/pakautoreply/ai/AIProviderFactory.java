package com.pakworld.pakautoreply.ai;

import java.util.HashMap;
import java.util.Map;

/**
 * AIProviderFactory - Singleton factory for provider adapters
 */
public class AIProviderFactory {

    private static final Map<AIProvider, AIProviderAdapter> adapters = new HashMap<>();

    static {
        adapters.put(AIProvider.GEMINI, new GeminiApi());
        adapters.put(AIProvider.OPENAI, new OpenAIApi());
        adapters.put(AIProvider.GROK, new GrokApi());
        adapters.put(AIProvider.META, new MetaLlamaApi());
        adapters.put(AIProvider.ELEVENLABS, new ElevenLabsApi());
        adapters.put(AIProvider.LOWLEVEL, new LowLevelApi());
    }

    public static AIProviderAdapter getAdapter(AIProvider provider) {
        AIProviderAdapter adapter = adapters.get(provider);
        if (adapter == null) {
            return adapters.get(AIProvider.GEMINI);
        }
        return adapter;
    }

    public static AIProviderAdapter getAdapter(String providerId) {
        return getAdapter(AIProvider.fromId(providerId));
    }
}
