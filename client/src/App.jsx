import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AuthPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetPage from './pages/BudgetPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ScrollToTop from './components/ScrollToTop.jsx';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/transactions"
          element={isAuthenticated ? <TransactionsPage /> : <Navigate to="/login" replace />}
        />
        <Route path="/budgets" element={isAuthenticated ? <BudgetPage /> : <Navigate to="/login" replace />} />
        <Route path="/reports" element={isAuthenticated ? <ReportsPage /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
