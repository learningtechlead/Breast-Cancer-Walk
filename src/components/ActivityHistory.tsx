import React, { useState } from 'react';
import { Trash2, Download, Footprints, MapPin, Filter, ArrowUpDown, TrendingUp } from 'lucide-react';
import { StepLog, TeamMember, UnitPreference } from '../types';
import { formatNumber, formatDistance } from '../utils/calculator';
import { storage } from '../services/storage';

interface ActivityHistoryProps {
  logs: StepLog[];
  members: TeamMember[];
  unit: UnitPreference;
  onDeleteLog: (logId: string) => void;
  fullState: any;
}

const MONTH_NAMES = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({
  logs,
  members,
  unit,
  onDeleteLog,
  fullState,
}) => {
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [chartMetric, setChartMetric] = useState<'steps' | 'distance'>('distance');

  // Filter logs for the history list
  const filteredLogs = logs
    .filter((log) => (selectedMemberFilter === 'all' ? true : log.memberId === selectedMemberFilter))
    .sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return sortOrder === 'desc' ? -cmp : cmp;
    });

  // Calculate day-by-day aggregated data for the monthly chart
  interface DaySummary {
    date: string;
    totalSteps: number;
    totalDistanceKm: number;
    totalDistanceMiles: number;
    walkerDetails: { name: string; steps: number; distance: number; color: string }[];
  }

  const dailyMap: Record<string, DaySummary> = {};
  
  logs.forEach((log) => {
    if (!dailyMap[log.date]) {
      dailyMap[log.date] = {
        date: log.date,
        totalSteps: 0,
        totalDistanceKm: 0,
        totalDistanceMiles: 0,
        walkerDetails: [],
      };
    }
    const day = dailyMap[log.date];
    day.totalSteps += log.steps;
    day.totalDistanceKm += log.distanceKm;
    day.totalDistanceMiles += log.distanceMiles;
    
    const member = members.find((m) => m.id === log.memberId);
    day.walkerDetails.push({
      name: log.memberName,
      steps: log.steps,
      distance: unit === 'km' ? log.distanceKm : log.distanceMiles,
      color: member?.avatarColor || '#ec4899',
    });
  });

  const sortedDates = Object.keys(dailyMap).sort();

  // Find max values for chart scale
  const maxSteps = Math.max(...sortedDates.map((d) => dailyMap[d].totalSteps), 10000);
  const maxDistance = Math.max(
    ...sortedDates.map((d) => (unit === 'km' ? dailyMap[d].totalDistanceKm : dailyMap[d].totalDistanceMiles)),
    10
  );

  const unitLabel = unit === 'km' ? 'km' : 'mi';

  return (
    <div className="space-y-6">
      
      {/* Monthly Daily Team Walking Volume Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-soft-pink">
        
        {/* Chart Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-pink-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Daily Team Walking Volume
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Collective progress achieved across each day of October
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Metric Toggle: Distance vs Steps */}
            <div className="bg-pink-50 p-1 rounded-xl border border-pink-200 flex text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setChartMetric('distance')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartMetric === 'distance'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'hover:text-pink-600'
                }`}
              >
                Distance ({unitLabel})
              </button>
              <button
                type="button"
                onClick={() => setChartMetric('steps')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartMetric === 'steps'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'hover:text-pink-600'
                }`}
              >
                Steps
              </button>
            </div>

            {/* Export Buttons */}
            <button
              onClick={() => storage.exportLogsAsCSV(fullState)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl transition-all"
              title="Download spreadsheet report"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Visual Bar Chart */}
        {sortedDates.length > 0 ? (
          <div className="pt-6">
            
            {/* Chart Area with background grid lines */}
            <div className="relative border-b-2 border-pink-200 pb-3">
              
              {/* Subtle horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-pink-300 w-full" />
                <div className="border-b border-pink-300 w-full" />
                <div className="border-b border-pink-300 w-full" />
              </div>

              {/* Bars Row */}
              <div className="h-56 sm:h-64 flex items-end justify-start sm:justify-center gap-4 sm:gap-8 px-4 overflow-x-auto">
                {sortedDates.map((dateStr) => {
                  const day = dailyMap[dateStr];
                  const daySteps = day.totalSteps;
                  const dayDistance = unit === 'km' ? day.totalDistanceKm : day.totalDistanceMiles;
                  
                  // Calculate bar height percentage based on selected metric
                  const heightPercent = chartMetric === 'distance'
                    ? Math.max(14, Math.min(100, Math.round((dayDistance / maxDistance) * 100)))
                    : Math.max(14, Math.min(100, Math.round((daySteps / maxSteps) * 100)));

                  // Safe date formatting: parse YYYY-MM-DD string directly
                  const parts = dateStr.split('-');
                  const dayNum = parseInt(parts[2] || '1', 10);
                  const monthNum = parseInt(parts[1] || '10', 10);
                  const monthLabel = MONTH_NAMES[monthNum] || 'Oct';

                  const displayValue = chartMetric === 'distance'
                    ? `${formatDistance(dayDistance)} ${unitLabel}`
                    : `${(daySteps / 1000).toFixed(1)}k`;

                  return (
                    <div
                      key={dateStr}
                      className="flex-1 min-w-[65px] max-w-[90px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
                    >
                      {/* Hover Tooltip Card */}
                      <div className="absolute -top-24 sm:-top-28 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-2.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-30 min-w-[160px] text-xs">
                        <div className="font-extrabold text-pink-300 border-b border-slate-700 pb-1 mb-1 flex items-center justify-between">
                          <span>{monthLabel} {dayNum}, {parts[0]}</span>
                          <span>{formatDistance(dayDistance)} {unitLabel}</span>
                        </div>
                        <div className="text-[11px] text-slate-300 mb-1">
                          <strong>{formatNumber(daySteps)}</strong> collective steps
                        </div>
                        <div className="space-y-0.5 pt-0.5 border-t border-slate-800 text-[10px]">
                          {day.walkerDetails.map((w, idx) => (
                            <div key={idx} className="flex items-center justify-between text-slate-400">
                              <span className="flex items-center gap-1 text-white">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: w.color }} />
                                {w.name}
                              </span>
                              <span>{formatDistance(w.distance)} {unitLabel}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Number Label Above Bar */}
                      <div className="text-[11px] sm:text-xs font-black text-pink-700 mb-1.5 group-hover:scale-110 transition-transform">
                        {displayValue}
                      </div>

                      {/* The Bar */}
                      <div
                        className="w-full max-w-[48px] bg-gradient-to-t from-pink-600 via-rose-500 to-pink-400 group-hover:from-pink-500 group-hover:to-rose-400 rounded-t-xl shadow-md transition-all duration-300 group-hover:shadow-pink-300/50"
                        style={{ height: `${heightPercent}%` }}
                      />

                      {/* Date Axis Label Below */}
                      <div className="text-center mt-2.5">
                        <span className="block text-xs sm:text-sm font-extrabold text-slate-800">
                          {dayNum}
                        </span>
                        <span className="block text-[10px] font-bold text-pink-600 uppercase tracking-wider">
                          {monthLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Chart Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium px-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-gradient-to-tr from-pink-600 to-rose-400" />
                <span>Hover over any bar to see who walked on that day</span>
              </div>
              <span className="text-pink-600 font-bold">
                October 100 Miles Challenge
              </span>
            </div>

          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-sm">
            No walking activity recorded yet this month.
          </div>
        )}
      </div>

      {/* Activity Log Feed */}
      <div className="bg-white rounded-3xl border border-pink-100 shadow-soft-pink overflow-hidden">
        
        {/* Controls */}
        <div className="p-5 sm:p-6 bg-pink-50/40 border-b border-pink-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
              Activity History ({filteredLogs.length})
            </h4>
            <p className="text-xs text-slate-500">
              Detailed step logs across the month
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter by Walker */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Filter className="w-3.5 h-3.5 text-pink-500" />
              <select
                value={selectedMemberFilter}
                onChange={(e) => setSelectedMemberFilter(e.target.value)}
                className="bg-white border border-pink-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Walkers</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-1.5 rounded-xl border border-pink-200 bg-white hover:bg-pink-50 text-slate-600 text-xs font-semibold flex items-center gap-1"
              title="Toggle Date Order"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-pink-600" />
              <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </div>

        {/* Logs Table / List */}
        <div className="divide-y divide-pink-50">
          {filteredLogs.map((log) => {
            const member = members.find((m) => m.id === log.memberId);
            const distance = unit === 'km' ? `${formatDistance(log.distanceKm)} km` : `${formatDistance(log.distanceMiles)} mi`;

            return (
              <div
                key={log.id}
                className="p-4 sm:px-6 flex items-center justify-between hover:bg-pink-50/30 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                    style={{ backgroundColor: member?.avatarColor || '#ec4899' }}
                  >
                    {log.memberName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 truncate">
                        {log.memberName}
                      </span>
                      <span className="text-[11px] font-semibold text-pink-700 bg-pink-100/70 px-2 py-0.5 rounded-full">
                        {log.date}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 font-bold text-pink-600">
                        <Footprints className="w-3 h-3" />
                        {formatNumber(log.steps)} steps
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-pink-400" />
                        {distance}
                      </span>
                      {log.notes && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline italic text-slate-400 truncate max-w-[200px]">
                            "{log.notes}"
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete log of ${formatNumber(log.steps)} steps for ${log.memberName} on ${log.date}?`)) {
                        onDeleteLog(log.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching activity records found.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
