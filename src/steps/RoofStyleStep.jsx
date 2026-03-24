import StepLayout from '../components/StepLayout.jsx';
import OptionCard from '../components/OptionCard.jsx';
import NavigationButtons from '../components/NavigationButtons.jsx';
import { ROOF_STYLE_OPTIONS } from '../data/options.js';

const ROOF_ICONS = {
  gambrel:      GambrelIcon,
  single_slope: SingleSlopeIcon,
  gable:        GableIcon,
  mansard:      MansardIcon,
};

export default function RoofStyleStep({ config, onUpdate, onNext, onBack }) {
  const selected = config.roofStyle;

  return (
    <StepLayout
      title="Choose your roof style"
      subtitle="Each style affects the overall look, functionality, and price of your building."
    >
      <div
        role="radiogroup"
        aria-label="Roof style"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {ROOF_STYLE_OPTIONS.map((opt) => {
          const Icon = ROOF_ICONS[opt.id];
          return (
            <OptionCard
              key={opt.id}
              id={opt.id}
              selected={selected === opt.id}
              onSelect={(id) => onUpdate({ roofStyle: id })}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-12 flex items-center justify-center rounded-lg bg-slate-100">
                  <Icon />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                </div>
              </div>
            </OptionCard>
          );
        })}
      </div>

      <NavigationButtons onBack={onBack} onNext={onNext} nextDisabled={!selected} />
    </StepLayout>
  );
}

function GambrelIcon() {
  return (
    <svg viewBox="0 0 56 48" className="w-10 h-9 text-steel-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,40 20,20 28,10 36,20 52,40" />
      <line x1="4" y1="40" x2="52" y2="40" />
    </svg>
  );
}

function SingleSlopeIcon() {
  return (
    <svg viewBox="0 0 56 48" className="w-10 h-9 text-steel-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,36 52,20" />
      <line x1="4" y1="36" x2="52" y2="36" />
      <line x1="4" y1="36" x2="4" y2="20" />
      <line x1="52" y1="36" x2="52" y2="20" />
    </svg>
  );
}

function GableIcon() {
  return (
    <svg viewBox="0 0 56 48" className="w-10 h-9 text-steel-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,40 28,12 52,40" />
      <line x1="4" y1="40" x2="52" y2="40" />
    </svg>
  );
}

function MansardIcon() {
  return (
    <svg viewBox="0 0 56 48" className="w-10 h-9 text-steel-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,40 12,16 20,10 36,10 44,16 52,40" />
      <line x1="4" y1="40" x2="52" y2="40" />
    </svg>
  );
}
