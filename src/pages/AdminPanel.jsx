import { useState, useCallback } from 'react';
import AdminLogin, { isAdminAuthenticated, clearAdminAuth } from '../components/admin/AdminLogin.jsx';
import MaterialCostsTab from '../components/admin/MaterialCostsTab.jsx';
import MultipliersTab   from '../components/admin/MultipliersTab.jsx';
import AddOnsTab        from '../components/admin/AddOnsTab.jsx';
import FreightTab       from '../components/admin/FreightTab.jsx';
import { getPricingConfig, savePricingConfig, resetPricingConfig } from '../utils/pricingConfig.js';

const TABS = [
  { id: 'materials',   label: 'Base Material Costs' },
  { id: 'multipliers', label: 'Size & Complexity' },
  { id: 'addons',      label: 'Add-On Pricing' },
  { id: 'freight',     label: 'Freight & Delivery' },
];

function formatTimestamp(iso) {
  if (!iso) return 'Never';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function AdminPanelInner() {
  const [activeTab, setActiveTab]   = useState('materials');
  const [config, setConfig]         = useState(() => getPricingConfig());
  const [saving, setSaving]         = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { ok, error? }
  const [resetting, setResetting]   = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  function clearStatus() {
    setSaveStatus(null);
  }

  function handleSave() {
    setSaving(true);
    clearStatus();

    // Simulate slight async (drop-in ready for future API call)
    setTimeout(() => {
      const result = savePricingConfig(config);
      setSaveStatus(result);
      if (result.ok) {
        // Re-read to pick up the updatedAt timestamp
        setConfig(getPricingConfig());
        setTimeout(clearStatus, 4000);
      }
      setSaving(false);
    }, 200);
  }

  function handleReset() {
    setResetting(true);
    setTimeout(() => {
      const fresh = resetPricingConfig();
      setConfig(fresh);
      setSaveStatus({ ok: true });
      setShowResetConfirm(false);
      setResetting(false);
      setTimeout(clearStatus, 4000);
    }, 200);
  }

  function handleSignOut() {
    clearAdminAuth();
    window.location.reload();
  }

  const tabProps = {
    config,
    onChange: setConfig,
    onSave: handleSave,
    saving,
    saveStatus,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-steel-900 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-steel-600">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 4v-2m0 2a2 2 0 100 4m0-4a2 2 0 110 4m6-8v2m0-2a2 2 0 100 4m0-4a2 2 0 110 4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-steel-300 leading-none">DDM Admin</p>
              <p className="text-sm font-bold leading-tight">Pricing Configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-steel-300 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Configurator
            </a>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs text-steel-300 hover:text-white transition-colors border border-steel-600 rounded-lg px-3 py-1.5"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Pricing Admin</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Last updated:{' '}
              <span className="font-medium text-slate-700">
                {formatTimestamp(config.updatedAt)}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="btn-secondary text-sm text-red-600 border-red-200 hover:bg-red-50 self-start sm:self-auto"
          >
            Reset to Defaults
          </button>
        </div>

        {/* Reset confirmation dialog */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Reset to factory defaults?</p>
                  <p className="text-sm text-slate-500 mt-1">
                    All current pricing values will be replaced with the original defaults. This cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={resetting}
                  className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-40"
                >
                  {resetting ? 'Resetting…' : 'Yes, Reset'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tab nav */}
          <div className="border-b border-slate-200 overflow-x-auto">
            <nav className="flex min-w-max" aria-label="Admin sections">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id); clearStatus(); }}
                  className={`px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-steel-500 ${
                    activeTab === tab.id
                      ? 'border-steel-700 text-steel-800 bg-steel-50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-5 sm:p-6">
            {activeTab === 'materials'   && <MaterialCostsTab {...tabProps} />}
            {activeTab === 'multipliers' && <MultipliersTab   {...tabProps} />}
            {activeTab === 'addons'      && <AddOnsTab        {...tabProps} />}
            {activeTab === 'freight'     && <FreightTab       {...tabProps} />}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Changes are saved to browser localStorage and applied immediately to all new estimates.
          <br className="hidden sm:block" />
          {' '}This is a temporary persistence mechanism — backend sync planned for a future phase.
        </p>
      </main>
    </div>
  );
}

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated());

  if (!authenticated) {
    return <AdminLogin onAuthenticated={() => setAuthenticated(true)} />;
  }

  return <AdminPanelInner />;
}
