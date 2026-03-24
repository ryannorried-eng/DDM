import { useState, useEffect } from 'react';

function PriceField({ label, description, value, onChange, unit = '$ each' }) {
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
          step="1"
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

const INSULATION_LABELS = {
  none:     { label: 'None',            desc: 'No insulation — base option' },
  basic:    { label: 'Basic (2")',       desc: 'Single layer — mild climates' },
  standard: { label: 'Standard (4")',   desc: 'Double layer — year-round comfort' },
  premium:  { label: 'Premium (6")',    desc: 'Maximum energy efficiency' },
};

export default function AddOnsTab({ config, onChange, onSave, saving, saveStatus }) {
  const { insulation, openings } = config;

  function updateInsulation(key, val) {
    onChange({ ...config, insulation: { ...insulation, [key]: val } });
  }

  function updateOpening(key, val) {
    onChange({ ...config, openings: { ...openings, [key]: val } });
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Add-On Pricing</h2>
        <p className="text-sm text-slate-500 mt-1">
          Per-unit costs for insulation levels and building openings.
        </p>
      </div>

      {/* Insulation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Insulation (per sq ft)
        </p>
        <p className="text-xs text-slate-500 mb-3">
          Rate multiplied by total floor square footage of the building.
        </p>
        {Object.entries(INSULATION_LABELS).map(([key, { label, desc }]) => (
          <PriceField
            key={key}
            label={label}
            description={desc}
            value={insulation[key]}
            onChange={(v) => updateInsulation(key, v)}
            unit="$/sqft"
          />
        ))}
      </div>

      {/* Openings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Doors & Windows (per unit)
        </p>
        <p className="text-xs text-slate-500 mb-3">
          Walk doors and 10×10 roll-ups are used in configurator estimates. Others shown for reference.
        </p>
        <PriceField
          label="Walk Door"
          description="Standard 3×7 personnel door — used in configurator"
          value={openings.walkDoor}
          onChange={(v) => updateOpening('walkDoor', v)}
        />
        <PriceField
          label="Roll-Up Door 10×10"
          description="Standard overhead door — used in configurator"
          value={openings.rollUp10x10}
          onChange={(v) => updateOpening('rollUp10x10', v)}
        />
        <PriceField
          label="Roll-Up Door 12×14"
          description="Large overhead door — reference pricing"
          value={openings.rollUp12x14}
          onChange={(v) => updateOpening('rollUp12x14', v)}
        />
        <PriceField
          label="Sliding Barn Door"
          description="Full-width sliding door — reference pricing"
          value={openings.slidingBarnDoor}
          onChange={(v) => updateOpening('slidingBarnDoor', v)}
        />
        <PriceField
          label="Window"
          description="Standard framed window — used in configurator"
          value={openings.window}
          onChange={(v) => updateOpening('window', v)}
        />
        <PriceField
          label="Skylight"
          description="Roof-mounted skylight — reference pricing"
          value={openings.skylight}
          onChange={(v) => updateOpening('skylight', v)}
        />
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
