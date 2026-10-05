import React from 'react';
import { RibbonIcon } from './RibbonIcon';
import { Plus, UserPlus, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { UnitPreference } from '../types';

interface HeaderProps {
  onOpenAddSteps: () => void;
  onOpenAddUser: () => void;
  unit: UnitPreference;
  onToggleUnit: (unit: UnitPreference) => void;
  activeTab: 'dashboard' | 'history';
  setActiveTab: (tab: 'dashboard' | 'history') => void;
  fundraisingUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddSteps,
  onOpenAddUser,
  unit,
  onToggleUnit,
  activeTab,
  setActiveTab,
  fundraisingUrl = 'https://www.justgiving.com/fundraising/rebecca1790618451850',
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm transition-all">
      
      {/* Top Campaign Announcement Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white text-xs font-bold py-2 px-4 text-center shadow-xs flex items-center justify-center gap-2">
        <Heart className="w-3.5 h-3.5 fill-white text-white animate-pulse shrink-0" />
        <span>I'm walking 100 miles in October -</span>
        <a
          href={fundraisingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-black text-amber-200 hover:text-white transition-colors inline-flex items-center gap-1"
        >
          <span>click here to support</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-400 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform duration-300">
                <RibbonIcon className="w-8 h-8 filter brightness-110 drop-shadow" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                <Heart className="w-3.5 h-3.5 text-pink-600 fill-pink-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent tracking-tight">
                  Pink Ribbon Walk
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100/80 text-pink-700 border border-pink-200">
                  <Sparkles className="w-3 h-3 text-pink-500" />
                  100 Miles Challenge
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden md:block">
                Walking 100 miles in October for Breast Cancer Now
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Switcher */}
            <div className="bg-pink-50/80 p-1 rounded-xl border border-pink-200/60 hidden sm:flex items-center text-xs font-semibold">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-pink-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                Team Dashboard
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'history'
                    ? 'bg-white text-pink-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                Daily Trends & Logs
              </button>
            </div>

            {/* Unit Switcher */}
            <div className="bg-white border border-pink-200 rounded-xl p-0.5 flex text-xs font-bold text-slate-600 shadow-xs">
              <button
                onClick={() => onToggleUnit('mi')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  unit === 'mi' ? 'bg-pink-600 text-white shadow-xs' : 'hover:text-pink-600'
                }`}
                title="Display in Miles (100 miles target)"
              >
                MI
              </button>
              <button
                onClick={() => onToggleUnit('km')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  unit === 'km' ? 'bg-pink-600 text-white shadow-xs' : 'hover:text-pink-600'
                }`}
                title="Display in Kilometres (160 km target)"
              >
                KM
              </button>
            </div>

            {/* Add Walker button */}
            <button
              onClick={onOpenAddUser}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100/90 border border-pink-200 rounded-xl transition-all active:scale-95 shadow-xs"
              title="Add a new team member"
            >
              <UserPlus className="w-4 h-4 text-pink-600" />
              <span className="hidden md:inline">Add Walker</span>
            </button>

            {/* Primary Action: Add My Steps */}
            <button
              onClick={onOpenAddSteps}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-700 shadow-md shadow-pink-500/30 hover:shadow-lg hover:shadow-pink-500/40 transition-all duration-200 active:scale-95 ring-2 ring-pink-300/40"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add My Steps</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
