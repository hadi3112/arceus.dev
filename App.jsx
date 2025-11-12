import './src/index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import SignIn from './src/pages/Auth/SignIn';
import SignUp from './src/pages/Auth/SignUp';
import Onboarding from './src/pages/Onboarding';
import Dashboard from './src/pages/Dashboard';
import CodeReview from './src/pages/CodeReview';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-arceus-orange text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-arceus-orange text-2xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route
              path="/signin"
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/code-review"
              element={
                <ProtectedRoute>
                  <CodeReview />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
