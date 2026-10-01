/**
 * PakAutoReply-2026 Multi-AI Architecture Types
 * Application: PakAutoReply-2026 (v1.9.4)
 * Package: com.pakworld.pakautoreply
 */

export type ProviderId = 
  | 'gemini' 
  | 'openai' 
  | 'grok' 
  | 'meta' 
  | 'elevenlabs' 
  | 'lowlevel'; // Candidate: Local AI / On-Device (Ollama/LM Studio) or DeepSeek

export type PricingTier = 'FREE' | 'PAID' | 'FREE TIER' | 'AVAILABILITY VARIES';

export type SpeedLabel = 'FAST' | 'BALANCED' | 'REASONING';

export type QualityLabel = 'RECOMMENDED' | 'BEST QUALITY' | 'LOWEST COST' | 'STANDARD' | 'BALANCED';

export interface ModelInfo {
  id: string;
  displayName: string;
  provider: ProviderId;
  pricingTier: PricingTier;
  speedLabel?: SpeedLabel;
  qualityLabel?: QualityLabel;
  recommended?: boolean;
  freeTierEligible?: boolean;
  supportsText: boolean;
  supportsImage?: boolean;
  supportsAudio?: boolean;
  supportsTools?: boolean;
  contextWindow?: string;
  description: string;
  capabilityNote?: string;
}

export interface ProviderParameters {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  voiceId?: string; // ElevenLabs
  stability?: number; // ElevenLabs
  similarityBoost?: number; // ElevenLabs
  customEndpoint?: string; // Low-level / Local
}

export interface ProviderInfo {
  id: ProviderId;
  name: string;
  displayName: string;
  tagline: string;
  poweredBy: string;
  officialWebsite: string;
  apiKeyUrl: string;
  documentationUrl: string;
  iconName: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  supportsText: boolean;
  supportsAudio: boolean;
  supportsVision: boolean;
  supportsModelDiscovery: boolean;
  apiKeyPlaceholder: string;
  apiKeyHelpText: string;
  defaultModel: string;
  supportedParameters: (keyof ProviderParameters)[];
  textReplyCapable: boolean;
  capabilityRestrictionNotice?: string;
}

export interface ReplyRule {
  id: string;
  name: string;
  enabled: boolean;
  incomingPattern: string;
  matchType: 'exact' | 'contains' | 'starts_with' | 'regex';
  replyText: string;
  replyType: 'custom' | 'keyword' | 'menu';
  options?: { key: string; label: string; reply: string }[];
}

export interface AISettingsConfig {
  aiReplyEnabled: boolean;
  selectedProvider: ProviderId;
  apiKeys: Record<ProviderId, string>;
  selectedModels: Record<ProviderId, string>;
  parameters: Record<ProviderId, ProviderParameters>;
  teachAI: {
    systemInstruction: string;
    botName: string;
    businessName: string;
    language: string;
    tone: 'friendly' | 'professional' | 'concise' | 'humorous';
    customPrompt: string;
  };
  websiteUrl: string;
  generalSettings: {
    replyPrefix: string; // e.g. "[AI Reply]" or ""
    replyDelaySeconds: number;
    ignoreGroupMessages: boolean;
    replyUnknownContactsOnly: boolean;
    appendSignature: boolean;
    signatureText: string;
  };
}

export interface ReplyEngineResult {
  replyText: string;
  matchedRuleType: 'custom' | 'keyword' | 'menu' | 'ai_fallback' | 'blocked' | 'disabled';
  matchedRuleName?: string;
  providerUsed?: ProviderId;
  modelUsed?: string;
  executionTimeMs: number;
  error?: string;
}
