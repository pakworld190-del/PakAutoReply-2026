import React, { useState, useEffect } from 'react';
import { AISettingsConfig, ReplyRule } from './types/ai';
import { StorageService } from './services/storage';
import { Header } from './components/Header';
import { AISettingsScreen } from './components/AISettingsScreen';
import { TestReplySandbox } from './components/TestReplySandbox';
import { RulesManager, SupportedAppsManager } from './components/RulesAndApps';
import { ArchitectureInspector } from './components/ArchitectureInspector';
import { PROVIDERS_LIST } from './data/providers';
import { CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<AISettingsConfig>(() => StorageService.loadAISettings());
  const [rules, setRules] = useState<ReplyRule[]>(() => StorageService.loadRules());
  const [blockedContacts, setBlockedContacts] = useState<string[]>(() => StorageService.loadBlockedContacts());
  const [activeTab, setActiveTab] = useState<'ai' | 'test' | 'rules' | 'apps' | 'aide'>('ai');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeProvider = PROVIDERS_LIST.find((p) => p.id === config.selectedProvider) || PROVIDERS_LIST[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateConfig = (newConfig: AISettingsConfig) => {
    setConfig(newConfig);
    StorageService.saveAISettings(newConfig);
    showToast(`Configuration updated for ${activeProvider.displayName}`);
  };

  const handleSaveRules = (newRules: ReplyRule[]) => {
    setRules(newRules);
    StorageService.saveRules(newRules);
    showToast('Reply rules saved');
  };

  const handleSaveBlocked = (newList: string[]) => {
    setBlockedContacts(newList);
    StorageService.saveBlockedContacts(newList);
    showToast('Blocked contacts updated');
  };

  const handleToggleMaster = () => {
    const updated = { ...config, aiReplyEnabled: !config.aiReplyEnabled };
    handleUpdateConfig(updated);
    showToast(updated.aiReplyEnabled ? 'Auto-Reply activated' : 'Auto-Reply paused');
  };

  const handleExportBackup = () => {
    const backupData = {
      app: 'com.pakworld.pakautoreply',
      version: '1.9.4',
      timestamp: new Date().toISOString(),
      config,
      rules,
      blockedContacts,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pakautoreply_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('SharedPreferences backup downloaded');
  };

  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.config) {
            handleUpdateConfig(parsed.config);
          }
          if (parsed.rules) {
            handleSaveRules(parsed.rules);
          }
          if (parsed.blockedContacts) {
            handleSaveBlocked(parsed.blockedContacts);
          }
          showToast('Configuration restored successfully');
        } catch {
          alert('Invalid backup JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-800 border border-emerald-500/40 text-emerald-300 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Tab Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        masterEnabled={config.aiReplyEnabled}
        onToggleMaster={handleToggleMaster}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeTab === 'ai' && (
          <AISettingsScreen
            config={config}
            onUpdateConfig={handleUpdateConfig}
            onNavigateToTest={() => setActiveTab('test')}
          />
        )}

        {activeTab === 'test' && (
          <TestReplySandbox
            config={config}
            rules={rules}
            blockedContacts={blockedContacts}
            onOpenAISettings={() => setActiveTab('ai')}
          />
        )}

        {activeTab === 'rules' && (
          <RulesManager
            rules={rules}
            onSaveRules={handleSaveRules}
          />
        )}

        {activeTab === 'apps' && (
          <SupportedAppsManager
            blockedContacts={blockedContacts}
            onSaveBlocked={handleSaveBlocked}
          />
        )}

        {activeTab === 'aide' && (
          <ArchitectureInspector />
        )}
      </main>

      {/* Bottom Status Bar */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-3 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-400">PakAutoReply-2026 Engine Ready</span>
            <span className="font-mono text-[10px] text-slate-600">• v1.9.4</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Active Provider: <strong className="text-emerald-400 font-semibold">{activeProvider.displayName}</strong></span>
            <span>Model: <strong className="text-blue-400 font-mono">{config.selectedModels[config.selectedProvider]}</strong></span>
            <span className="text-slate-600 hidden md:inline">SharedPreferences Synced</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
