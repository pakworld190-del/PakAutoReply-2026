package com.pakworld.pakautoreply.ai;

/**
 * Supported AI Providers in PakAutoReply-2026
 */
public enum AIProvider {
    GEMINI(
        "gemini", 
        "Gemini", 
        "Google AI", 
        "https://aistudio.google.com/app/apikey", 
        "gemini-3.8-flash", 
        true
    ),
    OPENAI(
        "openai", 
        "ChatGPT / OpenAI", 
        "OpenAI", 
        "https://platform.openai.com/api-keys", 
        "gpt-4o-mini", 
        true
    ),
    GROK(
        "grok", 
        "Grok / xAI", 
        "xAI", 
        "https://console.x.ai/", 
        "grok-3-mini", 
        true
    ),
    META(
        "meta", 
        "Meta AI / Llama", 
        "Meta / Llama API", 
        "https://llama.meta.com/docs/llama-everywhere/", 
        "llama-3.3-70b-instruct", 
        true
    ),
    ELEVENLABS(
        "elevenlabs", 
        "ElevenLabs", 
        "ElevenLabs Voice AI", 
        "https://elevenlabs.io/app/settings/api-keys", 
        "eleven_multilingual_v2", 
        false // Restrict text auto-reply per Section 21 & 65
    ),
    LOWLEVEL(
        "lowlevel", 
        "Local AI / Low-Level (لو لیول)", 
        "Ollama / Localhost", 
        "https://github.com/ollama/ollama", 
        "deepseek-r1:8b", 
        true
    );

    public final String id;
    public final String displayName;
    public final String poweredBy;
    public final String apiKeyUrl;
    public final String defaultModel;
    public final boolean supportsTextAutoReply;

    AIProvider(String id, String displayName, String poweredBy, String apiKeyUrl, String defaultModel, boolean supportsTextAutoReply) {
        this.id = id;
        this.displayName = displayName;
        this.poweredBy = poweredBy;
        this.apiKeyUrl = apiKeyUrl;
        this.defaultModel = defaultModel;
        this.supportsTextAutoReply = supportsTextAutoReply;
    }

    public static AIProvider fromId(String id) {
        if (id == null) return GEMINI;
        for (AIProvider p : values()) {
            if (p.id.equalsIgnoreCase(id)) return p;
        }
        return GEMINI;
    }
}
