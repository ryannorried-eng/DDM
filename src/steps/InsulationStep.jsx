import StepLayout from '../components/StepLayout.jsx';
import OptionCard from '../components/OptionCard.jsx';
import NavigationButtons from '../components/NavigationButtons.jsx';
import { INSULATION_OPTIONS } from '../data/options.js';

const THERMAL_BARS = {
  none:     0,
  basic:    1,
  standard: 2,
  premium:  3,
};

function ThermalBar({ level }) {
  return (
    <div className="flex gap-1 mt-2" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < level ? 'bg-steel-500' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function InsulationStep({ config, onUpdate, onNext, onBack }) {
  const selected = config.insulation;

  return (
    <StepLayout
      title="Insulation package"
      subtitle="Insulation improves energy efficiency and interior comfort year-round."
    >
      <div
        role="radiogroup"
        aria-label="Insulation level"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {INSULATION_OPTIONS.map((opt) => {
          const barLevel = THERMAL_BARS[opt.id];
          return (
            <OptionCard
              key={opt.id}
              id={opt.id}
              selected={selected === opt.id}
              onSelect={(id) => onUpdate({ insulation: id })}
            >
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-slate-800">{opt.label}</p>
                  {opt.adder > 0 && (
                    <span className="text-xs font-medium text-steel-600">
                      +${opt.adder.toLocaleString()}
                    </span>
                  )}
                  {opt.adder === 0 && (
                    <span className="text-xs text-slate-400">included</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">{opt.description}</p>
                {barLevel > 0 && (
                  <>
                    <ThermalBar level={barLevel} />
                    <p className="text-xs text-steel-600 mt-1">{opt.thermal}</p>
                  </>
                )}
              </div>
            </OptionCard>
          );
        })}
      </div>

      <NavigationButtons onBack={onBack} onNext={onNext} nextDisabled={!selected} />
    </StepLayout>
  );
}
