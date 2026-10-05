import React, { useState } from 'react';
import { X, UserPlus, Check, Sparkles, Pipette } from 'lucide-react';
import { TeamMember, StridePreset } from '../types';
import { STRIDE_PRESETS } from '../utils/calculator';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: Omit<TeamMember, 'id' | 'joinedAt'>) => void;
}

// Spectrum of curated vibrant tones
const SPECTRUM_PALETTE = [
  // Pinks & Roses
  { name: 'Rose Pink', hex: '#ec4899' },
  { name: 'Deep Pink', hex: '#db2777' },
  { name: 'Berry', hex: '#be185d' },
  { name: 'Bright Rose', hex: '#f43f5e' },
  { name: 'Crimson', hex: '#e11d48' },

  // Purples & Violets
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Indigo', hex: '#6366f1' },

  // Blues & Cyans
  { name: 'Ocean Blue', hex: '#0284c7' },
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Cyan', hex: '#06b6d4' },

  // Teals & Greens
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Lime', hex: '#84cc16' },

  // Ambers & Oranges
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Warm Orange', hex: '#f97316' },
];

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(SPECTRUM_PALETTE[0].hex);
  const [stridePreset, setStridePreset] = useState<StridePreset>('average');
  const [customStride, setCustomStride] = useState(0.76);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter the team member name.');
      return;
    }

    const stride = stridePreset === 'custom'
      ? customStride
      : STRIDE_PRESETS[stridePreset].meters;

    onAddMember({
      name: name.trim(),
      avatarColor: selectedColor,
      strideLengthMeters: stride,
    });

    setName('');
    setError('');
    onClose();
  };

  const initials = name.trim()
    ? name.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Add New Walker</h3>
              <p className="text-xs text-pink-100 font-medium">Add a teammate to the walking challenge</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {/* Name & Live Avatar Preview */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0 transition-colors"
              style={{ backgroundColor: selectedColor }}
              title="Live Avatar Preview"
            >
              {initials}
            </div>

            <div className="flex-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Teammate Name
              </label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jessica Miller"
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Avatar Color Picker with Spectrum & Custom Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Avatar Ribbon Tone (Spectrum)
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedColor.toUpperCase()}
              </span>
            </div>

            {/* Spectrum Palette Grid */}
            <div className="grid grid-cols-8 gap-2 mb-3">
              {SPECTRUM_PALETTE.map((item) => (
                <button
                  key={item.hex}
                  type="button"
                  onClick={() => setSelectedColor(item.hex)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all flex items-center justify-center ${
                    selectedColor.toLowerCase() === item.hex.toLowerCase()
                      ? 'ring-2 ring-offset-2 ring-slate-800 scale-110 shadow-sm'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: item.hex }}
                  title={item.name}
                >
                  {selectedColor.toLowerCase() === item.hex.toLowerCase() && (
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Color from Spectrum */}
            <div className="flex items-center gap-2.5 p-2 bg-pink-50/40 rounded-xl border border-pink-100">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-pink-200 shadow-2xs shrink-0 cursor-pointer">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-0 p-0"
                />
              </div>
              <div className="flex-1 text-xs">
                <span className="font-bold text-slate-700 block">Custom Spectrum Color</span>
                <span className="text-[11px] text-slate-500">Click the box to pick any color across the full color wheel</span>
              </div>
              <Pipette className="w-4 h-4 text-pink-500 shrink-0" />
            </div>
          </div>

          {/* Stride Setting */}
          <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Walking Stride Length
              </label>
              <span className="text-[11px] text-pink-600 font-semibold">For distance calculations</span>
            </div>

            <select
              value={stridePreset}
              onChange={(e) => setStridePreset(e.target.value as StridePreset)}
              className="w-full text-xs font-bold text-slate-700 bg-white border border-pink-200 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="average">Average Stride (~0.76 m / 30") - Recommended</option>
              <option value="short">Petite / Shorter Stride (~0.65 m / 25.5")</option>
              <option value="long">Longer Stride (~0.85 m / 33.5")</option>
              <option value="custom">Custom Stride Length</option>
            </select>

            {stridePreset === 'custom' && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-500">Stride in meters:</span>
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
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 shadow-md shadow-pink-600/30 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Join Team</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
