import React, { useState, useMemo } from 'react';
import { Cpu, Search, RefreshCw, Sparkles, Check, AlertTriangle, Info } from 'lucide-react';
import { ModelInfo, ProviderInfo } from '../types/ai';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  provider: ProviderInfo;
  models: ModelInfo[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  onRefreshModels: () => void;
}

export const ModelSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  provider,
  models,
  selectedModelId,
  onSelectModel,
  onRefreshModels,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'recommended' | 'fast' | 'best_quality' | 'free'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered models
  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      const matchesSearch = 
        m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'recommended') return m.recommended;
      if (activeFilter === 'fast') return m.speedLabel === 'FAST';
      if (activeFilter === 'best_quality') return m.qualityLabel === 'BEST QUALITY';
      if (activeFilter === 'free') return m.pricingTier === 'FREE' || m.pricingTier === 'FREE TIER' || m.freeTierEligible;

      return true;
    });
  }, [models, searchQuery, activeFilter]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      onRefreshModels();
      setIsRefreshing(false);
    }, 600);
  };

  const getBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'FREE':
      case 'FREE TIER':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'PAID':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'AVAILABILITY VARIES':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Model</h3>
              <p className="text-xs text-slate-400">{provider.displayName} Catalog</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors disabled:opacity-50"
            title="Refresh models from provider discovery API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search bar & filter pills */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search models..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              All Models ({models.length})
            </button>
            <button
              onClick={() => setActiveFilter('recommended')}
              className={`px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
                activeFilter === 'recommended'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setActiveFilter('fast')}
              className={`px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
                activeFilter === 'fast'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              Fast
            </button>
            <button
              onClick={() => setActiveFilter('best_quality')}
              className={`px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
                activeFilter === 'best_quality'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              Best Quality
            </button>
            <button
              onClick={() => setActiveFilter('free')}
              className={`px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
                activeFilter === 'free'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              Free / Free Tier
            </button>
          </div>
        </div>

        {/* ElevenLabs audio-only restriction banner */}
        {provider.id === 'elevenlabs' && (
          <div className="mx-4 mt-3 p-3 bg-amber-950/40 border border-amber-600/40 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Voice Platform Capability Notice:</p>
              <p className="text-amber-200/80 mt-0.5">
                ElevenLabs provides voice synthesis, audio, and voice conversational agents. Plain text chat auto-replies cannot route through audio models.
              </p>
            </div>
          </div>
        )}

        {/* Model rows */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredModels.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No models found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                className="mt-2 text-emerald-400 underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredModels.map((model) => {
              const isSelected = model.id === selectedModelId;

              return (
                <div
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
                  }`}
                >
                  {/* Radio button */}
                  <div className="pt-1">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500 bg-transparent'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                    </div>
                  </div>

                  {/* Model Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-white">
                        {model.displayName}
                      </span>

                      {/* Pricing Tag */}
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getBadgeStyle(model.pricingTier)}`}>
                        {model.pricingTier}
                      </span>

                      {/* Attribute Badges */}
                      {model.recommended && (
                        <span className="text-[10px] px-2 py-0.5 rounded border font-semibold bg-emerald-500/15 text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> RECOMMENDED
                        </span>
                      )}

                      {model.speedLabel && (
                        <span className="text-[10px] px-2 py-0.5 rounded border font-medium bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {model.speedLabel}
                        </span>
                      )}

                      {model.qualityLabel && model.qualityLabel !== 'RECOMMENDED' && (
                        <span className="text-[10px] px-2 py-0.5 rounded border font-medium bg-purple-500/10 text-purple-400 border-purple-500/20">
                          {model.qualityLabel}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      {model.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-mono">
                      <span>ID: {model.id}</span>
                      {model.contextWindow && <span>• {model.contextWindow}</span>}
                    </div>

                    {model.capabilityNote && (
                      <p className="mt-1.5 text-[11px] text-amber-300 font-medium">
                        ⚠️ {model.capabilityNote}
                      </p>
                    )}
                  </div>

                  {/* Checkmark */}
                  {isSelected && (
                    <div className="text-emerald-400 shrink-0 pt-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Selected: <strong className="text-emerald-400 font-mono">{selectedModelId}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
