import { StridePreset } from '../types';

export const STRIDE_PRESETS: Record<StridePreset, { label: string; meters: number; description: string }> = {
  short: {
    label: 'Petite / Shorter Stride',
    meters: 0.65,
    description: '~0.65 m (25.5 in) — typical for height under 5\'3" (160 cm)',
  },
  average: {
    label: 'Average Stride (Recommended)',
    meters: 0.76,
    description: '~0.76 m (30.0 in) — standard walking stride length',
  },
  long: {
    label: 'Longer Stride',
    meters: 0.85,
    description: '~0.85 m (33.5 in) — typical for height over 5\'10" (178 cm)',
  },
  custom: {
    label: 'Custom Stride',
    meters: 0.76,
    description: 'Set your own measured stride length',
  },
};

const KM_TO_MILES = 0.621371;

/**
 * Calculates distance in kilometers and miles given steps and stride length in meters.
 */
export function calculateDistance(steps: number, strideMeters: number): { km: number; miles: number } {
  if (steps <= 0 || strideMeters <= 0) {
    return { km: 0, miles: 0 };
  }
  const totalMeters = steps * strideMeters;
  const km = totalMeters / 1000;
  const miles = km * KM_TO_MILES;
  return {
    km: Math.round(km * 100) / 100,
    miles: Math.round(miles * 100) / 100,
  };
}

/**
 * Converts a manual distance (in km or mi) to both units.
 */
export function manualDistanceConversion(distance: number, unit: 'km' | 'mi'): { km: number; miles: number } {
  if (distance <= 0) return { km: 0, miles: 0 };
  if (unit === 'km') {
    return {
      km: Math.round(distance * 100) / 100,
      miles: Math.round(distance * KM_TO_MILES * 100) / 100,
    };
  } else {
    return {
      km: Math.round((distance / KM_TO_MILES) * 100) / 100,
      miles: Math.round(distance * 100) / 100,
    };
  }
}

/**
 * Formats a number with comma separators.
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(Math.round(num));
}

/**
 * Formats a decimal distance to 1 or 2 decimal places.
 */
export function formatDistance(distance: number): string {
  return distance.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
}
