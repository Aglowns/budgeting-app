import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { DemoMode } from '@/components/DemoMode';
import { TestComponent } from '@/components/TestComponent';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { LinkWizard } from '@/pages/LinkWizard';
import { Dashboard } from '@/pages/Dashboard';
import { Transactions } from '@/pages/Transactions';
import { Notes } from '@/pages/Notes';
import { Savings } from '@/pages/Savings';
import { Settings } from '@/pages/Settings';

function App() {
  console.log('App component rendering...');
  
  // Check if we should use demo mode
  const isDemoMode = window.location.search.includes('demo=true');

  return (
    <Router>
      {isDemoMode && <DemoMode />}
      <Routes>
        {/* Test route */}
        <Route path="/test" element={<TestComponent />} />
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
          <Route path="dashboard" element={
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
          } />
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