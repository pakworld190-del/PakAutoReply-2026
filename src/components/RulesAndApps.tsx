import React, { useState } from 'react';
import { ListFilter, Plus, Trash2, CheckCircle2, Shield, MessageCircle, Send, Check } from 'lucide-react';
import { ReplyRule } from '../types/ai';

interface RulesManagerProps {
  rules: ReplyRule[];
  onSaveRules: (rules: ReplyRule[]) => void;
}

export const RulesManager: React.FC<RulesManagerProps> = ({ rules, onSaveRules }) => {
  const [activeTab, setActiveTab] = useState<'custom' | 'keyword' | 'menu'>('custom');
  const [newPattern, setNewPattern] = useState('');
  const [newReply, setNewReply] = useState('');
  const [newRuleName, setNewRuleName] = useState('');

  const currentRules = rules.filter((r) => r.replyType === activeTab);

  const handleToggle = (id: string) => {
    onSaveRules(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const handleDelete = (id: string) => {
    onSaveRules(rules.filter((r) => r.id !== id));
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPattern.trim() || !newReply.trim()) return;

    const newRule: ReplyRule = {
      id: `rule_${Date.now()}`,
      name: newRuleName.trim() || `${activeTab.toUpperCase()} Rule`,
      enabled: true,
      incomingPattern: newPattern.trim(),
      matchType: activeTab === 'menu' ? 'exact' : 'contains',
      replyType: activeTab,
      replyText: newReply.trim(),
    };

    onSaveRules([...rules, newRule]);
    setNewPattern('');
    setNewReply('');
    setNewRuleName('');
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'custom'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Priority 1: Custom Reply ({rules.filter((r) => r.replyType === 'custom').length})
        </button>
        <button
          onClick={() => setActiveTab('keyword')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'keyword'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Priority 2: Keyword Reply ({rules.filter((r) => r.replyType === 'keyword').length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'menu'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Priority 3: Menu Reply ({rules.filter((r) => r.replyType === 'menu').length})
        </button>
      </div>

      {/* Rules List & Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          {currentRules.length === 0 ? (
            <div className="p-8 bg-slate-850 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
              No {activeTab} rules configured yet. Create one on the right.
            </div>
          ) : (
            currentRules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 bg-slate-850 border border-slate-800 rounded-2xl flex items-start justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{rule.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      Match: {rule.matchType} "{rule.incomingPattern}"
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 whitespace-pre-wrap">
                    {rule.replyText}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <button
                    onClick={() => handleToggle(rule.id)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                      rule.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Rule Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleAddRule} className="p-5 bg-slate-850 border border-slate-800 rounded-2xl space-y-3.5 shadow-lg">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Add New {activeTab.toUpperCase()} Rule
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Rule Name</label>
              <input
                type="text"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="e.g. Inquire Return Policy"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Incoming Trigger Text</label>
              <input
                type="text"
                required
                value={newPattern}
                onChange={(e) => setNewPattern(e.target.value)}
                placeholder="e.g. return"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Automated Reply Text</label>
              <textarea
                rows={3}
                required
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Enter exact message to send back..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20"
            >
              Save Rule
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface SupportedAppsProps {
  blockedContacts: string[];
  onSaveBlocked: (list: string[]) => void;
}

export const SupportedAppsManager: React.FC<SupportedAppsProps> = ({
  blockedContacts,
  onSaveBlocked,
}) => {
  const [apps, setApps] = useState([
    { id: 'wa', name: 'WhatsApp', enabled: true, icon: '🟢', pkg: 'com.whatsapp' },
    { id: 'w4b', name: 'WhatsApp Business', enabled: true, icon: '💼', pkg: 'com.whatsapp.w4b' },
    { id: 'tg', name: 'Telegram', enabled: true, icon: '✈️', pkg: 'org.telegram.messenger' },
    { id: 'fb', name: 'Messenger', enabled: true, icon: '💬', pkg: 'com.facebook.orca' },
    { id: 'ig', name: 'Instagram Direct', enabled: false, icon: '📷', pkg: 'com.instagram.android' },
    { id: 'sig', name: 'Signal', enabled: false, icon: '🔒', pkg: 'org.thoughtcrime.securesms' },
  ]);

  const [newBlocked, setNewBlocked] = useState('');

  const toggleApp = (id: string) => {
    setApps(apps.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  };

  const handleAddBlocked = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlocked.trim()) return;
    onSaveBlocked([...blockedContacts, newBlocked.trim()]);
    setNewBlocked('');
  };

  const removeBlocked = (num: string) => {
    onSaveBlocked(blockedContacts.filter((b) => b !== num));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Supported Apps */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Supported Messaging Applications</h3>
            <span className="text-xs text-emerald-400">Android Notification Listener</span>
          </div>

          <div className="space-y-2.5">
            {apps.map((app) => (
              <div
                key={app.id}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{app.icon}</span>
                  <div>
                    <span className="font-semibold text-xs text-white">{app.name}</span>
                    <p className="text-[10px] text-slate-500 font-mono">{app.pkg}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleApp(app.id)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                    app.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Blocked Contacts */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Blocked Numbers List</h3>
            </div>
            <span className="text-xs text-slate-400">{blockedContacts.length} Blocked</span>
          </div>

          <form onSubmit={handleAddBlocked} className="flex gap-2">
            <input
              type="text"
              value={newBlocked}
              onChange={(e) => setNewBlocked(e.target.value)}
              placeholder="e.g. +92 300 1234567"
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-500/20"
            >
              Block
            </button>
          </form>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pt-2">
            {blockedContacts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No numbers blocked.</p>
            ) : (
              blockedContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono text-slate-300"
                >
                  <span>{contact}</span>
                  <button
                    onClick={() => removeBlocked(contact)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
