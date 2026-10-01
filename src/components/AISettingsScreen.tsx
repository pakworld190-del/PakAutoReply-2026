import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Zap, 
  Layers, 
  Volume2, 
  Cpu, 
  Key, 
  Sliders, 
  GraduationCap, 
  Globe, 
  Settings, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';
import { AISettingsConfig, ProviderId, ProviderInfo, ModelInfo, ProviderParameters } from '../types/ai';
import { PROVIDERS_LIST, INITIAL_MODELS } from '../data/providers';
import { ProviderSelectorModal } from './ProviderSelectorModal';
import { ApiKeyModal } from './ApiKeyModal';
import { ModelSelectorModal } from './ModelSelectorModal';
import { TeachAIModal, WebsiteModal, AISettingsModal, AIParametersModal } from './OtherModals';

interface Props {
  config: AISettingsConfig;
  onUpdateConfig: (newConfig: AISettingsConfig) => void;
  onNavigateToTest: () => void;
}

export const AISettingsScreen: React.FC<Props> = ({
  config,
  onUpdateConfig,
  onNavigateToTest,
}) => {
  // Modal states
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isTeachAIModalOpen, setIsTeachAIModalOpen] = useState(false);
  const [isWebsiteModalOpen, setIsWebsiteModalOpen] = useState(false);
  const [isAISettingsModalOpen, setIsAISettingsModalOpen] = useState(false);
  const [isParametersModalOpen, setIsParametersModalOpen] = useState(false);

  // Active Provider and Model lookups
  const activeProvider: ProviderInfo = PROVIDERS_LIST.find((p) => p.id === config.selectedProvider) || PROVIDERS_LIST[0];
  const activeModels: ModelInfo[] = INITIAL_MODELS[config.selectedProvider] || [];
  const selectedModelId = config.selectedModels[config.selectedProvider] || activeProvider.defaultModel;
  const currentModel = activeModels.find((m) => m.id === selectedModelId) || activeModels[0];

  // Provider icon component helper
  const getProviderIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className={`${className} text-blue-400`} />;
      case 'Bot': return <Bot className={`${className} text-emerald-400`} />;
      case 'Zap': return <Zap className={`${className} text-amber-400`} />;
      case 'Layers': return <Layers className={`${className} text-cyan-400`} />;
      case 'Volume2': return <Volume2 className={`${className} text-orange-400`} />;
      case 'Cpu': return <Cpu className={`${className} text-purple-400`} />;
      default: return <Sparkles className={`${className} text-blue-400`} />;
    }
  };

  // Provider selection handler
  const handleSelectProvider = (newProviderId: ProviderId) => {
    const newConfig = {
      ...config,
      selectedProvider: newProviderId,
    };
    onUpdateConfig(newConfig);
  };

  // API Key save handler
  const handleSaveApiKey = (newKey: string) => {
    const newConfig: AISettingsConfig = {
      ...config,
      apiKeys: {
        ...config.apiKeys,
        [config.selectedProvider]: newKey,
      },
    };
    onUpdateConfig(newConfig);
  };

  // Model selection handler
  const handleSelectModel = (modelId: string) => {
    const newConfig: AISettingsConfig = {
      ...config,
      selectedModels: {
        ...config.selectedModels,
        [config.selectedProvider]: modelId,
      },
    };
    onUpdateConfig(newConfig);
  };

  // Parameters save handler
  const handleSaveParameters = (params: ProviderParameters) => {
    const newConfig: AISettingsConfig = {
      ...config,
      parameters: {
        ...config.parameters,
        [config.selectedProvider]: params,
      },
    };
    onUpdateConfig(newConfig);
  };

  // Current API key status
  const currentKey = config.apiKeys[config.selectedProvider] || '';
  const hasKey = Boolean(currentKey.trim());
  const maskedKey = hasKey
    ? `${currentKey.slice(0, 6)}••••••••${currentKey.slice(-4)}`
    : 'Add an API key to use AI replies.';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ========================================================
          1. PROVIDER HERO CARD (Dynamic based on selected provider)
          ======================================================== */}
      <div className={`relative overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-850 via-slate-900 to-slate-950 p-6 md:p-8 shadow-2xl`}>
        {/* Ambient background glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md">
                {getProviderIcon(activeProvider.iconName, 'w-7 h-7')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {activeProvider.displayName}
                  </h2>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${activeProvider.badgeBg}`}>
                    {activeProvider.badgeText}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-400">
                  Powered by <span className="text-slate-200">{activeProvider.poweredBy}</span>
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeProvider.tagline}
            </p>

            {/* Quick status chips */}
            <div className="flex items-center gap-2.5 flex-wrap pt-1 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>Active Model: <strong className="text-white font-mono">{currentModel?.displayName || selectedModelId}</strong></span>
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border ${
                hasKey 
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
              }`}>
                {hasKey ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                <span>API Key: <strong>{hasKey ? 'Configured' : 'Missing'}</strong></span>
              </div>

              {currentModel?.pricingTier && (
                <div className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300">
                  <span>Tier: <strong className="text-emerald-400">{currentModel.pricingTier}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setIsProviderModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 text-center"
            >
              Switch Provider
            </button>

            <button
              onClick={onNavigateToTest}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test Auto-Reply</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. CORE PROVIDER SECTIONS (WhatsAuto Reference Style)
          ======================================================== */}
      <div className="bg-slate-850 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">AI Reply Configuration</h3>
            <p className="text-xs text-slate-400">Settings automatically switch to the currently active provider</p>
          </div>
          <span className="text-xs font-mono text-slate-500">com.pakworld.pakautoreply</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: AI Provider Selector */}
          <div
            onClick={() => setIsProviderModalOpen(true)}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700/80 group-hover:border-emerald-500/40 transition-colors">
                {getProviderIcon(activeProvider.iconName)}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  AI Provider
                </span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate block">
                  {activeProvider.displayName}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  {activeProvider.poweredBy}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          {/* Card 2: API Key Configuration */}
          <div
            onClick={() => setIsApiKeyModalOpen(true)}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700/80 group-hover:border-emerald-500/40 transition-colors">
                <Key className="w-6 h-6 text-amber-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  API Key
                </span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate block">
                  {activeProvider.displayName} API Key
                </span>
                <span className={`text-[11px] font-mono block truncate ${hasKey ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {maskedKey}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          {/* Card 3: AI Model Selector */}
          <div
            onClick={() => setIsModelModalOpen(true)}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700/80 group-hover:border-emerald-500/40 transition-colors">
                <Cpu className="w-6 h-6 text-blue-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  AI Model
                </span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate block">
                  {currentModel?.displayName || selectedModelId}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-semibold">
                    {currentModel?.pricingTier || 'AVAILABLE'}
                  </span>
                  {currentModel?.speedLabel && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700 font-medium">
                      {currentModel.speedLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          {/* Card 4: AI Parameters */}
          <div
            onClick={() => setIsParametersModalOpen(true)}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700/80 group-hover:border-emerald-500/40 transition-colors">
                <Sliders className="w-6 h-6 text-pink-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  AI Parameters
                </span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate block">
                  Temperature, Top-P, Tokens
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  Tuned for {activeProvider.displayName}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </div>

        {/* ========================================================
            3. AI INSTRUCTIONS & SETTINGS
            ======================================================== */}
        <div className="pt-2 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            AI Persona & Business Rules
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Teach AI */}
            <div
              onClick={() => setIsTeachAIModalOpen(true)}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors block">
                  Teach AI
                </span>
                <span className="text-[11px] text-slate-400 truncate block">
                  {config.teachAI.botName} • {config.teachAI.tone}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
            </div>

            {/* Website Setting */}
            <div
              onClick={() => setIsWebsiteModalOpen(true)}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/50 hover:bg-slate-900 transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors block">
                  Website Knowledge
                </span>
                <span className="text-[11px] text-slate-400 truncate block">
                  {config.websiteUrl || 'Set URL'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors shrink-0" />
            </div>

            {/* General AI Settings */}
            <div
              onClick={() => setIsAISettingsModalOpen(true)}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Settings className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors block">
                  AI Settings
                </span>
                <span className="text-[11px] text-slate-400 truncate block">
                  Delay {config.generalSettings.replyDelaySeconds}s • Prefix: {config.generalSettings.replyPrefix || 'None'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. MODALS
          ======================================================== */}
      <ProviderSelectorModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        selectedProviderId={config.selectedProvider}
        onSelectProvider={handleSelectProvider}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        provider={activeProvider}
        currentApiKey={currentKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <ModelSelectorModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        provider={activeProvider}
        models={activeModels}
        selectedModelId={selectedModelId}
        onSelectModel={handleSelectModel}
        onRefreshModels={() => {
          // Model discovery simulation / refresh
        }}
      />

      <TeachAIModal
        isOpen={isTeachAIModalOpen}
        onClose={() => setIsTeachAIModalOpen(false)}
        teachAI={config.teachAI}
        onSave={(newTeachAI) => onUpdateConfig({ ...config, teachAI: newTeachAI })}
      />

      <WebsiteModal
        isOpen={isWebsiteModalOpen}
        onClose={() => setIsWebsiteModalOpen(false)}
        websiteUrl={config.websiteUrl}
        onSave={(url) => onUpdateConfig({ ...config, websiteUrl: url })}
      />

      <AISettingsModal
        isOpen={isAISettingsModalOpen}
        onClose={() => setIsAISettingsModalOpen(false)}
        generalSettings={config.generalSettings}
        onSave={(settings) => onUpdateConfig({ ...config, generalSettings: settings })}
      />

      <AIParametersModal
        isOpen={isParametersModalOpen}
        onClose={() => setIsParametersModalOpen(false)}
        provider={activeProvider}
        parameters={config.parameters[config.selectedProvider] || {}}
        onSave={handleSaveParameters}
      />
    </div>
  );
};
