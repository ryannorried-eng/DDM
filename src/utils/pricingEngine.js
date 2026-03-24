// ── DDM Pricing Engine ──────────────────────────────────────────────────────
// All pricing reads through getPricingConfig() only — no scattered localStorage.
// Designed so getPricingConfig can be swapped for an API call with minimal refactor.

import { getPricingConfig } from './pricingConfig.js';

const VARIANCE_PERCENT = 12; // ±12% range

// ── Helpers ─────────────────────────────────────────────────────────────────

function getSizeMultiplier(sqft, tiers) {
  for (const tier of tiers) {
    if (sqft <= tier.maxSqft) return tier.multiplier;
  }
  // Fallback to last tier if none matched (e.g., Infinity edge case)
  return tiers[tiers.length - 1]?.multiplier ?? 1.0;
}

// ── Main export ─────────────────────────────────────────────────────────────

/**
 * calculateEstimate(buildingConfig)
 *
 * Accepts the configurator's state shape:
 *   { buildingUse, width, length, height, roofStyle,
 *     walkDoors, rollUpDoors, windows, insulation, finish, lead }
 *
 * Returns:
 *   { low, high, total, breakdown }
 */
export function calculateEstimate(buildingConfig) {
  const pricing = getPricingConfig();

  const {
    width,
    length,
    roofStyle,
    insulation,
    walkDoors,
    rollUpDoors,
    windows,
  } = buildingConfig;

  const w = Number(width)  || 0;
  const l = Number(length) || 0;
  const sqft      = w * l;
  const perimeter = 2 * (w + l);

  // ── Base material cost (raw, before size multiplier) ──────────────────────
  const matRatePerSqft =
    pricing.materials.steelPanel +
    pricing.materials.roofPanel  +
    pricing.materials.framing;

  const rawMaterialCost = sqft * matRatePerSqft;

  // ── Size/complexity multiplier ────────────────────────────────────────────
  const sizeMultiplier    = getSizeMultiplier(sqft, pricing.sizeMultipliers);
  const adjMaterialCost   = rawMaterialCost * sizeMultiplier;

  // ── Trim & foundation ─────────────────────────────────────────────────────
  const trimCost        = pricing.materials.trim * perimeter;
  const foundationCost  = pricing.materials.foundationPackage;

  // ── Base structure subtotal (before roof adjustment) ──────────────────────
  // baseStructure = material + foundation (trim is its own line)
  const baseStructure = adjMaterialCost + foundationCost;

  // ── Roof upcharge ─────────────────────────────────────────────────────────
  // Applied as a % of the adjusted material cost (not foundation or trim)
  const roofUpchargeRate  = pricing.roofUpcharges[roofStyle] ?? 0;
  const roofAdjustment    = adjMaterialCost * roofUpchargeRate;

  // ── Insulation ────────────────────────────────────────────────────────────
  const insulationRate    = pricing.insulation[insulation] ?? 0;
  const insulationCost    = insulationRate * sqft;

  // ── Openings ──────────────────────────────────────────────────────────────
  const openingsCost =
    (Number(walkDoors)   || 0) * pricing.openings.walkDoor   +
    (Number(rollUpDoors) || 0) * pricing.openings.rollUp10x10 +
    (Number(windows)     || 0) * pricing.openings.window;

  // ── Freight ───────────────────────────────────────────────────────────────
  // Zone is not captured in the current configurator — defaults to local ($0).
  // A future phase can add freightZone to the config state.
  const freight = pricing.freight.local ?? 0;

  // ── Subtotal & variance ───────────────────────────────────────────────────
  const subtotal =
    baseStructure +
    trimCost      +
    roofAdjustment +
    insulationCost +
    openingsCost  +
    freight;

  const low  = Math.round(subtotal * (1 - VARIANCE_PERCENT / 100));
  const high = Math.round(subtotal * (1 + VARIANCE_PERCENT / 100));

  return {
    low,
    high,
    total: Math.round(subtotal),
    breakdown: {
      squareFootage:   sqft,
      baseStructure:   Math.round(baseStructure),
      trim:            Math.round(trimCost),
      roofAdjustment:  Math.round(roofAdjustment),
      insulation:      Math.round(insulationCost),
      openings:        Math.round(openingsCost),
      freight,
      subtotal:        Math.round(subtotal),
      variancePercent: VARIANCE_PERCENT,
      total:           Math.round(subtotal),
    },
  };
}
