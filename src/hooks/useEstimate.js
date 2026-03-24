import { useMemo } from 'react';
import { calculateEstimate } from '../utils/pricingEngine.js';
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
        low:            0,
        high:           0,
        rangeLow:       0,
        rangeHigh:      0,
        formattedRange: '',
        sqft,
        hasMinimumData: false,
        breakdown:      null,
      };
    }

    const result = calculateEstimate(config);

    return {
      total:          result.total,
      low:            result.low,
      high:           result.high,
      rangeLow:       result.low,
      rangeHigh:      result.high,
      formattedRange: formatRange(result.low, result.high),
      sqft,
      hasMinimumData: true,
      breakdown:      result.breakdown,
    };
  }, [config]);
}
