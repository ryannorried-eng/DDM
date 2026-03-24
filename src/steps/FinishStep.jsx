import StepLayout from '../components/StepLayout.jsx';
import NavigationButtons from '../components/NavigationButtons.jsx';
import { FINISH_OPTIONS } from '../data/options.js';

export default function FinishStep({ config, onUpdate, onNext, onBack }) {
  const selected = config.finish;

  return (
    <StepLayout
      title="Exterior color finish"
      subtitle="Choose the panel color for your building's exterior walls and roof."
    >
      <div
        role="radiogroup"
        aria-label="Exterior color"
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {FINISH_OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onUpdate({ finish: opt.id })}
              className={`relative flex flex-col items-center rounded-xl border-2 p-4 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-steel-500 focus:ring-offset-2 ${
                isSelected
                  ? 'border-steel-600 shadow-md bg-steel-50'
                  : 'border-slate-200 bg-white hover:border-steel-300 hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-steel-600">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              <div
                className="w-12 h-12 rounded-lg shadow-inner border border-black/10 mb-2 flex-shrink-0"
                style={{ backgroundColor: opt.hex }}
                aria-hidden="true"
              />
              <span className={`text-xs font-semibold text-center leading-tight ${isSelected ? 'text-steel-700' : 'text-slate-700'}`}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      <NavigationButtons onBack={onBack} onNext={onNext} nextDisabled={!selected} />
    </StepLayout>
  );
}
