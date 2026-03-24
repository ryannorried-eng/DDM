export default function StepLayout({ title, subtitle, children }) {
  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
