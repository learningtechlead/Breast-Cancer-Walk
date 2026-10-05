import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CollectiveDashboard } from './components/CollectiveDashboard';
import { PodiumLeaderboard } from './components/PodiumLeaderboard';
import { TeamRoster } from './components/TeamRoster';
import { ActivityHistory } from './components/ActivityHistory';
import { AddStepsModal } from './components/AddStepsModal';
import { AddUserModal } from './components/AddUserModal';
import { RibbonIcon } from './components/RibbonIcon';
import { AppState, TeamMember, StepLog, UnitPreference } from './types';
import { storage, INITIAL_STATE } from './services/storage';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  // Modals
  const [isAddStepsOpen, setIsAddStepsOpen] = useState<boolean>(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);
  const [preSelectedMemberId, setPreSelectedMemberId] = useState<string | undefined>(undefined);

  // Load state on mount
  useEffect(() => {
    async function init() {
      try {
        const loaded = await storage.loadState();
        setState(loaded);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Save changes
  const updateState = (updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      storage.saveState(next);
      return next;
    });
  };

  // Add step log
  const handleSaveLog = (newLogData: Omit<StepLog, 'id' | 'createdAt'>) => {
    const newLog: StepLog = {
      ...newLogData,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    updateState((prev) => ({
      ...prev,
      logs: [newLog, ...prev.logs],
    }));
  };

  // Delete step log
  const handleDeleteLog = (logId: string) => {
    updateState((prev) => ({
      ...prev,
      logs: prev.logs.filter((log) => log.id !== logId),
    }));
  };

  // Add new team member
  const handleAddMember = (memberData: Omit<TeamMember, 'id' | 'joinedAt'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `m-${Date.now()}`,
      joinedAt: new Date().toISOString().slice(0, 10),
    };

    updateState((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
  };

  // Switch units
  const handleToggleUnit = (unit: UnitPreference) => {
    updateState((prev) => ({
      ...prev,
      unitPreference: unit,
    }));
  };

  // Quick action from any card/podium
  const handleSelectMemberForSteps = (memberId: string) => {
    setPreSelectedMemberId(memberId);
    setIsAddStepsOpen(true);
  };

  const handleResetData = () => {
    if (window.confirm('Reset tracker back to default demo data?')) {
      const reset = storage.resetToDefaults();
      setState(reset);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50/50">
        <RibbonIcon className="w-12 h-12 text-pink-500 animate-bounce" glow />
        <span className="mt-4 font-bold text-pink-700 text-sm">
          Loading Pink Ribbon Walking Tracker...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF5F8] via-[#FFF9FB] to-white selection:bg-pink-200">
      
      {/* Top Navigation */}
      <Header
        onOpenAddSteps={() => {
          setPreSelectedMemberId(undefined);
          setIsAddStepsOpen(true);
        }}
        onOpenAddUser={() => setIsAddUserOpen(true)}
        unit={state.unitPreference}
        onToggleUnit={handleToggleUnit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fundraisingUrl={state.goal.fundraisingUrl}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Collective Impact Dashboard (Hero) */}
        <CollectiveDashboard
          members={state.members}
          logs={state.logs}
          goal={state.goal}
          unit={state.unitPreference}
          onOpenAddSteps={() => {
            setPreSelectedMemberId(undefined);
            setIsAddStepsOpen(true);
          }}
        />

        {/* Tab Content */}
        {activeTab === 'dashboard' ? (
          <div className="space-y-10">
            {/* Top Walkers Podium & Leaderboard */}
            <PodiumLeaderboard
              members={state.members}
              logs={state.logs}
              unit={state.unitPreference}
              goal={state.goal}
              onSelectMemberForSteps={handleSelectMemberForSteps}
            />

            {/* Team Roster Grid */}
            <TeamRoster
              members={state.members}
              logs={state.logs}
              unit={state.unitPreference}
              goal={state.goal}
              onSelectMemberForSteps={handleSelectMemberForSteps}
              onOpenAddUser={() => setIsAddUserOpen(true)}
            />
          </div>
        ) : (
          /* Daily Trends & Activity Feed */
          <ActivityHistory
            logs={state.logs}
            members={state.members}
            unit={state.unitPreference}
            onDeleteLog={handleDeleteLog}
            fullState={state}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-pink-100 bg-white/70 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-2">
            <RibbonIcon className="w-4 h-4 text-pink-600" />
            <span className="font-bold text-slate-700">Pink Ribbon Walking Challenge</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> for Breast Cancer Awareness
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-pink-600 flex items-center gap-1 transition-colors"
              title="Reset to default challenge data"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
            <span className="text-pink-600 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Netlify Ready
            </span>
          </div>

        </div>
      </footer>

      {/* Modals */}
      <AddStepsModal
        isOpen={isAddStepsOpen}
        onClose={() => setIsAddStepsOpen(false)}
        members={state.members}
        initialMemberId={preSelectedMemberId}
        unit={state.unitPreference}
        onSaveLog={handleSaveLog}
        onOpenAddUser={() => setIsAddUserOpen(true)}
      />

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddMember={handleAddMember}
      />

    </div>
  );
};

export default App;
