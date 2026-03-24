import { INSULATION_OPTIONS, ROOF_STYLE_OPTIONS } from '../data/options.js';

export function calculateEstimate(config) {
  const { width, length, roofStyle, insulation, walkDoors, rollUpDoors, windows } = config;

  const w = Number(width) || 0;
  const l = Number(length) || 0;

  const roofOption = ROOF_STYLE_OPTIONS.find((r) => r.id === roofStyle);
  const roofMultiplier = roofOption?.multiplier ?? 1.0;

  const insulationOption = INSULATION_OPTIONS.find((i) => i.id === insulation);
  const insulationAdder = insulationOption?.adder ?? 0;

  const squareFootBase = w * l * 8;
  const roofAdjusted   = squareFootBase * roofMultiplier;
  const total =
    roofAdjusted +
    insulationAdder +
    (Number(walkDoors)   || 0) * 300 +
    (Number(rollUpDoors) || 0) * 800 +
    (Number(windows)     || 0) * 150;

  const rangeLow  = Math.round(total * 0.85);
  const rangeHigh = Math.round(total * 1.15);

  return { total: Math.round(total), rangeLow, rangeHigh };
}
