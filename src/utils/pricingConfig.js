// ── DDM Pricing Configuration Helper ───────────────────────────────────────
// Manages admin-editable pricing config via localStorage.
// Structure is designed for easy migration to backend storage later.

const STORAGE_KEY = 'ddm_pricing_config';
const CURRENT_VERSION = 1;

export const DEFAULT_CONFIG = {
  version: CURRENT_VERSION,
  updatedAt: null,
  materials: {
    steelPanel: 4.20,        // $ per sqft
    roofPanel: 3.80,         // $ per sqft
    framing: 6.50,           // $ per sqft
    trim: 8.00,              // $ per linear ft
    foundationPackage: 1200, // $ flat
  },
  insulation: {
    none: 0,        // $ per sqft
    basic: 1.10,    // $ per sqft  (2" single layer)
    standard: 1.95, // $ per sqft  (4" double layer)
    premium: 2.45,  // $ per sqft  (6" premium)
  },
  openings: {
    walkDoor: 320,
    rollUp10x10: 1100,
    rollUp12x14: 1450,
    slidingBarnDoor: 890,
    window: 280,
    skylight: 420,
  },
  roofUpcharges: {
    gambrel: 0.08,       // +8% of adjusted material cost
    mansard: 0.12,       // +12% of adjusted material cost
    single_slope: 0,
    gable: 0,
  },
  sizeMultipliers: [
    { label: 'XS', maxSqft: 799,      multiplier: 1.35 },
    { label: 'S',  maxSqft: 1999,     multiplier: 1.20 },
    { label: 'M',  maxSqft: 3999,     multiplier: 1.10 },
    { label: 'L',  maxSqft: 7999,     multiplier: 1.00 },
    { label: 'XL', maxSqft: Infinity, multiplier: 0.92 },
  ],
  freight: {
    local: 0,
    zone1: 850,
    zone2: 1600,
    zone3: 2800,
    zone4CallForFreight: true,
  },
};

// ── Validation ──────────────────────────────────────────────────────────────

function isPositiveNumber(v) {
  return typeof v === 'number' && isFinite(v) && v >= 0;
}

function validateConfig(cfg) {
  if (!cfg || typeof cfg !== 'object') return false;
  if (cfg.version !== CURRENT_VERSION) return false;

  const { materials, insulation, openings, roofUpcharges, sizeMultipliers, freight } = cfg;

  // Materials
  if (!materials) return false;
  const matKeys = ['steelPanel', 'roofPanel', 'framing', 'trim', 'foundationPackage'];
  if (matKeys.some((k) => !isPositiveNumber(materials[k]))) return false;

  // Insulation
  if (!insulation) return false;
  const insKeys = ['none', 'basic', 'standard', 'premium'];
  if (insKeys.some((k) => !isPositiveNumber(insulation[k]))) return false;

  // Openings
  if (!openings) return false;
  const openKeys = ['walkDoor', 'rollUp10x10', 'rollUp12x14', 'slidingBarnDoor', 'window', 'skylight'];
  if (openKeys.some((k) => !isPositiveNumber(openings[k]))) return false;

  // Roof upcharges
  if (!roofUpcharges) return false;
  const roofKeys = ['gambrel', 'mansard', 'single_slope', 'gable'];
  if (roofKeys.some((k) => !isPositiveNumber(roofUpcharges[k]))) return false;

  // Size multipliers
  if (!Array.isArray(sizeMultipliers) || sizeMultipliers.length === 0) return false;
  if (sizeMultipliers.some((t) => !isPositiveNumber(t.multiplier) || !t.label)) return false;

  // Freight
  if (!freight) return false;
  if (!isPositiveNumber(freight.local)) return false;
  if (!isPositiveNumber(freight.zone1)) return false;
  if (!isPositiveNumber(freight.zone2)) return false;
  if (!isPositiveNumber(freight.zone3)) return false;

  return true;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns the current pricing config from localStorage.
 * Seeds defaults automatically on first call.
 */
export function getPricingConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = { ...DEFAULT_CONFIG, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!validateConfig(parsed)) {
      // Corrupt or outdated — fall back to defaults and reseed
      const seeded = { ...DEFAULT_CONFIG, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch {
    return { ...DEFAULT_CONFIG, updatedAt: new Date().toISOString() };
  }
}

/**
 * Validates and saves a new pricing config to localStorage.
 * Returns { ok: true } or { ok: false, error: string }.
 */
export function savePricingConfig(cfg) {
  const withMeta = { ...cfg, version: CURRENT_VERSION, updatedAt: new Date().toISOString() };
  if (!validateConfig(withMeta)) {
    return { ok: false, error: 'Invalid pricing config — check for missing or negative values.' };
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withMeta));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: `Storage error: ${e.message}` };
  }
}

/**
 * Resets pricing config to factory defaults.
 */
export function resetPricingConfig() {
  const seeded = { ...DEFAULT_CONFIG, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}
