package com.pakworld.pakautoreply.ai;

/**
 * ModelInfo metadata data model
 * Section 15 & 16: Data-driven FREE / PAID / RECOMMENDED / FAST / BEST QUALITY tags
 */
public class ModelInfo {
    public final String id;
    public final String displayName;
    public final String pricingTier; // "FREE", "FREE TIER", "PAID", "AVAILABILITY VARIES"
    public final String speedLabel;   // "FAST", "BALANCED", "REASONING"
    public final String qualityLabel; // "RECOMMENDED", "BEST QUALITY", "LOWEST COST"
    public final boolean isRecommended;
    public final boolean supportsText;
    public final String description;

    public ModelInfo(String id, String displayName, String pricingTier, String speedLabel, 
                     String qualityLabel, boolean isRecommended, boolean supportsText, String description) {
        this.id = id;
        this.displayName = displayName;
        this.pricingTier = pricingTier;
        this.speedLabel = speedLabel;
        this.qualityLabel = qualityLabel;
        this.isRecommended = isRecommended;
        this.supportsText = supportsText;
        this.description = description;
    }

    public String getFormattedBadge() {
        StringBuilder sb = new StringBuilder(pricingTier);
        if (isRecommended) {
            sb.append(" / RECOMMENDED");
        } else if (speedLabel != null && !speedLabel.isEmpty()) {
            sb.append(" / ").append(speedLabel);
        }
        return sb.toString();
    }
}
