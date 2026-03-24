import { useState } from 'react';
import StepLayout from '../components/StepLayout.jsx';
import NavigationButtons from '../components/NavigationButtons.jsx';
import { DIMENSION_CONSTRAINTS } from '../data/options.js';
import { validateDimensions } from '../utils/validation.js';

const FIELDS = [
  {
    key: 'width',
    label: 'Width (ft)',
    hint: `${DIMENSION_CONSTRAINTS.width.min}–${DIMENSION_CONSTRAINTS.width.max} ft`,
    placeholder: 'e.g. 40',
  },
  {
    key: 'length',
    label: 'Length (ft)',
    hint: `${DIMENSION_CONSTRAINTS.length.min}–${DIMENSION_CONSTRAINTS.length.max} ft`,
    placeholder: 'e.g. 60',
  },
  {
    key: 'height',
    label: 'Eave Height (ft)',
    hint: `${DIMENSION_CONSTRAINTS.height.min}–${DIMENSION_CONSTRAINTS.height.max} ft`,
    placeholder: 'e.g. 12',
  },
];

export default function DimensionsStep({ config, onUpdate, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const dims = {
    width:  config.width  ?? '',
    length: config.length ?? '',
    height: config.height ?? '',
  };

  function handleChange(key, value) {
    onUpdate({ [key]: value });
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function handleNext() {
    const errs = validateDimensions(dims);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onNext();
  }

  return (
    <StepLayout
      title="Enter your building dimensions"
      subtitle="All values are in feet. We'll use these to calculate your estimate."
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FIELDS.map(({ key, label, hint, placeholder }) => (
            <div key={key}>
              <label htmlFor={key} className="form-label">
                {label}
              </label>
              <input
                id={key}
                type="number"
                inputMode="numeric"
                min={DIMENSION_CONSTRAINTS[key].min}
                max={DIMENSION_CONSTRAINTS[key].max}
                value={dims[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className={`form-input ${errors[key] ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                aria-describedby={`${key}-hint ${errors[key] ? `${key}-error` : ''}`}
              />
              {errors[key] ? (
                <p id={`${key}-error`} className="mt-1 text-xs text-red-600" role="alert">
                  {errors[key]}
                </p>
              ) : (
                <p id={`${key}-hint`} className="mt-1 text-xs text-slate-400">
                  Allowed range: {hint}
                </p>
              )}
            </div>
          ))}
        </div>

        {dims.width && dims.length && !errors.width && !errors.length && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Square footage:{' '}
              <span className="font-semibold text-slate-700">
                {(Number(dims.width) * Number(dims.length)).toLocaleString()} sq ft
              </span>
            </p>
          </div>
        )}
      </div>

      <NavigationButtons onBack={onBack} onNext={handleNext} />
    </StepLayout>
  );
}
