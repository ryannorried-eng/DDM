import { calculateEstimate } from '../utils/pricingEngine.js';
import { formatRange, formatCurrency } from '../utils/format.js';
import SummaryRow from '../components/SummaryRow.jsx';
import {
  BUILDING_USE_OPTIONS,
  ROOF_STYLE_OPTIONS,
  INSULATION_OPTIONS,
  FINISH_OPTIONS,
} from '../data/options.js';

function labelFor(options, id) {
  return options.find((o) => o.id === id)?.label ?? id;
}

function BreakdownRow({ label, value, note, bold = false, indent = false }) {
  return (
    <div className={`flex items-center justify-between py-2 border-b border-slate-50 last:border-0 ${indent ? 'pl-3' : ''}`}>
      <span className={`text-sm ${bold ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
        {label}
        {note && <span className="ml-1.5 text-xs text-slate-400 font-normal">{note}</span>}
      </span>
      <span className={`text-sm tabular-nums ${bold ? 'font-bold text-steel-800' : 'text-slate-700'}`}>
        {value}
      </span>
    </div>
  );
}

export default function EstimateSummaryStep({ config, onRestart }) {
  const { low, high, breakdown } = calculateEstimate(config);
  const {
    squareFootage,
    baseStructure,
    trim,
    roofAdjustment,
    insulation: insulationCost,
    openings: openingsCost,
    freight,
    subtotal,
    variancePercent,
  } = breakdown;

  const sqft = (Number(config.width) || 0) * (Number(config.length) || 0);
  const finishOption = FINISH_OPTIONS.find((f) => f.id === config.finish);

  const openings = [];
  if (config.walkDoors > 0)   openings.push(`${config.walkDoors} walk door${config.walkDoors > 1 ? 's' : ''}`);
  if (config.rollUpDoors > 0) openings.push(`${config.rollUpDoors} roll-up door${config.rollUpDoors > 1 ? 's' : ''}`);
  if (config.windows > 0)     openings.push(`${config.windows} window${config.windows > 1 ? 's' : ''}`);

  const hasRoofAdj = roofAdjustment !== 0;

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-steel-100 mb-4">
          <svg className="w-8 h-8 text-steel-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Your Ballpark Estimate</h2>
        <p className="text-slate-500 mt-1 text-sm">
          Thanks, <span className="font-medium text-slate-700">{config.lead?.name}</span>! Here's what we came up with.
        </p>
      </div>

      {/* Estimate card */}
      <div className="bg-gradient-to-br from-steel-800 to-steel-900 rounded-2xl p-6 text-white mb-6 shadow-xl">
        <p className="text-steel-200 text-sm font-medium uppercase tracking-widest mb-2">Estimated Range</p>
        <p className="text-3xl sm:text-4xl font-bold tracking-tight">
          {formatRange(low, high)}
        </p>
        <p className="text-steel-300 text-xs mt-3 leading-relaxed">
          ±{variancePercent}% variance applied · {squareFootage.toLocaleString()} sq ft · Preliminary estimate only.
        </p>
      </div>

      {/* Line-item breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Cost Breakdown
        </h3>
        <BreakdownRow label="Base structure"  value={formatCurrency(baseStructure)} />
        <BreakdownRow label="Trim package"    value={`+${formatCurrency(trim)}`} />
        {hasRoofAdj && (
          <BreakdownRow
            label={`${labelFor(ROOF_STYLE_OPTIONS, config.roofStyle)} roof upcharge`}
            value={`+${formatCurrency(roofAdjustment)}`}
          />
        )}
        {insulationCost > 0 && (
          <BreakdownRow
            label={`Insulation — ${labelFor(INSULATION_OPTIONS, config.insulation)}`}
            value={`+${formatCurrency(insulationCost)}`}
          />
        )}
        {openingsCost > 0 && (
          <BreakdownRow
            label="Doors & windows"
            note={openings.join(', ')}
            value={`+${formatCurrency(openingsCost)}`}
          />
        )}
        {freight > 0 && (
          <BreakdownRow label="Freight" value={`+${formatCurrency(freight)}`} />
        )}
        <div className="border-t border-slate-200 mt-2 pt-2">
          <BreakdownRow label="Subtotal" value={formatCurrency(subtotal)} bold />
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Estimate range: {formatCurrency(low)} – {formatCurrency(high)} (±{variancePercent}%)
        </p>
      </div>

      {/* Configuration summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Configuration Summary
        </h3>
        <SummaryRow label="Building Use"      value={labelFor(BUILDING_USE_OPTIONS, config.buildingUse)} />
        <SummaryRow label="Dimensions"         value={`${config.width} × ${config.length} × ${config.height} ft`} />
        <SummaryRow label="Square Footage"     value={`${sqft.toLocaleString()} sq ft`} />
        <SummaryRow label="Roof Style"         value={labelFor(ROOF_STYLE_OPTIONS, config.roofStyle)} />
        <SummaryRow
          label="Openings"
          value={openings.length > 0 ? openings.join(', ') : 'None'}
        />
        <SummaryRow label="Insulation"         value={labelFor(INSULATION_OPTIONS, config.insulation)} />
        <SummaryRow
          label="Exterior Finish"
          value={
            <span className="flex items-center gap-2 justify-end">
              {finishOption && (
                <span
                  className="w-4 h-4 rounded inline-block border border-black/10 flex-shrink-0"
                  style={{ backgroundColor: finishOption.hex }}
                  aria-hidden="true"
                />
              )}
              {labelFor(FINISH_OPTIONS, config.finish)}
            </span>
          }
        />
      </div>

      {/* Contact confirmation */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-900">Estimate sent to {config.lead?.email}</p>
            <p className="text-xs text-blue-700 mt-0.5">
              A representative will follow up within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* CTA footer */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
        <p className="text-sm text-slate-700 font-medium">
          Questions? Call us directly:
        </p>
        <a
          href="tel:5550000000"
          className="text-xl font-bold text-steel-700 hover:text-steel-900 transition-colors"
        >
          (555) 000-0000
        </a>
        <p className="text-xs text-slate-400 mt-1">Mon–Fri, 8am–5pm CT</p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-4 btn-secondary text-xs"
        >
          Start a New Configuration
        </button>
      </div>
    </div>
  );
}
