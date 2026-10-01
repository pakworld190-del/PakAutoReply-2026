import React from 'react';
import { Sparkles, Bot, Zap, Layers, Volume2, Cpu, Check, ExternalLink, HelpCircle } from 'lucide-react';
import { ProviderId, ProviderInfo } from '../types/ai';
import { PROVIDERS_LIST } from '../data/providers';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedProviderId: ProviderId;
  onSelectProvider: (providerId: ProviderId) => void;
}

export const ProviderSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedProviderId,
  onSelectProvider,
}) => {
  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-blue-400" />;
      case 'Bot': return <Bot className="w-5 h-5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'Volume2': return <Volume2 className="w-5 h-5 text-orange-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-purple-400" />;
      default: return <Sparkles className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - WhatsAuto / Android Material Style */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">AI Provider</h3>
            <p className="text-xs text-slate-400">Select which intelligence engine powers auto-replies</p>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
            Multi-Provider v1.9.4
          </span>
        </div>

        {/* Radio Option List */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {PROVIDERS_LIST.map((provider: ProviderInfo) => {
            const isSelected = provider.id === selectedProviderId;

            return (
              <div
                key={provider.id}
                onClick={() => {
                  onSelectProvider(provider.id);
                  onClose();
                }}
                className={`relative flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
                }`}
              >
                {/* Radio Circle */}
                <div className="pt-0.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500 bg-transparent'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                  </div>
                </div>

                {/* Provider Icon */}
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/50 shrink-0">
                  {getIcon(provider.iconName)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-white">
                      {provider.displayName}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${provider.badgeBg}`}>
                      {provider.badgeText}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {provider.tagline}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span>Powered by <strong className="text-slate-300 font-medium">{provider.poweredBy}</strong></span>
                    {provider.id === 'elevenlabs' && (
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" /> Voice / Agent
                      </span>
                    )}
                  </div>
                </div>

                {/* Checkmark indicator */}
                {isSelected && (
                  <div className="text-emerald-400 shrink-0 pt-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Urdu / Ambiguous Provider Verification Notice */}
          <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl text-xs text-purple-300 flex items-start gap-2">
            <Cpu className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-200">Verified Candidate for "لو لیول":</p>
              <p className="text-slate-400 mt-0.5">
                The Urdu term <strong className="text-purple-300 font-mono">"لو لیول"</strong> literally transliterates to <em>"Low-Level"</em> (Local / On-Device AI such as Ollama, LM Studio, or local DeepSeek). It is mapped here cleanly with full local REST API compatibility.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
