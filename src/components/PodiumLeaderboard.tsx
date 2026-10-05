import React from 'react';
import { RibbonIcon } from './RibbonIcon';
import { Trophy, Plus, Footprints, Medal, Crown, Target } from 'lucide-react';
import { StepLog, TeamMember, UnitPreference, MonthlyGoal } from '../types';
import { formatNumber, formatDistance } from '../utils/calculator';

interface PodiumLeaderboardProps {
  members: TeamMember[];
  logs: StepLog[];
  unit: UnitPreference;
  goal: MonthlyGoal;
  onSelectMemberForSteps: (memberId: string) => void;
}

interface RankedMember {
  member: TeamMember;
  totalSteps: number;
  totalDistanceKm: number;
  totalDistanceMiles: number;
  displayDistance: number;
  activeDays: number;
  percent: number;
  remaining: number;
  rank: number;
}

export const PodiumLeaderboard: React.FC<PodiumLeaderboardProps> = ({
  members,
  logs,
  unit,
  goal,
  onSelectMemberForSteps,
}) => {
  const targetDistance = unit === 'km' ? goal.targetKm : goal.targetMiles;
  const unitLabel = unit === 'km' ? 'km' : 'mi';

  // Aggregate individual steps and distances
  const rankedMembers: RankedMember[] = members
    .map((member) => {
      const memberLogs = logs.filter((log) => log.memberId === member.id);
      const totalSteps = memberLogs.reduce((sum, log) => sum + log.steps, 0);
      const totalDistanceKm = memberLogs.reduce((sum, log) => sum + log.distanceKm, 0);
      const totalDistanceMiles = memberLogs.reduce((sum, log) => sum + log.distanceMiles, 0);
      const uniqueDays = new Set(memberLogs.map((log) => log.date)).size;

      const displayDist = unit === 'km' ? totalDistanceKm : totalDistanceMiles;
      const percent = Math.min(100, Math.round((displayDist / targetDistance) * 100));
      const remaining = Math.max(0, targetDistance - displayDist);

      return {
        member,
        totalSteps,
        totalDistanceKm,
        totalDistanceMiles,
        displayDistance: displayDist,
        activeDays: uniqueDays,
        percent,
        remaining: Math.round(remaining * 100) / 100,
        rank: 0,
      };
    })
    .sort((a, b) => b.totalSteps - a.totalSteps)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  const top1 = rankedMembers[0];
  const top2 = rankedMembers[1];
  const top3 = rankedMembers[2];

  const getDistanceDisplay = (km: number, miles: number) => {
    return unit === 'km' ? `${formatDistance(km)} km` : `${formatDistance(miles)} mi`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header title */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500 fill-amber-400" />
            Top Walkers Leaderboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Aiming for 100 miles ({goal.targetKm} km) in October • Click any walker to record their steps
          </p>
        </div>

        <div className="text-xs font-semibold text-pink-700 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-200 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-pink-600" />
          <span>Target: 100 Miles ({goal.targetKm} KM)</span>
        </div>
      </div>

      {/* Visual Podium for Top Walkers */}
      {members.length >= 2 && (
        <div className={`grid ${members.length >= 3 ? 'grid-cols-3 max-w-2xl' : 'grid-cols-2 max-w-lg'} gap-3 sm:gap-6 items-end pt-8 pb-4 px-2 mx-auto`}>
          
          {/* #2 Rank (Silver) */}
          {top2 && (
            <div
              onClick={() => onSelectMemberForSteps(top2.member.id)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative mb-2 flex flex-col items-center">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-4 ring-slate-300 shadow-md flex items-center justify-center text-white font-extrabold text-lg sm:text-xl group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: top2.member.avatarColor }}
                >
                  {top2.member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="absolute -bottom-2 bg-gradient-to-r from-slate-200 to-slate-400 text-slate-800 font-black text-xs px-2 py-0.5 rounded-full shadow border border-white">
                  #2 Silver
                </div>
              </div>

              <div className="text-center font-bold text-xs sm:text-sm text-slate-900 group-hover:text-pink-600 transition-colors truncate max-w-[100px] sm:max-w-none">
                {top2.member.name}
              </div>
              <div className="text-xs text-pink-600 font-black">
                {formatNumber(top2.totalSteps)} steps
              </div>
              <div className="text-[11px] text-slate-500 font-bold">
                {getDistanceDisplay(top2.totalDistanceKm, top2.totalDistanceMiles)}
              </div>
              
              {/* Distance Target Badge */}
              <div className="mt-1 px-2 py-0.5 rounded-md bg-pink-50 border border-pink-200 text-[10px] font-extrabold text-pink-700">
                {top2.percent}% of {targetDistance} {unitLabel}
              </div>

              {/* Podium Column */}
              <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl mt-3 flex flex-col items-center justify-center border-t-2 border-slate-300 shadow-sm p-2 text-center">
                <Medal className="w-6 h-6 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-600 mt-1">
                  {formatDistance(top2.remaining)} {unitLabel} to go
                </span>
              </div>
            </div>
          )}

          {/* #1 Rank (Gold) */}
          {top1 && (
            <div
              onClick={() => onSelectMemberForSteps(top1.member.id)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative mb-2 flex flex-col items-center">
                <Crown className="w-7 h-7 text-amber-500 fill-amber-400 animate-bounce mb-1" />
                <div
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-full ring-4 ring-amber-400 shadow-xl flex items-center justify-center text-white font-black text-xl sm:text-2xl group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: top1.member.avatarColor }}
                >
                  {top1.member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="absolute -bottom-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow border border-white flex items-center gap-1">
                  <RibbonIcon className="w-3 h-3 text-amber-900" />
                  #1 Gold
                </div>
              </div>

              <div className="text-center font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-pink-600 transition-colors truncate max-w-[110px] sm:max-w-none">
                {top1.member.name}
              </div>
              <div className="text-xs sm:text-sm text-pink-600 font-black">
                {formatNumber(top1.totalSteps)} steps
              </div>
              <div className="text-xs text-slate-500 font-bold">
                {getDistanceDisplay(top1.totalDistanceKm, top1.totalDistanceMiles)}
              </div>

              {/* Distance Target Badge */}
              <div className="mt-1 px-2.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-[10px] font-extrabold text-amber-900">
                {top1.percent}% of {targetDistance} {unitLabel}
              </div>

              {/* Podium Column */}
              <div className="w-full h-32 sm:h-36 bg-gradient-to-t from-pink-500 via-rose-500 to-pink-400 text-white rounded-t-2xl mt-3 flex flex-col items-center justify-center border-t-4 border-amber-300 shadow-md p-2 text-center">
                <Trophy className="w-8 h-8 text-amber-300 fill-amber-200" />
                <span className="text-[11px] font-bold text-pink-100 uppercase tracking-wider mt-1">Leader</span>
                <span className="text-[10px] font-extrabold text-white mt-0.5">
                  {formatDistance(top1.remaining)} {unitLabel} to go
                </span>
              </div>
            </div>
          )}

          {/* #3 Rank (Bronze) */}
          {top3 && (
            <div
              onClick={() => onSelectMemberForSteps(top3.member.id)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative mb-2 flex flex-col items-center">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-4 ring-amber-600/40 shadow-md flex items-center justify-center text-white font-extrabold text-lg sm:text-xl group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: top3.member.avatarColor }}
                >
                  {top3.member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="absolute -bottom-2 bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100 font-black text-xs px-2 py-0.5 rounded-full shadow border border-white">
                  #3 Bronze
                </div>
              </div>

              <div className="text-center font-bold text-xs sm:text-sm text-slate-900 group-hover:text-pink-600 transition-colors truncate max-w-[100px] sm:max-w-none">
                {top3.member.name}
              </div>
              <div className="text-xs text-pink-600 font-black">
                {formatNumber(top3.totalSteps)}
              </div>
              <div className="text-[11px] text-slate-500 font-bold">
                {getDistanceDisplay(top3.totalDistanceKm, top3.totalDistanceMiles)}
              </div>

              {/* Distance Target Badge */}
              <div className="mt-1 px-2 py-0.5 rounded-md bg-orange-100 border border-orange-200 text-[10px] font-extrabold text-amber-900">
                {top3.percent}% of {targetDistance} {unitLabel}
              </div>

              {/* Podium Column */}
              <div className="w-full h-20 sm:h-22 bg-gradient-to-t from-amber-100 to-orange-50 rounded-t-2xl mt-3 flex flex-col items-center justify-center border-t-2 border-amber-300 shadow-sm p-2 text-center">
                <Medal className="w-6 h-6 text-amber-700" />
                <span className="text-[10px] font-bold text-amber-900 mt-0.5">
                  {formatDistance(top3.remaining)} {unitLabel} to go
                </span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Full Leaderboard List */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-soft-pink overflow-hidden">
        <div className="px-5 py-3.5 bg-pink-50/60 border-b border-pink-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="flex items-center gap-6">
            <span className="w-8 text-center">Rank</span>
            <span>Walker</span>
          </div>
          <div className="flex items-center gap-6 sm:gap-8">
            <span className="hidden md:inline">Days</span>
            <span className="w-36 text-right">100 Mi Target</span>
            <span className="w-24 text-right">Total Steps</span>
            <span className="w-16 text-center">Action</span>
          </div>
        </div>

        <div className="divide-y divide-pink-50">
          {rankedMembers.map((item) => {
            return (
              <div
                key={item.member.id}
                className="px-5 py-3.5 flex items-center justify-between hover:bg-pink-50/50 transition-colors group cursor-pointer"
                onClick={() => onSelectMemberForSteps(item.member.id)}
              >
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 flex items-center justify-center font-extrabold text-sm">
                    {item.rank === 1 ? (
                      <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">1</span>
                    ) : item.rank === 2 ? (
                      <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">2</span>
                    ) : item.rank === 3 ? (
                      <span className="w-7 h-7 rounded-full bg-orange-100 text-amber-800 flex items-center justify-center">3</span>
                    ) : (
                      <span className="text-slate-400 font-semibold">{item.rank}</span>
                    )}
                  </div>

                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-xs group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: item.member.avatarColor }}
                  >
                    {item.member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors text-sm truncate">
                      {item.member.name}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 md:hidden">
                      <span>{item.activeDays} days</span>
                      <span>•</span>
                      <span>{getDistanceDisplay(item.totalDistanceKm, item.totalDistanceMiles)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Target progress, Steps & Action */}
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Days Active */}
                  <div className="text-xs font-semibold text-slate-500 hidden md:block w-12 text-center">
                    {item.activeDays}d
                  </div>

                  {/* 100 Miles / 160 KM Target meter */}
                  <div className="w-36 text-right">
                    <div className="font-bold text-xs text-slate-800 flex items-center justify-end gap-1">
                      <span>{formatDistance(item.displayDistance)} / {targetDistance} {unitLabel}</span>
                      <span className="text-pink-600 font-black">({item.percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                      {item.remaining > 0 ? `${formatDistance(item.remaining)} ${unitLabel} left` : 'Completed! 🎉'}
                    </span>
                  </div>

                  {/* Steps */}
                  <div className="w-24 text-right hidden sm:block">
                    <div className="font-extrabold text-sm text-slate-900 flex items-center justify-end gap-1">
                      <Footprints className="w-3.5 h-3.5 text-pink-500" />
                      <span>{formatNumber(item.totalSteps)}</span>
                    </div>
                  </div>

                  {/* Add Steps button */}
                  <div className="w-16 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMemberForSteps(item.member.id);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-pink-700 bg-pink-100/80 hover:bg-pink-600 hover:text-white rounded-lg transition-all active:scale-95 shadow-2xs"
                      title={`Log steps for ${item.member.name}`}
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                      <span>Log</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
