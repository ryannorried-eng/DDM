import { useState } from 'react';
import {
  BUILDING_USE_OPTIONS,
  ROOF_STYLE_OPTIONS,
  INSULATION_OPTIONS,
  FINISH_OPTIONS,
} from '../data/options.js';
import EstimateBreakdown from './EstimateBreakdown.jsx';

function labelFor(options, id) {
  return options.find((o) => o.id === id)?.label ?? null;
}

function buildSummaryLines(config) {
  const lines = [];

  const use = labelFor(BUILDING_USE_OPTIONS, config.buildingUse);
  if (use) lines.push(use);

  const roof = labelFor(ROOF_STYLE_OPTIONS, config.roofStyle);
  if (roof) lines.push(`${roof} roof`);

  const insulation = labelFor(INSULATION_OPTIONS, config.insulation);
  if (insulation && insulation !== 'None') lines.push(`${insulation} insulation`);

  const finish = labelFor(FINISH_OPTIONS, config.finish);
  if (finish) lines.push(finish);

  const openingParts = [];
  if (config.walkDoors   > 0) openingParts.push(`${config.walkDoors} walk door${config.walkDoors   > 1 ? 's' : ''}`);
  if (config.rollUpDoors > 0) openingParts.push(`${config.rollUpDoors} roll-up${config.rollUpDoors > 1 ? 's' : ''}`);
  if (config.windows     > 0) openingParts.push(`${config.windows} window${config.windows         > 1 ? 's' : ''}`);
  if (openingParts.length > 0) lines.push(openingParts.join(', '));

  return lines;
}

// ── Desktop sticky panel ───────────────────────────────────────────────────
function DesktopPanel({ formattedRange, sqft, config, hasMinimumData }) {
  const summaryLines = hasMinimumData ? buildSummaryLines(config) : [];

  return (
    <aside className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0">
      <div className="sticky top-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="bg-steel-900 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-steel-300">
              Live Estimate
            </p>
            <p className="text-[10px] text-steel-400 mt-0.5">Updates as you configure</p>
          </div>

          <div className="px-5 py-5">
            {hasMinimumData ? (
              <>
                {/* Range */}
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Estimated Range
                  </p>
                  <p className="text-xl font-bold text-steel-800 leading-tight break-words">
                    {formattedRange}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {sqft.toLocaleString()} sq ft · ±15% ballpark
                  </p>
                </div>

                {/* Price breakdown */}
                <div className="mb-4">
                  <EstimateBreakdown config={config} hasMinimumData={hasMinimumData} />
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100 my-4" />

                {/* Live summary */}
                {summaryLines.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Your Build
                    </p>
                    <ul className="space-y-1.5">
                      {summaryLines.map((line) => (
                        <li key={line} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-steel-400" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="py-4 text-center">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-slate-100 mb-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">Your estimate will appear here</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Select dimensions and a roof style to see a live ballpark range.
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="border-t border-slate-100 px-5 py-3 bg-slate-50">
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Preliminary estimate only. Final pricing subject to engineering and site conditions.
            </p>
          </div>
        </div>

        {/* Call CTA */}
        <div className="mt-3 rounded-xl border border-steel-100 bg-steel-50 px-4 py-3 text-center">
          <p className="text-[11px] text-steel-600 font-medium">Questions? Call us</p>
          <a
            href="tel:5550000000"
            className="text-base font-bold text-steel-800 hover:text-steel-900 transition-colors"
          >
            (555) 000-0000
          </a>
        </div>
      </div>
    </aside>
  );
}

// ── Mobile collapsible panel ───────────────────────────────────────────────
function MobilePanel({ formattedRange, sqft, config, hasMinimumData, currentStep }) {
  const [open, setOpen] = useState(false);
  const summaryLines = hasMinimumData ? buildSummaryLines(config) : [];

  return (
    <div className="lg:hidden mx-4 mb-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Toggle bar */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-steel-500"
          aria-expanded={open}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-steel-800">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-700">Live Estimate</p>
              {hasMinimumData ? (
                <p className="text-[11px] text-steel-600 font-medium">{formattedRange}</p>
              ) : (
                <p className="text-[11px] text-slate-400">Add dimensions &amp; roof to see range</p>
              )}
            </div>
          </div>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded content */}
        {open && (
          <div className="border-t border-slate-100 px-4 py-4">
            {hasMinimumData ? (
              <>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Estimated Range</p>
                    <p className="text-lg font-bold text-steel-800">{formattedRange}</p>
                  </div>
                  <p className="text-xs text-slate-400">{sqft.toLocaleString()} sq ft</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <EstimateBreakdown config={config} hasMinimumData={hasMinimumData} />
                </div>

                {summaryLines.length > 0 && (
                  <ul className="space-y-1 mt-3 pt-3 border-t border-slate-100">
                    {summaryLines.map((line) => (
                      <li key={line} className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex-shrink-0 w-1 h-1 rounded-full bg-steel-400" />
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="py-2 text-center">
                <p className="text-sm font-medium text-slate-600">Your estimate will appear here</p>
                <p className="text-xs text-slate-400 mt-1">
                  Select dimensions and a roof style to see a live ballpark range.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Public component ───────────────────────────────────────────────────────
// mobileOnly  — render only the collapsible mobile bar (e.g. above step content)
// desktopOnly — render only the sticky desktop sidebar (e.g. inside the flex row)
// neither     — render both (default, useful for standalone use)
export default function LiveEstimatePanel({
  formattedRange,
  sqft,
  config,
  hasMinimumData,
  currentStep,
  mobileOnly  = false,
  desktopOnly = false,
}) {
  if (currentStep >= 8) return null;

  const showMobile  = !desktopOnly;
  const showDesktop = !mobileOnly;

  return (
    <>
      {showMobile && (
        <MobilePanel
          formattedRange={formattedRange}
          sqft={sqft}
          config={config}
          hasMinimumData={hasMinimumData}
          currentStep={currentStep}
        />
      )}
      {showDesktop && (
        <DesktopPanel
          formattedRange={formattedRange}
          sqft={sqft}
          config={config}
          hasMinimumData={hasMinimumData}
        />
      )}
    </>
  );
}
