import { useState, useEffect } from 'react';
import { savePricingConfig } from '../../utils/pricingConfig.js';

function NumericField({ label, description, value, onChange, unit }) {
  const [localVal, setLocalVal] = useState(String(value));

  // Sync when parent resets config
  useEffect(() => { setLocalVal(String(value)); }, [value]);

  const invalid = localVal === '' || isNaN(Number(localVal)) || Number(localVal) < 0;

  function handleChange(e) {
    setLocalVal(e.target.value);
    const n = Number(e.target.value);
    if (e.target.value !== '' && !isNaN(n) && n >= 0) {
      onChange(n);
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-slate-400">{unit}</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={localVal}
          onChange={handleChange}
          className={`w-28 rounded-lg border px-3 py-1.5 text-sm text-right tabular-nums shadow-sm focus:outline-none focus:ring-2 focus:ring-steel-500 focus:ring-offset-0 transition-colors ${
            invalid
              ? 'border-red-400 bg-red-50 text-red-700 focus:border-red-400 focus:ring-red-400'
              : 'border-slate-300 bg-white text-slate-800'
          }`}
          aria-label={label}
        />
      </div>
    </div>
  );
}

export default function MaterialCostsTab({ config, onChange, onSave, saving, saveStatus }) {
  const { materials } = config;

  function update(key, val) {
    onChange({ ...config, materials: { ...materials, [key]: val } });
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Base Material Costs</h2>
        <p className="text-sm text-slate-500 mt-1">
          Per-unit rates applied to every estimate. Changes take effect immediately.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Per Square Foot
        </p>
        <NumericField
          label="Steel Panel"
          description="Exterior steel panel material cost"
          value={materials.steelPanel}
          onChange={(v) => update('steelPanel', v)}
          unit="$/sqft"
        />
        <NumericField
          label="Roof Panel"
          description="Roofing steel panel material cost"
          value={materials.roofPanel}
          onChange={(v) => update('roofPanel', v)}
          unit="$/sqft"
        />
        <NumericField
          label="Structural Framing"
          description="Steel framing and structural members"
          value={materials.framing}
          onChange={(v) => update('framing', v)}
          unit="$/sqft"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Other
        </p>
        <NumericField
          label="Trim Package"
          description="Fascia, trim, and finishing per linear foot of perimeter"
          value={materials.trim}
          onChange={(v) => update('trim', v)}
          unit="$/lin ft"
        />
        <NumericField
          label="Foundation Package"
          description="Flat per-project foundation allowance"
          value={materials.foundationPackage}
          onChange={(v) => update('foundationPackage', v)}
          unit="$ flat"
        />
      </div>

      {/* Rate summary */}
      <div className="bg-steel-50 border border-steel-100 rounded-xl px-5 py-3 mb-6">
        <p className="text-xs text-steel-700 font-medium">
          Combined material rate:{' '}
          <span className="font-bold tabular-nums">
            ${(materials.steelPanel + materials.roofPanel + materials.framing).toFixed(2)}/sqft
          </span>
          <span className="text-steel-500 ml-1">(steel + roof + framing)</span>
        </p>
      </div>

      {/* Save */}
      <div className="flex items-center justify-between pt-2">
        {saveStatus && (
          <p className={`text-sm font-medium ${saveStatus.ok ? 'text-green-600' : 'text-red-600'}`}>
            {saveStatus.ok ? '✓ Saved successfully' : `✗ ${saveStatus.error}`}
          </p>
        )}
        {!saveStatus && <span />}
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
