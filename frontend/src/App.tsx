import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './features/auth/RegisterForm';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './features/organizations/Dashboard';
import { useAuthStore } from './store/authStore';

// Helper to prevent logged-in users from seeing login/register
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  if (token) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <AuthRoute>
            <LoginForm />
          </AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute>
            <RegisterForm />
          </AuthRoute>
        } />

        {/* Protected App Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orgs/:orgId" element={<div className="p-8">Organization Detail Coming Soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
