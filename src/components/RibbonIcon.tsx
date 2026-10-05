import React from 'react';

interface RibbonIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const RibbonIcon: React.FC<RibbonIconProps> = ({
  className = "w-6 h-6",
  size,
  glow = false,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={`${className} ${glow ? 'drop-shadow-[0_0_8px_rgba(244,114,182,0.65)]' : ''}`}
      style={style}
    >
      <defs>
        <linearGradient id="ribbonGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="ribbonGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#db2777" />
          <stop offset="100%" stopColor="#9d174d" />
        </linearGradient>
        <filter id="ribbonShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#831843" floodOpacity="0.25" />
        </filter>
      </defs>
      
      {/* Right tail leg behind */}
      <path
        d="M 40 48 L 18 84 C 16.5 86.5 20.5 89 25 86 L 47 62"
        fill="url(#ribbonGradDark)"
        filter="url(#ribbonShadow)"
      />
      
      {/* Main body loop and left tail leg in front */}
      <path
        d="M 50 14 C 36 14 27 25 28 39 C 29 50 40 60 54 74 L 75 94 C 78.5 96.5 83 94 81 89 L 67 55 C 71.5 45 71.5 35 68 27 C 64 19 57.5 14 50 14 Z"
        fill="url(#ribbonGradLight)"
        filter="url(#ribbonShadow)"
      />
      
      {/* Inner cutout loop */}
      <path
        d="M 50 24 C 43.5 24 39.5 30 40.5 38 C 41.5 45 47 51 52 57 C 56.5 51 60.5 45 59.5 38 C 58.5 30 55.5 24 50 24 Z"
        fill="#ffffff"
        opacity="0.9"
      />
    </svg>
  );
};

export const RibbonBadge: React.FC<{ rank: number }> = ({ rank }) => {
  const getBadgeStyle = () => {
    switch (rank) {
      case 1:
        return 'from-amber-300 via-amber-400 to-yellow-500 text-amber-950 border-amber-200 shadow-amber-200';
      case 2:
        return 'from-slate-200 via-slate-300 to-slate-400 text-slate-800 border-slate-200 shadow-slate-200';
      case 3:
        return 'from-amber-600/30 via-orange-300 to-amber-700/40 text-amber-900 border-orange-200 shadow-orange-100';
      default:
        return 'from-pink-100 to-pink-200 text-pink-800 border-pink-200 shadow-pink-100';
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-bold rounded-full w-8 h-8 text-xs bg-gradient-to-br shadow-md border ${getBadgeStyle()}`}
    >
      #{rank}
    </div>
  );
};
