import { getEstimateBreakdown } from '../utils/pricing.js';
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

export default function EstimateBreakdown({ config, hasMinimumData }) {
  if (!hasMinimumData) return null;

  const { baseCost, roofAdjustment, insulationCost, openingsCost, total } =
    getEstimateBreakdown(config);

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
        Price Breakdown
      </p>
      <div>
        <Row label="Base building" value={formatCurrency(baseCost)} />
        <Row label="Roof style"    value={formatAdder(roofAdjustment)} />
        <Row
          label="Insulation"
          value={insulationCost === 0 ? 'None' : `+${formatCurrency(insulationCost)}`}
        />
        <Row
          label="Openings"
          value={openingsCost === 0 ? 'None' : `+${formatCurrency(openingsCost)}`}
        />
        <div className="border-t border-slate-100 my-1.5" />
        <Row label="Total" value={formatCurrency(total)} bold />
      </div>
    </div>
  );
}
