import React from 'react';
import { RibbonIcon } from './RibbonIcon';
import { Plus, UserPlus, Footprints, MapPin, Calendar, Target } from 'lucide-react';
import { StepLog, TeamMember, UnitPreference, MonthlyGoal } from '../types';
import { formatNumber, formatDistance } from '../utils/calculator';

interface TeamRosterProps {
  members: TeamMember[];
  logs: StepLog[];
  unit: UnitPreference;
  goal: MonthlyGoal;
  onSelectMemberForSteps: (memberId: string) => void;
  onOpenAddUser: () => void;
}

export const TeamRoster: React.FC<TeamRosterProps> = ({
  members,
  logs,
  unit,
  goal,
  onSelectMemberForSteps,
  onOpenAddUser,
}) => {
  const targetDistance = unit === 'km' ? goal.targetKm : goal.targetMiles;
  const unitLabel = unit === 'km' ? 'km' : 'mi';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <RibbonIcon className="w-5 h-5 text-pink-600" />
            Team Walkers Roster ({members.length})
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Walking 100 miles ({goal.targetKm} km) in October • Click any card to log steps
          </p>
        </div>

        <button
          onClick={onOpenAddUser}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-pink-700 bg-pink-100/70 hover:bg-pink-200 border border-pink-200 rounded-xl transition-all active:scale-95"
        >
          <UserPlus className="w-3.5 h-3.5 text-pink-600" />
          <span>Add Walker</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => {
          const memberLogs = logs.filter((log) => log.memberId === member.id);
          const totalSteps = memberLogs.reduce((sum, log) => sum + log.steps, 0);
          const totalDistanceKm = memberLogs.reduce((sum, log) => sum + log.distanceKm, 0);
          const totalDistanceMiles = memberLogs.reduce((sum, log) => sum + log.distanceMiles, 0);
          const activeDays = new Set(memberLogs.map((log) => log.date)).size;

          const displayDist = unit === 'km' ? totalDistanceKm : totalDistanceMiles;
          const percent = Math.min(100, Math.round((displayDist / targetDistance) * 100));
          const remaining = Math.max(0, targetDistance - displayDist);

          const distanceDisplay = unit === 'km'
            ? `${formatDistance(totalDistanceKm)} km`
            : `${formatDistance(totalDistanceMiles)} mi`;

          return (
            <div
              key={member.id}
              onClick={() => onSelectMemberForSteps(member.id)}
              className="bg-white rounded-2xl p-5 border border-pink-100 shadow-soft-pink hover:border-pink-300 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              {/* Accent tone top strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: member.avatarColor }}
              />

              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-base ring-2 ring-pink-50 shadow-sm group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors text-base">
                        {member.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <Calendar className="w-3 h-3 text-pink-400" />
                        <span>{activeDays} active days</span>
                      </div>
                    </div>
                  </div>

                  <span className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-pink-50">
                  <div className="bg-pink-50/50 rounded-xl p-2.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Steps
                    </span>
                    <span className="text-sm font-black text-pink-700 flex items-center gap-1 mt-0.5">
                      <Footprints className="w-3.5 h-3.5 text-pink-500" />
                      {formatNumber(totalSteps)}
                    </span>
                  </div>

                  <div className="bg-pink-50/50 rounded-xl p-2.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Distance
                    </span>
                    <span className="text-sm font-black text-slate-800 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-pink-500" />
                      {distanceDisplay}
                    </span>
                  </div>
                </div>

                {/* 100 Miles / 160 KM Target Bar */}
                <div className="mt-3 bg-pink-50/40 rounded-xl p-2.5 border border-pink-100/70">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Target className="w-3 h-3 text-pink-500" />
                      100 Miles Target
                    </span>
                    <span className="text-pink-600 font-extrabold">{percent}%</span>
                  </div>

                  <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-pink-200/60 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mt-1">
                    <span>{formatDistance(displayDist)} {unitLabel}</span>
                    <span>{remaining > 0 ? `${formatDistance(remaining)} ${unitLabel} left` : 'Goal reached! 🎉'}</span>
                  </div>
                </div>

              </div>

              {/* Action footer */}
              <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-pink-600">
                <span className="text-slate-400 group-hover:text-pink-600 transition-colors">
                  Stride: {member.strideLengthMeters}m
                </span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  + Add Steps
                </span>
              </div>
            </div>
          );
        })}

        {/* Add New Walker Card */}
        <div
          onClick={onOpenAddUser}
          className="rounded-2xl p-6 border-2 border-dashed border-pink-200 hover:border-pink-400 bg-pink-50/30 hover:bg-pink-50/70 transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[170px] group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-pink-200 shadow-xs flex items-center justify-center text-pink-500 group-hover:scale-110 group-hover:text-pink-600 group-hover:border-pink-300 transition-all mb-2.5">
            <UserPlus className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-sm text-pink-700 group-hover:text-pink-800">
            Add New Walker
          </span>
          <span className="text-xs text-slate-500 mt-1 max-w-[200px]">
            Join the 100 miles October challenge and log your daily walk
          </span>
        </div>
      </div>
    </div>
  );
};
