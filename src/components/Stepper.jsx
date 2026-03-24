import { STEPS } from '../data/options.js';

export default function Stepper({ currentStep }) {
  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Mobile: compact pill */}
        <div className="flex sm:hidden items-center justify-between">
          <span className="text-sm font-semibold text-steel-700">
            Step {currentStep} of {STEPS.length - 1}
          </span>
          <span className="text-sm text-slate-500">{STEPS[currentStep - 1]?.label}</span>
        </div>
        <div className="flex sm:hidden mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-steel-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 2)) * 100}%` }}
          />
        </div>

        {/* Desktop: full stepper */}
        <ol className="hidden sm:flex items-center gap-0">
          {STEPS.filter((s) => s.id < 8).map((step, idx) => {
            const isComplete = currentStep > step.id;
            const isActive   = currentStep === step.id;
            return (
              <li key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-steel-700 text-white ring-4 ring-steel-100'
                        : isComplete
                        ? 'bg-steel-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isComplete ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`mt-1 text-xs font-medium whitespace-nowrap ${
                      isActive ? 'text-steel-700' : isComplete ? 'text-steel-500' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.filter((s) => s.id < 8).length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mb-5 mx-1 transition-colors ${
                      isComplete ? 'bg-steel-400' : 'bg-slate-200'
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
