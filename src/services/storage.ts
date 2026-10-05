import { AppState, TeamMember, StepLog } from '../types';

const STORAGE_KEY = 'pink_ribbon_walk_app_state_v3';
const API_BASE = '/.netlify/functions/data';

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'm-becky',
    name: 'Becky',
    avatarColor: '#ec4899', // Pink
    strideLengthMeters: 0.80,
    joinedAt: '2026-10-01',
  },
  {
    id: 'm-adrian',
    name: 'Adrian',
    avatarColor: '#0284c7', // Ocean Blue
    strideLengthMeters: 0.81,
    joinedAt: '2026-10-01',
  },
];

const INITIAL_LOGS: StepLog[] = [
  // Becky's entries
  {
    id: 'log-becky-2026-10-01',
    memberId: 'm-becky',
    memberName: 'Becky',
    date: '2026-10-01',
    steps: 18616,
    distanceKm: 14.81,
    distanceMiles: 9.2,
    strideLengthMeters: 0.80,
    isManualDistance: true,
    notes: 'Kickoff Day 1 walk! 🎀',
    createdAt: '2026-10-01T18:00:00Z',
  },
  {
    id: 'log-becky-2026-10-02',
    memberId: 'm-becky',
    memberName: 'Becky',
    date: '2026-10-02',
    steps: 12971,
    distanceKm: 10.43,
    distanceMiles: 6.48,
    strideLengthMeters: 0.80,
    isManualDistance: true,
    createdAt: '2026-10-02T18:00:00Z',
  },
  {
    id: 'log-becky-2026-10-03',
    memberId: 'm-becky',
    memberName: 'Becky',
    date: '2026-10-03',
    steps: 12626,
    distanceKm: 10.30,
    distanceMiles: 6.4,
    strideLengthMeters: 0.80,
    isManualDistance: true,
    createdAt: '2026-10-03T18:00:00Z',
  },
  {
    id: 'log-becky-2026-10-04',
    memberId: 'm-becky',
    memberName: 'Becky',
    date: '2026-10-04',
    steps: 11667,
    distanceKm: 9.32,
    distanceMiles: 5.79,
    strideLengthMeters: 0.80,
    isManualDistance: true,
    createdAt: '2026-10-04T18:00:00Z',
  },

  // Adrian's entries
  {
    id: 'log-adrian-2026-10-01',
    memberId: 'm-adrian',
    memberName: 'Adrian',
    date: '2026-10-01',
    steps: 13822,
    distanceKm: 11.22,
    distanceMiles: 6.97,
    strideLengthMeters: 0.81,
    isManualDistance: true,
    notes: 'October Day 1 🚶‍♂️',
    createdAt: '2026-10-01T18:30:00Z',
  },
  {
    id: 'log-adrian-2026-10-02',
    memberId: 'm-adrian',
    memberName: 'Adrian',
    date: '2026-10-02',
    steps: 8870,
    distanceKm: 7.72,
    distanceMiles: 4.80,
    strideLengthMeters: 0.87,
    isManualDistance: true,
    createdAt: '2026-10-02T18:30:00Z',
  },
  {
    id: 'log-adrian-2026-10-03',
    memberId: 'm-adrian',
    memberName: 'Adrian',
    date: '2026-10-03',
    steps: 15945,
    distanceKm: 12.92,
    distanceMiles: 8.03,
    strideLengthMeters: 0.81,
    isManualDistance: true,
    createdAt: '2026-10-03T18:30:00Z',
  },
  {
    id: 'log-adrian-2026-10-04',
    memberId: 'm-adrian',
    memberName: 'Adrian',
    date: '2026-10-04',
    steps: 9241,
    distanceKm: 7.5,
    distanceMiles: 4.66,
    strideLengthMeters: 0.81,
    isManualDistance: true,
    createdAt: '2026-10-04T18:30:00Z',
  },
];

export const INITIAL_STATE: AppState = {
  members: INITIAL_MEMBERS,
  logs: INITIAL_LOGS,
  goal: {
    month: '2026-10',
    targetMiles: 100,
    targetKm: 160,
    title: "I'm walking 100 miles in October",
    fundraisingUrl: 'https://www.justgiving.com/fundraising/rebecca1790618451850',
  },
  unitPreference: 'mi',
};

class StorageService {
  async loadState(): Promise<AppState> {
    // 1. Try Netlify Functions API if available
    try {
      const response = await fetch(API_BASE, { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        if (data && data.members && data.logs) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // Netlify API not available in local dev or offline; fallback to localStorage
    }

    // 2. Try LocalStorage (preserves any registered walkers across updates)
    try {
      const keys = [STORAGE_KEY, 'pink_ribbon_walk_app_state_v2', 'pink_ribbon_walk_app_state_v1'];
      for (const k of keys) {
        const local = localStorage.getItem(k);
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.members && parsed.members.length > 0 && parsed.logs) {
            const merged: AppState = {
              members: parsed.members,
              logs: parsed.logs,
              goal: {
                ...INITIAL_STATE.goal,
                ...(parsed.goal || {}),
                title: INITIAL_STATE.goal.title,
                targetMiles: 100,
                targetKm: 160,
                fundraisingUrl: INITIAL_STATE.goal.fundraisingUrl,
              },
              unitPreference: parsed.unitPreference || 'mi',
            };
            this.saveToLocal(merged);
            return merged;
          }
        }
      }
    } catch (err) {
      console.warn('Could not parse localStorage state:', err);
    }

    // 3. Fallback to Initial State (only on first clean run)
    this.saveToLocal(INITIAL_STATE);
    return INITIAL_STATE;
  }

  async saveState(state: AppState): Promise<void> {
    this.saveToLocal(state);

    try {
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
    } catch {
      // Cloud sync failed or running offline
    }
  }

  private saveToLocal(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }

  resetToDefaults(): AppState {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('pink_ribbon_walk_app_state_v1');
    return INITIAL_STATE;
  }

  exportDataAsJSON(state: AppState): void {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pink_walk_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  exportLogsAsCSV(state: AppState): void {
    const headers = ['Date', 'Walker', 'Steps', 'Distance (km)', 'Distance (miles)', 'Stride (m)', 'Calculation Mode', 'Notes'];
    const rows = state.logs.map(log => [
      log.date,
      `"${log.memberName.replace(/"/g, '""')}"`,
      log.steps,
      log.distanceKm,
      log.distanceMiles,
      log.strideLengthMeters,
      log.isManualDistance ? 'Manual Override' : 'Calculated',
      `"${(log.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pink_walk_activity_report_${state.goal.month}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

export const storage = new StorageService();
