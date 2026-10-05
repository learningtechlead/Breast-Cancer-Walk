import React from 'react';
import { RibbonIcon } from './RibbonIcon';
import { Footprints, MapPin, ExternalLink, Heart, Target, ChevronRight, CheckCircle2 } from 'lucide-react';
import { StepLog, TeamMember, MonthlyGoal, UnitPreference } from '../types';
import { formatNumber, formatDistance } from '../utils/calculator';

interface CollectiveDashboardProps {
  members: TeamMember[];
  logs: StepLog[];
  goal: MonthlyGoal;
  unit: UnitPreference;
  onOpenAddSteps: () => void;
}

export const CollectiveDashboard: React.FC<CollectiveDashboardProps> = ({
  members,
  logs,
  goal,
  unit,
  onOpenAddSteps,
}) => {
  // Aggregate collective metrics
  const totalSteps = logs.reduce((sum, log) => sum + log.steps, 0);
  const totalDistanceKm = logs.reduce((sum, log) => sum + log.distanceKm, 0);
  const totalDistanceMiles = logs.reduce((sum, log) => sum + log.distanceMiles, 0);

  const displayDistance = unit === 'km' ? totalDistanceKm : totalDistanceMiles;
  const targetDistancePerWalker = unit === 'km' ? goal.targetKm : goal.targetMiles;
  const unitLabel = unit === 'km' ? 'km' : 'miles';
  const unitLabelFull = unit === 'km' ? 'Kilometres' : 'Miles';

  // Individual walker progress toward 100 miles (160 km)
  const walkerProgress = members.map((member) => {
    const memberLogs = logs.filter((l) => l.memberId === member.id);
    const memberKm = memberLogs.reduce((sum, l) => sum + l.distanceKm, 0);
    const memberMiles = memberLogs.reduce((sum, l) => sum + l.distanceMiles, 0);
    const memberSteps = memberLogs.reduce((sum, l) => sum + l.steps, 0);
    const memberDist = unit === 'km' ? memberKm : memberMiles;
    const percent = Math.min(100, Math.round((memberDist / targetDistancePerWalker) * 100));
    const remaining = Math.max(0, targetDistancePerWalker - memberDist);

    return {
      member,
      steps: memberSteps,
      distanceKm: memberKm,
      distanceMiles: memberMiles,
      displayDist: memberDist,
      percent,
      remaining: Math.round(remaining * 100) / 100,
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Hero Campaign Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-pink-700 text-white shadow-xl shadow-pink-600/25 p-6 sm:p-10 border border-pink-400/40">
        
        {/* Subtle decorative ribbons */}
        <div className="absolute -top-10 -right-10 w-72 h-72 opacity-15 pointer-events-none transform rotate-12">
          <RibbonIcon className="w-full h-full text-white" />
        </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-pink-400/25 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          
          {/* Campaign Header: Breast Cancer Now Logo Badge + Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/20">
            <div className="flex items-center gap-3.5">
              {/* Breast Cancer Now Badge styled matching the official campaign */}
              <div className="bg-white rounded-xl px-2.5 py-1.5 shadow-md flex flex-col items-center justify-center leading-none text-center select-none shrink-0 border border-pink-100">
                <span className="text-[9px] font-black text-[#f43f5e] tracking-wider">BREAST</span>
                <span className="text-[10px] font-black text-[#e11d48] tracking-tight">CANCER</span>
                <span className="bg-[#f43f5e] text-white px-1.5 py-0.5 rounded-[4px] text-[8px] font-black tracking-widest mt-0.5">NOW</span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-100 block">
                  Official Breast Cancer Awareness Challenge
                </span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-xs">
                  I'm Walking 100 Miles in October
                </h2>
              </div>
            </div>

            {/* JustGiving Campaign Link Button */}
            <a
              href={goal.fundraisingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-pink-50 text-pink-700 font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 group shrink-0 ring-2 ring-white/50"
            >
              <Heart className="w-4 h-4 text-pink-600 fill-pink-500 group-hover:scale-110 transition-transform" />
              <span>I'm walking 100 miles in October - click here to support</span>
              <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
            </a>
          </div>

          {/* Collective Step Odometer & Collective Distance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-2">
              <div className="text-pink-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Footprints className="w-4 h-4" />
                Collective Team Walking Progress
              </div>
              
              <div className="text-4xl sm:text-6xl font-black tracking-tight text-white flex items-baseline gap-3">
                <span>{formatNumber(totalSteps)}</span>
                <span className="text-xl font-bold text-pink-200">total steps</span>
              </div>

              <div className="text-xl sm:text-2xl font-black text-amber-200 flex items-center gap-2 pt-1">
                <MapPin className="w-5 h-5 text-amber-300" />
                <span>{formatDistance(displayDistance)} {unitLabelFull} Walked Collectively</span>
              </div>

              <p className="text-pink-100/90 text-xs sm:text-sm font-medium pt-1 max-w-xl">
                Every mile walked brings us closer to beating breast cancer. Support our walk on{' '}
                <a
                  href={goal.fundraisingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold text-white hover:text-amber-200"
                >
                  JustGiving
                </a>.
              </p>
            </div>

            {/* Target Distance Goal Box: 100 Miles / 160 Kilometres */}
            <div className="lg:col-span-6 bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-inner space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Challenge Target: 100 Miles ({goal.targetKm} KM)
                  </span>
                </div>
                <span className="text-xs font-extrabold text-amber-200 bg-white/10 px-2 py-0.5 rounded-full">
                  Per Walker Target
                </span>
              </div>

              {/* Individual Walker Target Trackers */}
              <div className="space-y-3">
                {walkerProgress.map((wp) => (
                  <div key={wp.member.id} className="bg-black/15 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                          style={{ backgroundColor: wp.member.avatarColor }}
                        >
                          {wp.member.name[0]}
                        </span>
                        <strong className="text-white font-extrabold">{wp.member.name}</strong>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-white">
                          {formatDistance(wp.displayDist)} / {targetDistancePerWalker} {unitLabel}
                        </span>
                        <span className="text-amber-200 font-bold ml-1.5">
                          ({wp.percent}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative w-full h-3 bg-black/30 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-amber-300 via-pink-200 to-white rounded-full transition-all duration-700"
                        style={{ width: `${wp.percent}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-pink-100 font-medium mt-1">
                      <span>{formatNumber(wp.steps)} steps</span>
                      {wp.remaining > 0 ? (
                        <span className="text-pink-100">
                          <strong>{formatDistance(wp.remaining)} {unitLabel}</strong> left to target
                        </span>
                      ) : (
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Target Achieved!
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={onOpenAddSteps}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-pink-50 text-pink-700 font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 group"
              >
                <RibbonIcon className="w-4 h-4 text-pink-600 group-hover:rotate-12 transition-transform" />
                <span>Add My Steps Today</span>
                <ChevronRight className="w-4 h-4 text-pink-500" />
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
