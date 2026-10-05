import React, { useState } from 'react';
import { RibbonIcon } from './RibbonIcon';
import { Trash2, Download, Footprints, MapPin, Filter, ArrowUpDown } from 'lucide-react';
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

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({
  logs,
  members,
  unit,
  onDeleteLog,
  fullState,
}) => {
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter logs
  const filteredLogs = logs
    .filter((log) => (selectedMemberFilter === 'all' ? true : log.memberId === selectedMemberFilter))
    .sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return sortOrder === 'desc' ? -cmp : cmp;
    });

  // Calculate day-by-day aggregated data for the monthly chart
  const dailyMap: Record<string, number> = {};
  logs.forEach((log) => {
    dailyMap[log.date] = (dailyMap[log.date] || 0) + log.steps;
  });

  const sortedDates = Object.keys(dailyMap).sort();
  const maxDaySteps = Math.max(...Object.values(dailyMap), 10000);

  return (
    <div className="space-y-6">
      
      {/* Monthly Daily Steps Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-soft-pink">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <RibbonIcon className="w-5 h-5 text-pink-600" />
              Daily Team Walking Volume
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Collective steps achieved each day this month
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => storage.exportLogsAsCSV(fullState)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => storage.exportDataAsJSON(fullState)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
            >
              <span>Backup JSON</span>
            </button>
          </div>
        </div>

        {/* Custom SVG / Bar Chart */}
        {sortedDates.length > 0 ? (
          <div className="pt-4">
            <div className="h-48 sm:h-56 flex items-end gap-2 sm:gap-4 border-b border-pink-100 pb-2 px-2 overflow-x-auto">
              {sortedDates.map((d) => {
                const daySteps = dailyMap[d];
                const heightPercent = Math.max(12, Math.round((daySteps / maxDaySteps) * 100));
                const dayLabel = d.slice(8); // day of month e.g. "01", "05"
                const monthName = new Date(d).toLocaleDateString(undefined, { month: 'short' });

                return (
                  <div key={d} className="flex-1 min-w-[38px] flex flex-col items-center group relative">
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 bg-slate-900 text-white text-[11px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-20">
                      {formatNumber(daySteps)} steps ({d})
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[40px] flex items-end justify-center h-full">
                      <div
                        className="w-full bg-gradient-to-t from-pink-500 to-rose-400 group-hover:from-pink-600 group-hover:to-rose-500 rounded-t-xl transition-all shadow-xs"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Date label */}
                    <div className="text-[10px] sm:text-xs font-bold text-slate-500 mt-2">
                      {dayLabel}
                    </div>
                    <div className="text-[9px] text-slate-400 uppercase font-medium">
                      {monthName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-sm">
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
