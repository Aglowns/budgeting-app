import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { LinkWizard } from '@/pages/LinkWizard';
import { Dashboard } from '@/pages/Dashboard';
import { Transactions } from '@/pages/Transactions';
import { Notes } from '@/pages/Notes';
import { Savings } from '@/pages/Savings';
import { Settings } from '@/pages/Settings';

function App() {
  useEffect(() => {
    // Start MSW in development
    if (import.meta.env.DEV) {
      import('@/mocks/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'bypass',
        });
      });
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes that don't require linking */}
        <Route
          path="/link"
          element={
            <ProtectedRoute>
              <LinkWizard />
            </ProtectedRoute>
          }
        />
        
        {/* Protected routes that require linking */}
        <Route
          path="/"
          element={
            <ProtectedRoute requireLinked>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="notes" element={<Notes />} />
          <Route path="savings" element={<Savings />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;