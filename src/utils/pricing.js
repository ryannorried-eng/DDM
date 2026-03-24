import { INSULATION_OPTIONS, ROOF_STYLE_OPTIONS } from '../data/options.js';

// ── Pricing constants ──────────────────────────────────────────────────────
const BASE_RATE_PER_SQFT = 8;
const WALK_DOOR_COST     = 300;
const ROLLUP_DOOR_COST   = 800;
const WINDOW_COST        = 150;
const RANGE_VARIANCE     = 0.15; // ±15 %

export function calculateEstimate(config) {
  const { width, length, roofStyle, insulation, walkDoors, rollUpDoors, windows } = config;

  const w = Number(width)  || 0;
  const l = Number(length) || 0;

  const roofOption     = ROOF_STYLE_OPTIONS.find((r) => r.id === roofStyle);
  const roofMultiplier = roofOption?.multiplier ?? 1.0;

  const insulationOption = INSULATION_OPTIONS.find((i) => i.id === insulation);
  const insulationAdder  = insulationOption?.adder ?? 0;

  const squareFootBase = w * l * BASE_RATE_PER_SQFT;
  const roofAdjusted   = squareFootBase * roofMultiplier;
  const total =
    roofAdjusted +
    insulationAdder +
    (Number(walkDoors)   || 0) * WALK_DOOR_COST +
    (Number(rollUpDoors) || 0) * ROLLUP_DOOR_COST +
    (Number(windows)     || 0) * WINDOW_COST;

  const rangeLow  = Math.round(total * (1 - RANGE_VARIANCE));
  const rangeHigh = Math.round(total * (1 + RANGE_VARIANCE));

  return { total: Math.round(total), rangeLow, rangeHigh };
}
