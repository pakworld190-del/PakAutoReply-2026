package com.pakworld.pakautoreply.engine;

public class ReplyResult {
    public final String replyText;
    public final String matchedType; // "custom", "keyword", "menu", "ai_fallback", "blocked", "disabled"
    public final String ruleName;
    public final String providerUsed;

    public ReplyResult(String replyText, String matchedType, String ruleName, String providerUsed) {
        this.replyText = replyText;
        this.matchedType = matchedType;
        this.ruleName = ruleName;
        this.providerUsed = providerUsed;
    }

    public static ReplyResult custom(String text, String name) {
        return new ReplyResult(text, "custom", name, null);
    }

    public static ReplyResult keyword(String text, String name) {
        return new ReplyResult(text, "keyword", name, null);
    }

    public static ReplyResult menu(String text, String name) {
        return new ReplyResult(text, "menu", name, null);
    }

    public static ReplyResult ai(String text, String provider, String model) {
        return new ReplyResult(text, "ai_fallback", model, provider);
    }

    public static ReplyResult blocked() {
        return new ReplyResult("", "blocked", "Blocked Contact", null);
    }

    public static ReplyResult disabled(String reason) {
        return new ReplyResult("", "disabled", reason, null);
    }
}
