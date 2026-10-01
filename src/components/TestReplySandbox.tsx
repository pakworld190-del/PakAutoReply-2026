import React, { useState } from 'react';
import { Send, Smartphone, ShieldAlert, Cpu, CheckCircle2, ArrowRight, MessageSquare, Bell, RotateCcw, AlertTriangle } from 'lucide-react';
import { AISettingsConfig, ReplyRule, ReplyEngineResult } from '../types/ai';
import { ReplyEngine } from '../services/replyEngine';
import { PROVIDERS_LIST } from '../data/providers';

interface Props {
  config: AISettingsConfig;
  rules: ReplyRule[];
  blockedContacts: string[];
  onOpenAISettings: () => void;
}

export const TestReplySandbox: React.FC<Props> = ({
  config,
  rules,
  blockedContacts,
  onOpenAISettings,
}) => {
  const [incomingMsg, setIncomingMsg] = useState('Hello! What are your business services and pricing?');
  const [senderNumber, setSenderNumber] = useState('+92 301 5550123');
  const [isGroup, setIsGroup] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ReplyEngineResult | null>(null);
  const [notificationBanner, setNotificationBanner] = useState<{ sender: string; message: string; reply?: string } | null>(null);

  const activeProvider = PROVIDERS_LIST.find((p) => p.id === config.selectedProvider) || PROVIDERS_LIST[0];

  const handleTest = async () => {
    if (!incomingMsg.trim()) return;

    setProcessing(true);
    setResult(null);

    const res = await ReplyEngine.processMessage(
      incomingMsg,
      senderNumber,
      isGroup,
      config,
      rules,
      blockedContacts
    );

    setProcessing(false);
    setResult(res);

    // Also trigger notification banner simulation
    setNotificationBanner({
      sender: senderNumber,
      message: incomingMsg,
      reply: res.replyText || (res.error ? `[Failed]: ${res.error}` : undefined),
    });
  };

  const sampleMessages = [
    { label: 'Keyword Test: price', text: 'What is the price of your service?' },
    { label: 'Custom Test: timing', text: 'Can you tell me your office timing?' },
    { label: 'Menu Test: menu', text: 'menu' },
    { label: 'AI Fallback: General inquiry', text: 'Do you offer customized software for local pharmacies in Lahore?' },
  ];

  return (
    <div className="space-y-6">
      {/* Simulation WhatsApp Notification Pop-up */}
      {notificationBanner && (
        <div className="p-4 bg-slate-800/95 border border-emerald-500/40 rounded-2xl shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">WhatsApp Notification</span>
                <span className="text-[10px] text-slate-400 font-mono">{notificationBanner.sender}</span>
              </div>
              <p className="text-xs font-semibold text-white mt-0.5">"{notificationBanner.message}"</p>
              {notificationBanner.reply ? (
                <div className="mt-2 p-2 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono whitespace-pre-wrap">
                  <span className="text-[10px] text-emerald-400 font-sans font-bold uppercase tracking-wider block mb-0.5">
                    PakAutoReply Auto-Sent:
                  </span>
                  {notificationBanner.reply}
                </div>
              ) : (
                <p className="text-[11px] text-amber-400 mt-1">No reply sent (filter applied / blocked).</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setNotificationBanner(null)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-700/50 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Simulator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Incoming Message Simulator</h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                ReplyEngine Test
              </span>
            </div>

            {/* Sender and Group Controls */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Sender Mobile / ID</label>
                <input
                  type="text"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Message Origin</label>
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setIsGroup(false)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      !isGroup
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    Direct Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsGroup(true)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      isGroup
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    Group Chat
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Quick Sample Inquiries
              </label>
              <div className="flex flex-wrap gap-1.5">
                {sampleMessages.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setIncomingMsg(sample.text)}
                    className="px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-lg transition-colors text-left"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Incoming Message Textarea */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1 text-xs">
                Incoming Message Body
              </label>
              <textarea
                rows={3}
                value={incomingMsg}
                onChange={(e) => setIncomingMsg(e.target.value)}
                placeholder="Type incoming WhatsApp message..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Dispatch Button */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>Active AI:</span>
                <span className="font-semibold text-emerald-400">{activeProvider.displayName}</span>
                <span className="font-mono text-[10px] text-slate-500">({config.selectedModels[config.selectedProvider]})</span>
              </div>

              <button
                type="button"
                onClick={handleTest}
                disabled={processing}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Run ReplyEngine</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Pipeline & Result */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">ReplyEngine Evaluation Pipeline</h3>
              <span className="text-[11px] text-slate-400">Strict Priority Hierarchy</span>
            </div>

            {/* Pipeline Stage Visualizer */}
            <div className="space-y-2 text-xs">
              {/* Step 1: Blocked check */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                result?.matchedRuleType === 'blocked'
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 font-semibold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">0</span>
                  <span>Blocked Numbers Filter</span>
                </div>
                {result?.matchedRuleType === 'blocked' ? (
                  <span className="text-[11px] text-rose-400 flex items-center gap-1 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" /> Blocked!
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Passed</span>
                )}
              </div>

              {/* Step 2: Custom Reply */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                result?.matchedRuleType === 'custom'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Priority 1: Custom Reply Rules</span>
                </div>
                {result?.matchedRuleType === 'custom' ? (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> MATCHED ({result.matchedRuleName})
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">No match</span>
                )}
              </div>

              {/* Step 3: Keyword Reply */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                result?.matchedRuleType === 'keyword'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Priority 2: Keyword Reply Rules</span>
                </div>
                {result?.matchedRuleType === 'keyword' ? (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> MATCHED ({result.matchedRuleName})
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">No match</span>
                )}
              </div>

              {/* Step 4: Menu Reply */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                result?.matchedRuleType === 'menu'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Priority 3: Menu Reply System</span>
                </div>
                {result?.matchedRuleType === 'menu' ? (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> MATCHED ({result.matchedRuleName})
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">No match</span>
                )}
              </div>

              {/* Step 5: AI Provider Fallback */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                result?.matchedRuleType === 'ai_fallback'
                  ? 'bg-blue-950/40 border-blue-500/50 text-blue-300 font-semibold shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">4</span>
                  <span>Priority 4: AI Provider Fallback</span>
                </div>
                {result?.matchedRuleType === 'ai_fallback' ? (
                  <span className="text-[11px] text-blue-400 font-bold flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" /> TRIGGERED ({result.providerUsed})
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Standby</span>
                )}
              </div>
            </div>

            {/* Result Box */}
            {result ? (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Dispatched Auto-Reply:</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Time: {result.executionTimeMs}ms
                  </span>
                </div>

                {result.replyText ? (
                  <div className="p-3.5 bg-slate-900 border border-emerald-500/30 rounded-xl text-xs text-white font-mono whitespace-pre-wrap leading-relaxed">
                    {result.replyText}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{result.error || 'No reply sent according to configuration rules.'}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                Click "Run ReplyEngine" to simulate incoming message handling.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
