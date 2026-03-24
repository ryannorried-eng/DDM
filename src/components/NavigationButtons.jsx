export default function NavigationButtons({
  onBack,
  onNext,
  nextLabel = 'Next',
  nextDisabled = false,
  showBack = true,
}) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
      <div>
        {showBack && (
          <button type="button" onClick={onBack} className="btn-secondary">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="btn-primary"
      >
        {nextLabel}
        {nextLabel !== 'Get My Estimate' && (
          <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </div>
  );
}
