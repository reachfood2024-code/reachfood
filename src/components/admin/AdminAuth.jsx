import { useState, useEffect, createContext, useContext } from 'react';

const ADMIN_SESSION_KEY = 'reachfood_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Context for logout functionality
const AdminAuthContext = createContext({ handleLogout: () => {} });

export const useAdminAuth = () => useContext(AdminAuthContext);

export default function AdminAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session) {
      try {
        const { timestamp } = JSON.parse(session);
        const now = Date.now();
        if (now - timestamp < SESSION_DURATION) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          localStorage.removeItem(ADMIN_SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Get admin password from environment variable
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!adminPassword) {
      setError('Admin password not configured');
      return;
    }

    if (password === adminPassword) {
      // Create session
      const session = {
        timestamp: Date.now(),
        authenticated: true
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setPassword('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400 text-sm">Enter admin password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 px-4 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
            >
              Access Dashboard
            </button>
          </form>

          <p className="text-gray-500 text-xs text-center mt-6">
            Protected area - Authorized personnel only
          </p>
        </div>
      </div>
    );
  }

  // Pass logout function to children
  return (
    <AdminAuthContext.Provider value={{ handleLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
