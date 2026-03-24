import { useState, useEffect } from 'react';

function ZoneField({ label, description, value, onChange, callForFreight = false }) {
  const [localVal, setLocalVal] = useState(String(value));

  // Sync when parent resets config
  useEffect(() => { setLocalVal(String(value)); }, [value]);
  const invalid =
    !callForFreight &&
    (localVal === '' || isNaN(Number(localVal)) || Number(localVal) < 0);

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
      {callForFreight ? (
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700">
            Call for Quote
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-slate-400">$ flat</span>
          <input
            type="number"
            min="0"
            step="50"
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
      )}
    </div>
  );
}

export default function FreightTab({ config, onChange, onSave, saving, saveStatus }) {
  const { freight } = config;

  function update(key, val) {
    onChange({ ...config, freight: { ...freight, [key]: val } });
  }

  function toggleZone4(e) {
    onChange({ ...config, freight: { ...freight, zone4CallForFreight: e.target.checked } });
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Freight & Delivery</h2>
        <p className="text-sm text-slate-500 mt-1">
          Flat-rate freight costs by delivery zone. Currently defaults to Local ($0) in all estimates — zone selection will be added in a future configurator update.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Zone Rates
        </p>

        <ZoneField
          label="Local"
          description="Within service area — no freight charge"
          value={freight.local}
          onChange={(v) => update('local', v)}
        />
        <ZoneField
          label="Zone 1"
          description="Short haul — up to ~150 miles"
          value={freight.zone1}
          onChange={(v) => update('zone1', v)}
        />
        <ZoneField
          label="Zone 2"
          description="Mid-range haul — 150–300 miles"
          value={freight.zone2}
          onChange={(v) => update('zone2', v)}
        />
        <ZoneField
          label="Zone 3"
          description="Long haul — 300–500 miles"
          value={freight.zone3}
          onChange={(v) => update('zone3', v)}
        />

        {/* Zone 4 toggle */}
        <div className="flex items-start justify-between gap-4 py-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800">Zone 4</p>
            <p className="text-xs text-slate-500 mt-0.5">Extended haul — 500+ miles (always quoted separately)</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-slate-500">Call-for-freight</span>
            <button
              type="button"
              role="switch"
              aria-checked={freight.zone4CallForFreight}
              onClick={() => onChange({ ...config, freight: { ...freight, zone4CallForFreight: !freight.zone4CallForFreight } })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-steel-500 focus:ring-offset-2 ${
                freight.zone4CallForFreight ? 'bg-steel-700' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  freight.zone4CallForFreight ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-900">How freight is applied</p>
            <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
              Freight rates are stored here for reference and future use. The configurator currently defaults all estimates to <strong>Local ($0)</strong>. When zone selection is added to the configurator, these rates will apply automatically.
            </p>
          </div>
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
