import { useMemo } from 'react';
import { calculateEstimate } from '../utils/pricing.js';
import { formatRange } from '../utils/format.js';
import { DIMENSION_CONSTRAINTS } from '../data/options.js';

function isValidDimension(value, key) {
  const n = Number(value);
  if (!n || isNaN(n)) return false;
  const { min, max } = DIMENSION_CONSTRAINTS[key];
  return n >= min && n <= max;
}

export function useEstimate(config) {
  return useMemo(() => {
    const { width, length, roofStyle } = config;

    const validWidth  = isValidDimension(width, 'width');
    const validLength = isValidDimension(length, 'length');
    const hasMinimumData = validWidth && validLength && Boolean(roofStyle);

    const sqft = (Number(width) || 0) * (Number(length) || 0);

    if (!hasMinimumData) {
      return {
        total:          0,
        rangeLow:       0,
        rangeHigh:      0,
        formattedRange: '',
        sqft,
        hasMinimumData: false,
      };
    }

    const { total, rangeLow, rangeHigh } = calculateEstimate(config);

    return {
      total,
      rangeLow,
      rangeHigh,
      formattedRange: formatRange(rangeLow, rangeHigh),
      sqft,
      hasMinimumData: true,
    };
  }, [config]);
}
