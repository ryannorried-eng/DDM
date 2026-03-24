import StepLayout from '../components/StepLayout.jsx';
import NavigationButtons from '../components/NavigationButtons.jsx';
import { OPENINGS_CONSTRAINTS } from '../data/options.js';

const OPENINGS = [
  {
    key: 'walkDoors',
    label: 'Walk Doors',
    description: 'Standard man-door entry points',
    icon: '🚪',
    cost: '$300 each',
    ...OPENINGS_CONSTRAINTS.walkDoors,
  },
  {
    key: 'rollUpDoors',
    label: 'Roll-Up Doors',
    description: 'Overhead garage / bay doors',
    icon: '🏗',
    cost: '$800 each',
    ...OPENINGS_CONSTRAINTS.rollUpDoors,
  },
  {
    key: 'windows',
    label: 'Windows',
    description: 'Standard fixed or sliding windows',
    icon: '🪟',
    cost: '$150 each',
    ...OPENINGS_CONSTRAINTS.windows,
  },
];

function Stepper({ value, onChange, min, max, label }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-9 w-9 rounded-full border border-slate-300 bg-white text-slate-700 text-lg font-bold flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-steel-500"
        aria-label={`Decrease ${label}`}
      >
        −
      </button>
      <span
        className="w-8 text-center text-xl font-bold text-slate-800 tabular-nums"
        aria-live="polite"
        aria-label={`${label}: ${value}`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-9 w-9 rounded-full border border-slate-300 bg-white text-slate-700 text-lg font-bold flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-steel-500"
        aria-label={`Increase ${label}`}
      >
        +
      </button>
    </div>
  );
}

export default function OpeningsStep({ config, onUpdate, onNext, onBack }) {
  return (
    <StepLayout
      title="Doors & Windows"
      subtitle="Select the number of each opening type. You can always refine this later."
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        {OPENINGS.map(({ key, label, description, icon, cost, min, max }) => {
          const value = config[key] ?? 0;
          return (
            <div key={key} className="flex items-center justify-between px-5 py-4 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">{icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500 truncate">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="hidden sm:block text-xs text-steel-600 font-medium bg-steel-50 px-2 py-0.5 rounded-full">
                  {cost}
                </span>
                <Stepper
                  value={value}
                  onChange={(v) => onUpdate({ [key]: v })}
                  min={min}
                  max={max}
                  label={label}
                />
              </div>
            </div>
          );
        })}
      </div>

      <NavigationButtons onBack={onBack} onNext={onNext} />
    </StepLayout>
  );
}
