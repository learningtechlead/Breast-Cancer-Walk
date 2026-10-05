export type UnitPreference = 'km' | 'mi';

export interface TeamMember {
  id: string;
  name: string;
  avatarColor: string;
  strideLengthMeters: number; // default: 0.76m
  joinedAt: string;
}

export interface StepLog {
  id: string;
  memberId: string;
  memberName: string;
  date: string; // YYYY-MM-DD
  steps: number;
  distanceKm: number;
  distanceMiles: number;
  strideLengthMeters: number;
  isManualDistance: boolean;
  notes?: string;
  createdAt: string;
}

export interface MonthlyGoal {
  month: string; // YYYY-MM
  targetMiles: number; // 100
  targetKm: number; // 160
  title: string;
  fundraisingUrl: string;
}

export interface AppState {
  members: TeamMember[];
  logs: StepLog[];
  goal: MonthlyGoal;
  unitPreference: UnitPreference;
}

export type StridePreset = 'short' | 'average' | 'long' | 'custom';
