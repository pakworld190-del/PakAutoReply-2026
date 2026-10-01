/**
 * ReplyEngine Service
 * Orchestrates incoming message dispatch following strict priority order:
 * 1. Custom Reply
 * 2. Keyword Reply
 * 3. Menu Reply
 * 4. AI Provider Fallback (Gemini, OpenAI, Grok, Meta, Local)
 */

import { AISettingsConfig, ReplyRule, ReplyEngineResult } from '../types/ai';
import { ProviderAdapterFactory } from './apiAdapters';
import { PROVIDERS_LIST } from '../data/providers';

export class ReplyEngine {
  /**
   * Process an incoming message through the auto-reply rule pipeline
   */
  static async processMessage(
    incomingMessage: string,
    sender: string,
    isGroup: boolean,
    config: AISettingsConfig,
    rules: ReplyRule[],
    blockedList: string[]
  ): Promise<ReplyEngineResult> {
    const startTime = Date.now();
    const cleanMsg = (incomingMessage || '').trim();

    // 0. Blocked Numbers Check
    if (blockedList.some(b => sender.toLowerCase().includes(b.toLowerCase()))) {
      return {
        replyText: '',
        matchedRuleType: 'blocked',
        executionTimeMs: Date.now() - startTime,
        error: `Sender ${sender} is in the blocked numbers list. No reply dispatched.`,
      };
    }

    // 0.1 General Settings Filter: Ignore Group Messages
    if (isGroup && config.generalSettings.ignoreGroupMessages) {
      return {
        replyText: '',
        matchedRuleType: 'disabled',
        executionTimeMs: Date.now() - startTime,
        error: 'Group message ignored as per general AI settings.',
      };
    }

    // PRIORITY 1: Custom Reply Rules
    const customRules = rules.filter(r => r.enabled && r.replyType === 'custom');
    for (const rule of customRules) {
      if (this.isPatternMatch(cleanMsg, rule.incomingPattern, rule.matchType)) {
        return {
          replyText: this.formatReply(rule.replyText, config),
          matchedRuleType: 'custom',
          matchedRuleName: rule.name,
          executionTimeMs: Date.now() - startTime,
        };
      }
    }

    // PRIORITY 2: Keyword Reply Rules
    const keywordRules = rules.filter(r => r.enabled && r.replyType === 'keyword');
    for (const rule of keywordRules) {
      if (this.isPatternMatch(cleanMsg, rule.incomingPattern, rule.matchType)) {
        return {
          replyText: this.formatReply(rule.replyText, config),
          matchedRuleType: 'keyword',
          matchedRuleName: rule.name,
          executionTimeMs: Date.now() - startTime,
        };
      }
    }

    // PRIORITY 3: Menu Reply Rules
    const menuRules = rules.filter(r => r.enabled && r.replyType === 'menu');
    for (const rule of menuRules) {
      // Check if triggering the menu
      if (this.isPatternMatch(cleanMsg, rule.incomingPattern, rule.matchType)) {
        return {
          replyText: this.formatReply(rule.replyText, config),
          matchedRuleType: 'menu',
          matchedRuleName: rule.name,
          executionTimeMs: Date.now() - startTime,
        };
      }

      // Check if answering an option in the menu (e.g., '1', '2', etc.)
      if (rule.options && rule.options.length > 0) {
        const selectedOption = rule.options.find(
          opt => cleanMsg.toLowerCase() === opt.key.toLowerCase() ||
                 cleanMsg.toLowerCase() === opt.label.toLowerCase()
        );
        if (selectedOption) {
          return {
            replyText: this.formatReply(selectedOption.reply, config),
            matchedRuleType: 'menu',
            matchedRuleName: `${rule.name} (Option ${selectedOption.key})`,
            executionTimeMs: Date.now() - startTime,
          };
        }
      }
    }

    // PRIORITY 4: AI Provider Fallback
    if (!config.aiReplyEnabled) {
      return {
        replyText: '',
        matchedRuleType: 'disabled',
        executionTimeMs: Date.now() - startTime,
        error: 'AI Auto-Reply is disabled in settings.',
      };
    }

    const providerId = config.selectedProvider;
    const providerMeta = PROVIDERS_LIST.find(p => p.id === providerId);
    const apiKey = config.apiKeys[providerId] || '';
    const modelId = config.selectedModels[providerId] || providerMeta?.defaultModel || '';
    const params = config.parameters[providerId] || {};

    // Validate capability: e.g. ElevenLabs is audio-only
    if (!providerMeta?.textReplyCapable) {
      return {
        replyText: providerMeta?.capabilityRestrictionNotice || 'Selected provider does not support text auto-replies.',
        matchedRuleType: 'ai_fallback',
        providerUsed: providerId,
        modelUsed: modelId,
        executionTimeMs: Date.now() - startTime,
        error: 'PROVIDER_CAPABILITY_RESTRICTION',
      };
    }

    // Get adapter and generate response
    const adapter = ProviderAdapterFactory.getAdapter(providerId);

    // Build comprehensive system instruction including bot persona and website context
    const fullInstruction = [
      config.teachAI.systemInstruction,
      config.teachAI.customPrompt ? `Business Guidelines: ${config.teachAI.customPrompt}` : '',
      config.websiteUrl ? `Company Knowledge URL: ${config.websiteUrl}` : '',
      `Persona: ${config.teachAI.botName} representing ${config.teachAI.businessName}. Tone: ${config.teachAI.tone}.`,
      `Language Preference: ${config.teachAI.language}.`,
    ].filter(Boolean).join('\n\n');

    const result = await adapter.generateReply(cleanMsg, apiKey, modelId, fullInstruction, params);

    return {
      replyText: this.formatReply(result.reply, config, true),
      matchedRuleType: 'ai_fallback',
      providerUsed: providerId,
      modelUsed: modelId,
      executionTimeMs: Date.now() - startTime,
      error: result.error,
    };
  }

  /**
   * Helper pattern matcher
   */
  private static isPatternMatch(
    incoming: string,
    pattern: string,
    matchType: 'exact' | 'contains' | 'starts_with' | 'regex'
  ): boolean {
    const inc = incoming.toLowerCase();
    const pat = pattern.toLowerCase();

    switch (matchType) {
      case 'exact':
        return inc === pat;
      case 'contains':
        return inc.includes(pat);
      case 'starts_with':
        return inc.startsWith(pat);
      case 'regex':
        try {
          return new RegExp(pattern, 'i').test(incoming);
        } catch {
          return inc.includes(pat);
        }
      default:
        return inc.includes(pat);
    }
  }

  /**
   * Format final reply with optional prefix and signature
   */
  private static formatReply(text: string, config: AISettingsConfig, isAI = false): string {
    let output = text;
    if (isAI && config.generalSettings.replyPrefix) {
      output = `${config.generalSettings.replyPrefix}${output}`;
    }
    if (config.generalSettings.appendSignature && config.generalSettings.signatureText) {
      output = `${output}\n\n${config.generalSettings.signatureText}`;
    }
    return output;
  }
}
