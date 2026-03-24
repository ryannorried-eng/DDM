import StepLayout from '../components/StepLayout.jsx';
import OptionCard from '../components/OptionCard.jsx';
import NavigationButtons from '../components/NavigationButtons.jsx';
import { BUILDING_USE_OPTIONS } from '../data/options.js';

export default function BuildingUseStep({ config, onUpdate, onNext }) {
  const selected = config.buildingUse;

  return (
    <StepLayout
      title="What will your building be used for?"
      subtitle="Select the option that best describes your intended use."
    >
      <div
        role="radiogroup"
        aria-label="Building use"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {BUILDING_USE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.id}
            id={opt.id}
            selected={selected === opt.id}
            onSelect={(id) => onUpdate({ buildingUse: id })}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5" aria-hidden="true">{opt.icon}</span>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{opt.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
              </div>
            </div>
          </OptionCard>
        ))}
      </div>

      <NavigationButtons
        showBack={false}
        onNext={onNext}
        nextDisabled={!selected}
      />
    </StepLayout>
  );
}
