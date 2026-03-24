import { formatCurrency } from '../utils/format.js';

function formatAdder(value) {
  if (value > 0) return `+${formatCurrency(value)}`;
  if (value < 0) return `−${formatCurrency(Math.abs(value))}`;
  return 'Included';
}

function Row({ label, value, bold = false }) {
  return (
    <div className="flex items-center justify-between py-[3px]">
      <span className={`text-[11px] ${bold ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
        {label}
      </span>
      <span className={`text-[11px] tabular-nums ${bold ? 'font-semibold text-steel-800' : 'text-slate-700'}`}>
        {value}
      </span>
    </div>
  );
}

// Accepts the pre-computed breakdown object from useEstimate so the engine
// is never called a second time just to render this panel.
export default function EstimateBreakdown({ breakdown }) {
  if (!breakdown) return null;

  const { baseStructure, trim, roofAdjustment, insulation, openings, total } = breakdown;

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
        Price Breakdown
      </p>
      <div>
        <Row label="Base structure"  value={formatCurrency(baseStructure)} />
        <Row label="Trim"            value={formatAdder(trim)} />
        <Row label="Roof style"      value={formatAdder(roofAdjustment)} />
        <Row
          label="Insulation"
          value={insulation === 0 ? 'None' : `+${formatCurrency(insulation)}`}
        />
        <Row
          label="Openings"
          value={openings === 0 ? 'None' : `+${formatCurrency(openings)}`}
        />
        <div className="border-t border-slate-100 my-1.5" />
        <Row label="Total" value={formatCurrency(total)} bold />
      </div>
    </div>
  );
}
