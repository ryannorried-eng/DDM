import { useState } from 'react';

const ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD || 'ddm2025';

const SESSION_KEY = 'ddm_admin_auth';

export function isAdminAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function clearAdminAuth() {
  sessionStorage.removeItem(SESSION_KEY);
}

export default function AdminLogin({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Slight delay for UX (not a real network call)
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, '1');
        onAuthenticated();
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
      setLoading(false);
    }, 300);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-steel-900 mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Admin Access</h1>
          <p className="text-sm text-slate-500 mt-1">DDM Pricing Administration</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="admin-password" className="form-label">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className={`form-input ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                autoFocus
                required
              />
              {error && (
                <p className="mt-1.5 text-xs text-red-600" role="alert">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!password || loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Checking…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Internal use only · Session expires on tab close
        </p>
      </div>
    </div>
  );
}
