package com.pakworld.pakautoreply.engine;

public class ReplyRule {
    public final String name;
    public final String triggerPattern;
    public final String replyMessage;
    public final String type; // "custom", "keyword", "menu"
    public final boolean isExactMatch;

    public ReplyRule(String name, String triggerPattern, String replyMessage, String type, boolean isExactMatch) {
        this.name = name;
        this.triggerPattern = triggerPattern;
        this.replyMessage = replyMessage;
        this.type = type;
        this.isExactMatch = isExactMatch;
    }

    public boolean matches(String incoming) {
        if (incoming == null || triggerPattern == null) return false;
        String cleanIncoming = incoming.trim().toLowerCase();
        String cleanPattern = triggerPattern.trim().toLowerCase();

        if (isExactMatch) {
            return cleanIncoming.equals(cleanPattern);
        } else {
            return cleanIncoming.contains(cleanPattern);
        }
    }
}
