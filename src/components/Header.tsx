import React from 'react';
import { Power, Sparkles, MessageSquare, ListFilter, Smartphone, Terminal, Download, Upload, Shield } from 'lucide-react';
import { AISettingsConfig } from '../types/ai';

interface Props {
  activeTab: 'ai' | 'test' | 'rules' | 'apps' | 'aide';
  onSelectTab: (tab: 'ai' | 'test' | 'rules' | 'apps' | 'aide') => void;
  masterEnabled: boolean;
  onToggleMaster: () => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  masterEnabled,
  onToggleMaster,
  onExportBackup,
  onImportBackup,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top bar with Branding and Master Toggle */}
        <div className="py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <span className="text-xl">P</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  PakAutoReply-2026
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v1.9.4
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
                com.pakworld.pakautoreply
              </p>
            </div>
          </div>

          {/* Master Auto-Reply Switch & Backup */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <a
                href="/PakAutoReply-2026-Android-AIDE.zip"
                download="PakAutoReply-2026-Android-AIDE.zip"
                className="px-3 py-2 text-emerald-300 hover:text-white bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-950/30"
                title="Download complete native Android project for AIDE"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>AIDE Android .ZIP</span>
              </a>

              <button
                onClick={onExportBackup}
                className="hidden md:flex p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs items-center gap-1.5 transition-colors"
                title="Backup SharedPreferences JSON"
              >
                <span>Backup</span>
              </button>
              <button
                onClick={onImportBackup}
                className="hidden md:flex p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs items-center gap-1.5 transition-colors"
                title="Restore Configuration"
              >
                <span>Restore</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
                Auto-Reply:
              </span>
              <button
                onClick={onToggleMaster}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-sm ${
                  masterEnabled
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{masterEnabled ? 'ACTIVE' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
          <button
            onClick={() => onSelectTab('ai')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === 'ai'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>AI Reply & Providers</span>
          </button>

          <button
            onClick={() => onSelectTab('test')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === 'test'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Test Reply Sandbox</span>
          </button>

          <button
            onClick={() => onSelectTab('rules')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === 'rules'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-4 h-4 text-indigo-400" />
            <span>Reply Rules</span>
          </button>

          <button
            onClick={() => onSelectTab('apps')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === 'apps'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Supported Apps & Contacts</span>
          </button>

          <button
            onClick={() => onSelectTab('aide')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === 'aide'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Android Code & AIDE QA</span>
          </button>
        </div>
      </div>
    </header>
  );
};
