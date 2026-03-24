import { useState } from 'react';
import StepLayout from '../components/StepLayout.jsx';
import { validateLead } from '../utils/validation.js';

export default function LeadCaptureStep({ config, onUpdate, onSubmit, onBack }) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const lead = {
    name:  config.lead?.name  ?? '',
    email: config.lead?.email ?? '',
    phone: config.lead?.phone ?? '',
  };

  function handleChange(key, value) {
    const updated = { ...lead, [key]: value };
    onUpdate({ lead: updated });
    if (touched[key]) {
      const errs = validateLead(updated);
      setErrors(errs);
    }
  }

  function handleBlur(key) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validateLead(lead);
    setErrors(errs);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validateLead(lead);
    setTouched({ name: true, email: true });
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit();
  }

  const isValid = !validateLead(lead).name && !validateLead(lead).email;

  return (
    <StepLayout
      title="Almost there — get your estimate"
      subtitle="Enter your contact info and we'll show your personalized ballpark estimate."
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          {/* Trust badge */}
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
            <svg className="w-4 h-4 text-steel-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your information is private and will only be used by our team to follow up on your estimate.
          </div>

          {/* Name */}
          <div>
            <label htmlFor="lead-name" className="form-label">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-name"
              type="text"
              autoComplete="name"
              value={lead.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Jane Smith"
              className={`form-input ${errors.name && touched.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
              aria-required="true"
              aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
            />
            {errors.name && touched.name && (
              <p id="name-error" className="mt-1 text-xs text-red-600" role="alert">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="lead-email" className="form-label">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-email"
              type="email"
              autoComplete="email"
              value={lead.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="jane@example.com"
              className={`form-input ${errors.email && touched.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
              aria-required="true"
              aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
            />
            {errors.email && touched.email && (
              <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="lead-phone" className="form-label">
              Phone Number <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="lead-phone"
              type="tel"
              autoComplete="tel"
              value={lead.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(555) 000-0000"
              className="form-input"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
          <button type="button" onClick={onBack} className="btn-secondary">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="btn-primary px-8"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Get My Estimate
          </button>
        </div>
      </form>
    </StepLayout>
  );
}
