import { useState } from 'react';
import Stepper from './components/Stepper.jsx';
import LiveEstimatePanel  from './components/LiveEstimatePanel.jsx';
import BuildingUseStep    from './steps/BuildingUseStep.jsx';
import DimensionsStep     from './steps/DimensionsStep.jsx';
import RoofStyleStep      from './steps/RoofStyleStep.jsx';
import OpeningsStep       from './steps/OpeningsStep.jsx';
import InsulationStep     from './steps/InsulationStep.jsx';
import FinishStep         from './steps/FinishStep.jsx';
import LeadCaptureStep    from './steps/LeadCaptureStep.jsx';
import EstimateSummaryStep from './steps/EstimateSummaryStep.jsx';
import { useEstimate }    from './hooks/useEstimate.js';

const INITIAL_CONFIG = {
  buildingUse:  null,
  width:        '',
  length:       '',
  height:       '',
  roofStyle:    null,
  walkDoors:    0,
  rollUpDoors:  0,
  windows:      0,
  insulation:   null,
  finish:       null,
  lead: {
    name:  '',
    email: '',
    phone: '',
  },
};

export default function App() {
  const [step, setStep]     = useState(1);
  const [config, setConfig] = useState(INITIAL_CONFIG);

  function update(patch) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function next() {
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restart() {
    setConfig(INITIAL_CONFIG);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const showStepper   = step < 8;
  const showLivePanel = step < 8;

  const estimate = useEstimate(config);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-steel-900 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-steel-600">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-steel-300 leading-none">Your Building Company</p>
              <p className="text-sm font-bold leading-tight">Building Configurator</p>
            </div>
          </div>
          <a
            href="tel:5550000000"
            className="hidden sm:flex items-center gap-1.5 text-xs text-steel-200 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            (555) 000-0000
          </a>
        </div>
      </header>

      {/* Stepper */}
      {showStepper && <Stepper currentStep={step} />}

      {/* Estimate ribbon (step 8) */}
      {step === 8 && (
        <div className="bg-steel-700 text-white text-center text-xs py-2 font-medium tracking-wide">
          Your Building Company · (555) 000-0000
        </div>
      )}

      {/* Step content — two-column on desktop for steps 1–7 */}
      <main className="flex-1 flex flex-col">
        {showLivePanel ? (
          <>
            {/* Mobile estimate panel sits above step content */}
            <LiveEstimatePanel
              formattedRange={estimate.formattedRange}
              sqft={estimate.sqft}
              config={config}
              hasMinimumData={estimate.hasMinimumData}
              currentStep={step}
              mobileOnly
            />

            {/* Desktop: outer wrapper constrains max width; inner flex row splits content + panel */}
            <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-0 lg:py-6 lg:flex lg:items-start lg:gap-8">
              {/* Left — step content */}
              <div className="flex-1 min-w-0">
                {step === 1 && <BuildingUseStep config={config} onUpdate={update} onNext={next} />}
                {step === 2 && <DimensionsStep  config={config} onUpdate={update} onNext={next} onBack={back} />}
                {step === 3 && <RoofStyleStep   config={config} onUpdate={update} onNext={next} onBack={back} />}
                {step === 4 && <OpeningsStep    config={config} onUpdate={update} onNext={next} onBack={back} />}
                {step === 5 && <InsulationStep  config={config} onUpdate={update} onNext={next} onBack={back} />}
                {step === 6 && <FinishStep      config={config} onUpdate={update} onNext={next} onBack={back} />}
                {step === 7 && <LeadCaptureStep config={config} onUpdate={update} onSubmit={next} onBack={back} />}
              </div>

              {/* Right — sticky estimate panel (desktop only, rendered inside LiveEstimatePanel) */}
              <LiveEstimatePanel
                formattedRange={estimate.formattedRange}
                sqft={estimate.sqft}
                config={config}
                hasMinimumData={estimate.hasMinimumData}
                currentStep={step}
                desktopOnly
              />
            </div>
          </>
        ) : (
          /* Step 8: full-width summary, no live panel */
          <EstimateSummaryStep config={config} onRestart={restart} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Your Building Company. All rights reserved.
          <span className="mx-2">·</span>
          Estimates are preliminary and subject to change.
        </p>
      </footer>
    </div>
  );
}
