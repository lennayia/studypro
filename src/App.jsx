import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { Layout } from './components/common/Layout';
import { LoadingSpinner, ErrorBoundary } from '../shared/src/components/common';
import { NotificationProvider } from '../shared/src/context/NotificationContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { GoalsPage } from './pages/GoalsPage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <LoadingSpinner size={60} message="Načítání..." />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Routes inside Layout
const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Layout>
              <CoursesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <CourseDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Layout>
              <GoalsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Layout>
              <StatsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CssBaseline />
        <NotificationProvider>
          <BrowserRouter>
            <AuthProvider>
              <CourseProvider>
                <GamificationProvider>
                  <AppRoutes />
                </GamificationProvider>
              </CourseProvider>
            </AuthProvider>
          </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
