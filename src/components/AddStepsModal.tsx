import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RibbonIcon } from './RibbonIcon';
import { X, Calendar, Footprints, Calculator, Plus, Check } from 'lucide-react';
import { TeamMember, StepLog, StridePreset, UnitPreference } from '../types';
import {
  STRIDE_PRESETS,
  calculateDistance,
  manualDistanceConversion,
  formatDistance,
} from '../utils/calculator';

interface AddStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  initialMemberId?: string;
  unit: UnitPreference;
  onSaveLog: (log: Omit<StepLog, 'id' | 'createdAt'>) => void;
  onOpenAddUser: () => void;
}

export const AddStepsModal: React.FC<AddStepsModalProps> = ({
  isOpen,
  onClose,
  members,
  initialMemberId,
  unit,
  onSaveLog,
  onOpenAddUser,
}) => {
  // Form State
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [steps, setSteps] = useState<string>('5000');
  const [isManualDistance, setIsManualDistance] = useState<boolean>(false);
  const [manualDistance, setManualDistance] = useState<string>('');
  const [manualUnit, setManualUnit] = useState<UnitPreference>(unit);
  const [stridePreset, setStridePreset] = useState<StridePreset>('average');
  const [customStride, setCustomStride] = useState<number>(0.76);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Pre-fill or sync selected member
  useEffect(() => {
    if (initialMemberId && members.some(m => m.id === initialMemberId)) {
      setSelectedMemberId(initialMemberId);
    } else if (members.length > 0 && !selectedMemberId) {
      setSelectedMemberId(members[0].id);
    }
  }, [initialMemberId, members, selectedMemberId]);

  // Sync stride with member's saved stride
  useEffect(() => {
    const member = members.find(m => m.id === selectedMemberId);
    if (member) {
      setCustomStride(member.strideLengthMeters);
    }
  }, [selectedMemberId, members]);

  if (!isOpen) return null;

  const currentStrideMeters = stridePreset === 'custom'
    ? customStride
    : STRIDE_PRESETS[stridePreset].meters;

  const numSteps = parseInt(steps, 10) || 0;

  // Live calculated distance
  const calculated = calculateDistance(numSteps, currentStrideMeters);

  // Effective distance to save
  const effectiveDistance = isManualDistance && manualDistance
    ? manualDistanceConversion(parseFloat(manualDistance) || 0, manualUnit)
    : calculated;

  const handleQuickAddSteps = (amount: number) => {
    const current = parseInt(steps, 10) || 0;
    setSteps(String(current + amount));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedMemberId) {
      setError('Please select or add a team member.');
      return;
    }

    if (numSteps <= 0) {
      setError('Please enter a valid step count (greater than 0).');
      return;
    }

    const selectedMember = members.find(m => m.id === selectedMemberId);
    if (!selectedMember) {
      setError('Selected team member not found.');
      return;
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#ffffff', '#fbbf24', '#fbcfe8'],
      });
    } catch {
      // Confetti fallback
    }

    onSaveLog({
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      date,
      steps: numSteps,
      distanceKm: effectiveDistance.km,
      distanceMiles: effectiveDistance.miles,
      strideLengthMeters: currentStrideMeters,
      isManualDistance,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <RibbonIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Add My Steps</h3>
              <p className="text-xs text-pink-100 font-medium">Record daily steps & distance for the team</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {/* 1. Walker Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Walker Name
              </label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddUser();
                }}
                className="text-xs font-bold text-pink-600 hover:text-pink-700 inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Walker
              </button>
            </div>

            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Date Picker */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Date Walked
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              />
              <Calendar className="w-4 h-4 text-pink-500 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 3. Step Count Input & Quick Increments */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-pink-500" />
                Number of Steps
              </label>
              <span className="text-xs text-slate-400 font-medium">Daily total</span>
            </div>

            <div className="relative">
              <input
                type="number"
                min="1"
                max="150000"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="e.g. 8500"
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 text-slate-900 font-extrabold text-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all text-center tracking-wide"
              />
            </div>

            {/* Quick Increment Buttons */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[1000, 2500, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAddSteps(amt)}
                  className="py-1 px-2 text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-lg border border-pink-200 active:scale-95 transition-all"
                >
                  +{amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Distance Mode: Auto-Calculate vs Manual */}
          <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-pink-600" />
                Distance Calculation
              </span>

              {/* Toggle Mode */}
              <div className="flex items-center gap-1 text-[11px] font-bold bg-white p-0.5 rounded-lg border border-pink-200">
                <button
                  type="button"
                  onClick={() => setIsManualDistance(false)}
                  className={`px-2 py-1 rounded-md transition-all ${
                    !isManualDistance ? 'bg-pink-600 text-white shadow-2xs' : 'text-slate-500 hover:text-pink-600'
                  }`}
                >
                  Auto-Calculate
                </button>
                <button
                  type="button"
                  onClick={() => setIsManualDistance(true)}
                  className={`px-2 py-1 rounded-md transition-all ${
                    isManualDistance ? 'bg-pink-600 text-white shadow-2xs' : 'text-slate-500 hover:text-pink-600'
                  }`}
                >
                  Manual Distance
                </button>
              </div>
            </div>

            {/* Automatic Calculator Mode */}
            {!isManualDistance ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Stride Preset:</span>
                  <select
                    value={stridePreset}
                    onChange={(e) => setStridePreset(e.target.value as StridePreset)}
                    className="text-xs font-bold text-pink-700 bg-white border border-pink-200 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value="average">Average Stride (0.76m / 30")</option>
                    <option value="short">Petite (0.65m / 25.5")</option>
                    <option value="long">Longer (0.85m / 33.5")</option>
                    <option value="custom">Custom Stride</option>
                  </select>
                </div>

                {stridePreset === 'custom' && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500">Stride in meters:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.4"
                      max="1.5"
                      value={customStride}
                      onChange={(e) => setCustomStride(parseFloat(e.target.value) || 0.76)}
                      className="w-24 px-2 py-1 text-xs border rounded-lg"
                    />
                  </div>
                )}

                {/* Live Distance Output Display */}
                <div className="bg-white rounded-xl p-3 border border-pink-200/80 flex items-center justify-around text-center shadow-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Kilometers</span>
                    <span className="text-lg font-black text-pink-600">{formatDistance(calculated.km)} km</span>
                  </div>
                  <div className="w-px h-8 bg-pink-100" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Miles</span>
                    <span className="text-lg font-black text-slate-800">{formatDistance(calculated.miles)} mi</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Manual Distance Override Mode */
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={manualDistance}
                    onChange={(e) => setManualDistance(e.target.value)}
                    placeholder="Enter distance (e.g. 5.2)"
                    className="flex-1 px-3 py-2 text-sm font-bold border border-pink-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <div className="flex bg-white rounded-xl border border-pink-200 p-0.5 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setManualUnit('km')}
                      className={`px-3 py-1.5 rounded-lg ${manualUnit === 'km' ? 'bg-pink-600 text-white' : 'text-slate-600'}`}
                    >
                      KM
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualUnit('mi')}
                      className={`px-3 py-1.5 rounded-lg ${manualUnit === 'mi' ? 'bg-pink-600 text-white' : 'text-slate-600'}`}
                    >
                      Miles
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Great for treadmill or GPS watch tracking (Fitbit, Apple Watch, Garmin).
                </p>
              </div>
            )}
          </div>

          {/* 5. Optional Note */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Morning team walk in the park 🌸"
              maxLength={80}
              className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-md shadow-pink-600/30 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Record Steps</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
