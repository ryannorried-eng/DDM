export default function SummaryRow({ label, value, highlight = false }) {
  return (
    <div className={`flex items-start justify-between py-3 border-b border-slate-100 last:border-b-0 ${highlight ? 'font-semibold' : ''}`}>
      <span className={`text-sm ${highlight ? 'text-slate-800' : 'text-slate-500'}`}>{label}</span>
      <span className={`text-sm text-right ml-4 ${highlight ? 'text-steel-700' : 'text-slate-800'}`}>{value}</span>
    </div>
  );
}
