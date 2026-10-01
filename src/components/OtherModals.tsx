import React, { useState } from 'react';
import { Sliders, Globe, GraduationCap, Settings as SettingsIcon, AlertCircle } from 'lucide-react';
import { AISettingsConfig, ProviderInfo, ProviderParameters } from '../types/ai';

interface TeachAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachAI: AISettingsConfig['teachAI'];
  onSave: (teachAI: AISettingsConfig['teachAI']) => void;
}

export const TeachAIModal: React.FC<TeachAIModalProps> = ({
  isOpen,
  onClose,
  teachAI,
  onSave,
}) => {
  const [formData, setFormData] = useState(teachAI);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2.5 bg-slate-900/90">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Teach AI</h3>
            <p className="text-xs text-slate-400">Configure bot personality, business context, and language</p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Bot Name</label>
              <input
                type="text"
                value={formData.botName}
                onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Auto-Detect (Urdu / English)">Auto-Detect (Urdu / English)</option>
                <option value="Urdu (اردو)">Urdu (اردو)</option>
                <option value="English">English</option>
                <option value="Roman Urdu">Roman Urdu</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Tone</label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="friendly">Friendly & Welcoming</option>
                <option value="professional">Professional & Formal</option>
                <option value="concise">Concise & Direct</option>
                <option value="humorous">Casual & Engaging</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">System Instructions</label>
            <textarea
              rows={3}
              value={formData.systemInstruction}
              onChange={(e) => setFormData({ ...formData, systemInstruction: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Always greet politely and reply within 2 sentences."
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Custom Guidelines & FAQ Prompt</label>
            <textarea
              rows={4}
              value={formData.customPrompt}
              onChange={(e) => setFormData({ ...formData, customPrompt: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. We are closed on Sundays. Delivery takes 2-3 business days across Pakistan."
            />
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">Cancel</button>
          <button
            onClick={() => { onSave(formData); onClose(); }}
            className="px-5 py-2 text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg shadow-md"
          >
            Save Instructions
          </button>
        </div>
      </div>
    </div>
  );
};

interface WebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteUrl: string;
  onSave: (url: string) => void;
}

export const WebsiteModal: React.FC<WebsiteModalProps> = ({
  isOpen,
  onClose,
  websiteUrl,
  onSave,
}) => {
  const [url, setUrl] = useState(websiteUrl);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2.5 bg-slate-900/90">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Website Setting</h3>
            <p className="text-xs text-slate-400">Contextual knowledge source for your AI replies</p>
          </div>
        </div>

        <div className="p-6 space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Company / Catalog URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://pakworld.pk"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              The AI engine references this website domain to answer questions about products, services, and policies accurately.
            </p>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">Cancel</button>
          <button
            onClick={() => { onSave(url); onClose(); }}
            className="px-5 py-2 text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg shadow-md"
          >
            Save Website
          </button>
        </div>
      </div>
    </div>
  );
};

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  generalSettings: AISettingsConfig['generalSettings'];
  onSave: (settings: AISettingsConfig['generalSettings']) => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({
  isOpen,
  onClose,
  generalSettings,
  onSave,
}) => {
  const [data, setData] = useState(generalSettings);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2.5 bg-slate-900/90">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            <SettingsIcon className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Settings</h3>
            <p className="text-xs text-slate-400">Response behavior and messaging rules</p>
          </div>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Reply Prefix</label>
            <input
              type="text"
              value={data.replyPrefix}
              onChange={(e) => setData({ ...data, replyPrefix: e.target.value })}
              placeholder="e.g. [AI Reply] "
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">Prepended to automated AI messages to inform recipient.</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Reply Delay: {data.replyDelaySeconds}s</label>
            <input
              type="range"
              min={0}
              max={15}
              value={data.replyDelaySeconds}
              onChange={(e) => setData({ ...data, replyDelaySeconds: parseInt(e.target.value, 10) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">Simulates natural typing delay before dispatching auto-reply.</p>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-300">Ignore Group Messages</span>
              <input
                type="checkbox"
                checked={data.ignoreGroupMessages}
                onChange={(e) => setData({ ...data, ignoreGroupMessages: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-300">Reply Unknown Numbers Only</span>
              <input
                type="checkbox"
                checked={data.replyUnknownContactsOnly}
                onChange={(e) => setData({ ...data, replyUnknownContactsOnly: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-300">Append Custom Signature</span>
              <input
                type="checkbox"
                checked={data.appendSignature}
                onChange={(e) => setData({ ...data, appendSignature: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>
          </div>

          {data.appendSignature && (
            <div>
              <input
                type="text"
                value={data.signatureText}
                onChange={(e) => setData({ ...data, signatureText: e.target.value })}
                placeholder="— Powered by PakAutoReply"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
              />
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">Cancel</button>
          <button
            onClick={() => { onSave(data); onClose(); }}
            className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-md"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

interface AIParametersModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ProviderInfo;
  parameters: ProviderParameters;
  onSave: (params: ProviderParameters) => void;
}

export const AIParametersModal: React.FC<AIParametersModalProps> = ({
  isOpen,
  onClose,
  provider,
  parameters,
  onSave,
}) => {
  const [params, setParams] = useState(parameters);

  if (!isOpen) return null;

  const supported = provider.supportedParameters;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2.5 bg-slate-900/90">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Parameters</h3>
            <p className="text-xs text-slate-400">{provider.displayName} Tuning</p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Temperature */}
          {supported.includes('temperature') && (
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Temperature (Creativity)</span>
                <span className="font-mono text-emerald-400">{params.temperature ?? 0.7}</span>
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={0.05}
                value={params.temperature ?? 0.7}
                onChange={(e) => setParams({ ...params, temperature: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>0.0 (Precise / Factual)</span>
                <span>2.0 (Creative)</span>
              </div>
            </div>
          )}

          {/* Top-P */}
          {supported.includes('topP') && (
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Top-P (Nucleus Sampling)</span>
                <span className="font-mono text-emerald-400">{params.topP ?? 0.95}</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={params.topP ?? 0.95}
                onChange={(e) => setParams({ ...params, topP: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          )}

          {/* Top-K (Gemini) */}
          {supported.includes('topK') && (
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Top-K Sampling (Gemini)</span>
                <span className="font-mono text-blue-400">{params.topK ?? 40}</span>
              </div>
              <input
                type="range"
                min={1}
                max={64}
                step={1}
                value={params.topK ?? 40}
                onChange={(e) => setParams({ ...params, topK: parseInt(e.target.value, 10) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          )}

          {/* Max Output Tokens */}
          {supported.includes('maxTokens') && (
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Max Output Tokens</span>
                <span className="font-mono text-emerald-400">{params.maxTokens ?? 800}</span>
              </div>
              <input
                type="range"
                min={50}
                max={4000}
                step={50}
                value={params.maxTokens ?? 800}
                onChange={(e) => setParams({ ...params, maxTokens: parseInt(e.target.value, 10) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          )}

          {/* ElevenLabs Stability & Similarity */}
          {supported.includes('stability') && (
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Voice Stability</span>
                <span className="font-mono text-amber-400">{params.stability ?? 0.5}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={params.stability ?? 0.5}
                onChange={(e) => setParams({ ...params, stability: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          )}

          {supported.includes('similarityBoost') && (
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Similarity Boost</span>
                <span className="font-mono text-amber-400">{params.similarityBoost ?? 0.75}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={params.similarityBoost ?? 0.75}
                onChange={(e) => setParams({ ...params, similarityBoost: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          )}

          {/* LowLevel / Local Endpoint */}
          {supported.includes('customEndpoint') && (
            <div>
              <label className="block font-semibold text-purple-300 mb-1">Local Model REST Endpoint (لو لیول)</label>
              <input
                type="text"
                value={params.customEndpoint ?? 'http://localhost:11434'}
                onChange={(e) => setParams({ ...params, customEndpoint: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">Ollama default: http://localhost:11434, LM Studio: http://localhost:1234/v1</p>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">Cancel</button>
          <button
            onClick={() => { onSave(params); onClose(); }}
            className="px-5 py-2 text-xs font-semibold bg-pink-500 hover:bg-pink-400 text-white font-bold rounded-lg shadow-md"
          >
            Save Parameters
          </button>
        </div>
      </div>
    </div>
  );
};
