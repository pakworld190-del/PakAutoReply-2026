/**
 * Storage Service - Emulates Android SharedPreferences (com.pakworld.pakautoreply)
 * Preserves existing backward compatibility for gemini_api_key and gemini_model
 */

import { ProviderId, AISettingsConfig, ProviderParameters, ReplyRule } from '../types/ai';
import { INITIAL_MODELS } from '../data/providers';

const PREF_PREFIX = 'pakautoreply_';

export const DEFAULT_AI_CONFIG: AISettingsConfig = {
  aiReplyEnabled: true,
  selectedProvider: 'gemini',
  apiKeys: {
    gemini: '',
    openai: '',
    grok: '',
    meta: '',
    elevenlabs: '',
    lowlevel: '',
  },
  selectedModels: {
    gemini: 'gemini-3.8-flash',
    openai: 'gpt-4o-mini',
    grok: 'grok-3-mini',
    meta: 'llama-3.3-70b-instruct',
    elevenlabs: 'eleven_multilingual_v2',
    lowlevel: 'deepseek-r1:8b',
  },
  parameters: {
    gemini: { temperature: 0.7, topP: 0.95, topK: 40, maxTokens: 800 },
    openai: { temperature: 0.7, topP: 1.0, presencePenalty: 0.0, frequencyPenalty: 0.0, maxTokens: 800 },
    grok: { temperature: 0.7, topP: 0.9, maxTokens: 800 },
    meta: { temperature: 0.7, topP: 0.9, maxTokens: 800 },
    elevenlabs: { stability: 0.5, similarityBoost: 0.75 },
    lowlevel: { temperature: 0.7, topP: 0.9, customEndpoint: 'http://localhost:11434', maxTokens: 800 },
  },
  teachAI: {
    systemInstruction: 'You are the official customer service assistant for PakAutoReply-2026. Provide polite, accurate, and concise replies in the customer\'s language (Urdu or English).',
    botName: 'PakAutoBot',
    businessName: 'Pak World Services',
    language: 'Auto-Detect (Urdu / English)',
    tone: 'friendly',
    customPrompt: 'If asked about business hours, we are available Monday to Saturday 9 AM to 9 PM PKT. Offer helpful solutions quickly.',
  },
  websiteUrl: 'https://pakworld.pk',
  generalSettings: {
    replyPrefix: '[AI Reply] ',
    replyDelaySeconds: 2,
    ignoreGroupMessages: false,
    replyUnknownContactsOnly: false,
    appendSignature: true,
    signatureText: '— Powered by PakAutoReply',
  },
};

export const DEFAULT_RULES: ReplyRule[] = [
  {
    id: 'rule_1',
    name: 'Office Timings',
    enabled: true,
    incomingPattern: 'timing',
    matchType: 'contains',
    replyType: 'custom',
    replyText: 'Our office hours are Monday to Saturday, 9:00 AM to 9:00 PM PKT. Sunday is closed.',
  },
  {
    id: 'rule_2',
    name: 'Pricing Inquiry',
    enabled: true,
    incomingPattern: 'price',
    matchType: 'contains',
    replyType: 'keyword',
    replyText: 'Our auto-reply subscription is 100% free with BYOK (Bring Your Own Key) support for Gemini, ChatGPT, Grok, and Meta AI!',
  },
  {
    id: 'rule_3',
    name: 'Main Menu',
    enabled: true,
    incomingPattern: 'menu',
    matchType: 'exact',
    replyType: 'menu',
    replyText: 'Welcome to PakAutoReply-2026! Select an option:\n1. Services\n2. Pricing\n3. Support\n4. Speak with Agent',
    options: [
      { key: '1', label: 'Services', reply: 'We offer automated WhatsApp, Telegram, and Messenger messaging solutions.' },
      { key: '2', label: 'Pricing', reply: 'Basic tier is completely free with your own AI Studio API key.' },
      { key: '3', label: 'Support', reply: 'Our support team is available at support@pakworld.pk' },
      { key: '4', label: 'Agent', reply: 'A live human representative has been notified and will contact you shortly.' },
    ],
  },
];

