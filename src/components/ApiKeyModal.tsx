import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, ExternalLink, CheckCircle2, AlertCircle, Loader2, Trash2, Clipboard } from 'lucide-react';
import { ProviderInfo } from '../types/ai';
import { ProviderAdapterFactory } from '../services/apiAdapters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  provider: ProviderInfo;
  currentApiKey: string;
  onSaveApiKey: (newKey: string) => void;
}

export const ApiKeyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  provider,
  currentApiKey,
  onSaveApiKey,
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(currentApiKey || '');
      setShowKey(false);
      setTestResult(null);
    }
  }, [isOpen, currentApiKey]);

  if (!isOpen) return null;

  const handleGetApiKey = () => {
    try {
      window.open(provider.apiKeyUrl, '_blank', 'noopener,noreferrer');
    } catch {
      alert(`Please open your browser to get an API key: ${provider.apiKeyUrl}`);
    }
  };

  const handleTestApiKey = async () => {
    if (!keyInput.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter an API key to test.',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const adapter = ProviderAdapterFactory.getAdapter(provider.id);
    const result = await adapter.testApiKey(keyInput.trim());
    setTesting(false);
    setTestResult(result);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setKeyInput(text.trim());
    } catch {
      // ignore
    }
  };

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    onClose();
  };

  const handleClear = () => {
    setKeyInput('');
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">API Key</h3>
              <p className="text-xs text-slate-400">{provider.displayName} Configuration</p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {provider.id}_api_key
          </span>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {provider.displayName} API Key
            </label>
            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => {
                  setKeyInput(e.target.value);
                  setTestResult(null);
                }}
                placeholder={provider.apiKeyPlaceholder}
                className="w-full pl-3.5 pr-24 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                  title={showKey ? 'Hide Key' : 'Show Key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {keyInput && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 text-rose-400 hover:text-rose-300 transition-colors"
                    title="Clear Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {!keyInput && (
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              {provider.apiKeyHelpText}
            </p>
          </div>

          {/* GET API KEY Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleGetApiKey}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-750 active:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold text-emerald-400 transition-all shadow-sm"
            >
              <span>GET API KEY</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-1">
              Opens official {provider.poweredBy} console
            </p>
          </div>

          {/* TEST API KEY Button & Status */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleTestApiKey}
                disabled={testing}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>TEST API KEY</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-slate-500">
                Safe connection test
              </span>
            </div>

            {testResult && (
              <div className={`mt-2.5 p-3 rounded-xl border text-xs flex items-start gap-2 animate-in fade-in duration-100 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{testResult.message}</p>
                  {testResult.details && (
                    <p className="text-[11px] opacity-80 mt-0.5">{testResult.details}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 rounded-lg transition-all shadow-md shadow-emerald-500/20"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};
