package com.pakworld.pakautoreply.engine;

import android.content.Context;
import com.pakworld.pakautoreply.ai.AIProviderAdapter;
import com.pakworld.pakautoreply.ai.AIProviderFactory;
import com.pakworld.pakautoreply.util.AIPreferences;
import java.util.ArrayList;
import java.util.List;

/**
 * ReplyEngine.java - Master auto-reply orchestration layer
 * Preserves existing class identity and strict priority per Section 5, 29, 30
 */
public class ReplyEngine {

    private static final List<ReplyRule> defaultRules = new ArrayList<>();

    static {
        // Priority 1: Custom Reply Rule
        defaultRules.add(new ReplyRule("Office Timings", "timing", 
            "Our office hours are Monday to Saturday, 9:00 AM to 9:00 PM PKT. Closed on Sunday.", "custom", false));

        // Priority 2: Keyword Reply Rule
        defaultRules.add(new ReplyRule("Pricing Inquiry", "price", 
            "PakAutoReply is 100% free with BYOK (Bring Your Own Key) for Gemini, OpenAI, Grok, and Meta AI!", "keyword", false));

        // Priority 3: Menu Reply Rule
        defaultRules.add(new ReplyRule("Main Menu", "menu", 
            "Welcome to PakAutoReply! Select an option:\n1. Services\n2. Pricing\n3. Support", "menu", true));
    }

    /**
     * Process incoming message across priority pipeline
     */
    public static ReplyResult processMessage(Context context, String incomingMessage, String sender, boolean isGroup) {
        if (incomingMessage == null || incomingMessage.trim().isEmpty()) {
            return ReplyResult.disabled("Empty message");
        }

        // Check 0: Ignore group messages if configured
        if (isGroup && AIPreferences.isIgnoreGroups(context)) {
            return ReplyResult.disabled("Group message ignored");
        }

        String clean = incomingMessage.trim();

        // Priority 1: Custom Reply Rules
        for (ReplyRule rule : defaultRules) {
            if ("custom".equals(rule.type) && rule.matches(clean)) {
                return ReplyResult.custom(formatReply(context, rule.replyMessage, false), rule.name);
            }
        }

        // Priority 2: Keyword Reply Rules
        for (ReplyRule rule : defaultRules) {
            if ("keyword".equals(rule.type) && rule.matches(clean)) {
                return ReplyResult.keyword(formatReply(context, rule.replyMessage, false), rule.name);
            }
        }

        // Priority 3: Menu Reply Rules
        for (ReplyRule rule : defaultRules) {
            if ("menu".equals(rule.type) && rule.matches(clean)) {
                return ReplyResult.menu(formatReply(context, rule.replyMessage, false), rule.name);
            }
        }

        // Priority 4: Multi-Provider AI Fallback
        if (!AIPreferences.isAIEnabled(context)) {
            return ReplyResult.disabled("AI is turned off");
        }

        String providerId = AIPreferences.getSelectedProvider(context);
        AIProviderAdapter adapter = AIProviderFactory.getAdapter(providerId);

        // Capability check: e.g. ElevenLabs is audio only
        if (!adapter.supportsText()) {
            return ReplyResult.ai("ElevenLabs is currently configured for voice/agent capabilities. Text auto-reply is unavailable for this provider.", providerId, "restricted");
        }

        String systemPrompt = AIPreferences.getSystemInstruction(context);
        String aiResponse = adapter.generateReply(context, clean, systemPrompt);

        return ReplyResult.ai(formatReply(context, aiResponse, true), providerId, AIPreferences.getSelectedModel(context, providerId));
    }

    private static String formatReply(Context context, String rawReply, boolean isAI) {
        if (rawReply == null) return "";
        if (isAI) {
            String prefix = AIPreferences.getReplyPrefix(context);
            if (prefix != null && !prefix.isEmpty()) {
                return prefix + rawReply;
            }
        }
        return rawReply;
    }
}
