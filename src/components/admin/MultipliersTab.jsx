import { useState, useEffect } from 'react';

function NumericField({ label, description, value, onChange, unit, step = '0.01' }) {
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
          step={step}
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

function TierRow({ tier, index, onUpdate }) {
  const [localVal, setLocalVal] = useState(String(tier.multiplier));

  useEffect(() => { setLocalVal(String(tier.multiplier)); }, [tier.multiplier]);

  const invalid = localVal === '' || isNaN(Number(localVal)) || Number(localVal) <= 0;

  function handleChange(e) {
    setLocalVal(e.target.value);
    const n = Number(e.target.value);
    if (e.target.value !== '' && !isNaN(n) && n > 0) {
      onUpdate(index, n);
    }
  }

  const SIZE_TIER_LABELS = {
    XS: 'Under 800 sq ft',
    S:  '800 – 1,999 sq ft',
    M:  '2,000 – 3,999 sq ft',
    L:  '4,000 – 7,999 sq ft',
    XL: '8,000+ sq ft',
  };

  return (
    <tr className="border-b border-slate-50 last:border-0">
      <td className="py-3 px-1">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-steel-100 text-steel-800">
          {tier.label}
        </span>
      </td>
      <td className="py-3 px-1 text-slate-600 text-xs">
        {SIZE_TIER_LABELS[tier.label] ?? tier.label}
      </td>
      <td className="py-3 px-1 text-right">
        <input
          type="number"
          min="0"
          step="0.01"
          value={localVal}
          onChange={handleChange}
          className={`w-24 rounded-lg border px-2 py-1 text-sm text-right tabular-nums shadow-sm focus:outline-none focus:ring-2 focus:ring-steel-500 transition-colors ${
            invalid
              ? 'border-red-400 bg-red-50 text-red-700'
              : 'border-slate-300 bg-white text-slate-800'
          }`}
          aria-label={`${tier.label} multiplier`}
        />
      </td>
    </tr>
  );
}

export default function MultipliersTab({ config, onChange, onSave, saving, saveStatus }) {
  const { sizeMultipliers, roofUpcharges } = config;

  function updateTier(index, val) {
    const updated = sizeMultipliers.map((t, i) =>
      i === index ? { ...t, multiplier: val } : t
    );
    onChange({ ...config, sizeMultipliers: updated });
  }

  function updateRoof(key, val) {
    onChange({ ...config, roofUpcharges: { ...roofUpcharges, [key]: val } });
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Size & Complexity Multipliers</h2>
        <p className="text-sm text-slate-500 mt-1">
          Size multipliers scale the base material cost. Roof upcharges are applied as a percentage of the adjusted material cost.
        </p>
      </div>

      {/* Size multipliers */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Building Size Multipliers
        </p>
        <p className="text-xs text-slate-500 mb-3">
          Applied to raw material cost. Larger buildings benefit from economies of scale.
        </p>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm min-w-[340px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Size</th>
                <th className="text-left py-2 px-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Range</th>
                <th className="text-right py-2 px-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Multiplier</th>
              </tr>
            </thead>
            <tbody>
              {sizeMultipliers.map((tier, i) => (
                <TierRow key={tier.label} tier={tier} index={i} onUpdate={updateTier} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Example: A 1,200 sqft building uses the <strong>S</strong> multiplier (1.20×), increasing materials by 20%.
          </p>
        </div>
      </div>

      {/* Roof upcharges */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Roof Style Upcharges
        </p>
        <p className="text-xs text-slate-500 mb-3">
          Percentage added to adjusted material cost for complex roof profiles. Enter as decimal (0.08 = 8%).
        </p>
        <NumericField
          label="Gambrel"
          description="Classic barn-style dual-pitch roof"
          value={roofUpcharges.gambrel}
          onChange={(v) => updateRoof('gambrel', v)}
          unit="rate"
          step="0.01"
        />
        <NumericField
          label="Mansard"
          description="High-sided roof for added headroom"
          value={roofUpcharges.mansard}
          onChange={(v) => updateRoof('mansard', v)}
          unit="rate"
          step="0.01"
        />
        <NumericField
          label="Gable"
          description="Traditional peaked roof (usually baseline)"
          value={roofUpcharges.gable}
          onChange={(v) => updateRoof('gable', v)}
          unit="rate"
          step="0.01"
        />
        <NumericField
          label="Single Slope"
          description="Modern single-direction pitch"
          value={roofUpcharges.single_slope}
          onChange={(v) => updateRoof('single_slope', v)}
          unit="rate"
          step="0.01"
        />

        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          {[
            { key: 'gambrel',      label: 'Gambrel' },
            { key: 'mansard',      label: 'Mansard' },
            { key: 'gable',        label: 'Gable' },
            { key: 'single_slope', label: 'Single Slope' },
          ].map(({ key, label }) => (
            <div key={key} className="text-xs text-slate-500">
              {label}:{' '}
              <span className="font-semibold text-steel-700 tabular-nums">
                +{(roofUpcharges[key] * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
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