export class StorageService {
  /**
   * Load AI settings with backward compatibility checks
   */
  static loadAISettings(): AISettingsConfig {
    try {
      const savedConfig = localStorage.getItem(`${PREF_PREFIX}ai_config`);
      let config: AISettingsConfig = savedConfig ? JSON.parse(savedConfig) : { ...DEFAULT_AI_CONFIG };

      // Ensure all provider keys exist in case of migration
      config.apiKeys = { ...DEFAULT_AI_CONFIG.apiKeys, ...(config.apiKeys || {}) };
      config.selectedModels = { ...DEFAULT_AI_CONFIG.selectedModels, ...(config.selectedModels || {}) };
      config.parameters = { ...DEFAULT_AI_CONFIG.parameters, ...(config.parameters || {}) };

      // BACKWARD COMPATIBILITY: check legacy single preference keys if present
      const legacyGeminiKey = localStorage.getItem('gemini_api_key') || localStorage.getItem(`${PREF_PREFIX}gemini_api_key`);
      if (legacyGeminiKey && !config.apiKeys.gemini) {
        config.apiKeys.gemini = legacyGeminiKey;
      }

      const legacyGeminiModel = localStorage.getItem('gemini_model') || localStorage.getItem(`${PREF_PREFIX}gemini_model`);
      if (legacyGeminiModel && !config.selectedModels.gemini) {
        config.selectedModels.gemini = legacyGeminiModel;
      }

      // Check provider-specific individual preference keys
      const providers: ProviderId[] = ['gemini', 'openai', 'grok', 'meta', 'elevenlabs', 'lowlevel'];
      providers.forEach(p => {
        const individualKey = localStorage.getItem(`${PREF_PREFIX}${p}_api_key`);
        if (individualKey) config.apiKeys[p] = individualKey;

        const individualModel = localStorage.getItem(`${PREF_PREFIX}${p}_model`);
        if (individualModel) config.selectedModels[p] = individualModel;
      });

      return config;
    } catch (e) {
      console.error('Failed to load AI settings from storage, returning default', e);
      return { ...DEFAULT_AI_CONFIG };
    }
  }

  /**
   * Save AI settings and sync individual legacy keys
   */
  static saveAISettings(config: AISettingsConfig): void {
    try {
      localStorage.setItem(`${PREF_PREFIX}ai_config`, JSON.stringify(config));

      // Sync individual preference keys for strict Android SharedPreferences compatibility
      Object.entries(config.apiKeys).forEach(([provider, key]) => {
        if (key) {
          localStorage.setItem(`${PREF_PREFIX}${provider}_api_key`, key);
          if (provider === 'gemini') {
            // Keep legacy direct key alive
            localStorage.setItem('gemini_api_key', key);
          }
        } else {
          localStorage.removeItem(`${PREF_PREFIX}${provider}_api_key`);
          if (provider === 'gemini') localStorage.removeItem('gemini_api_key');
        }
      });

      Object.entries(config.selectedModels).forEach(([provider, model]) => {
        if (model) {
          localStorage.setItem(`${PREF_PREFIX}${provider}_model`, model);
          if (provider === 'gemini') localStorage.setItem('gemini_model', model);
        }
      });

      localStorage.setItem(`${PREF_PREFIX}selected_provider`, config.selectedProvider);
    } catch (e) {
      console.error('Failed to save AI settings to storage', e);
    }
  }

  /**
   * Load Rules
   */
  static loadRules(): ReplyRule[] {
    try {
      const data = localStorage.getItem(`${PREF_PREFIX}rules`);
      return data ? JSON.parse(data) : DEFAULT_RULES;
    } catch {
      return DEFAULT_RULES;
    }
  }

  /**
   * Save Rules
   */
  static saveRules(rules: ReplyRule[]): void {
    try {
      localStorage.setItem(`${PREF_PREFIX}rules`, JSON.stringify(rules));
    } catch (e) {
      console.error('Failed to save rules', e);
    }
  }

  /**
   * Blocked contacts
   */
  static loadBlockedContacts(): string[] {
    try {
      const data = localStorage.getItem(`${PREF_PREFIX}blocked_contacts`);
      return data ? JSON.parse(data) : ['+92 300 0000000', 'Spam Bot 1'];
    } catch {
      return [];
    }
  }

  static saveBlockedContacts(list: string[]): void {
    try {
      localStorage.setItem(`${PREF_PREFIX}blocked_contacts`, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save blocked contacts', e);
    }
  }
}
