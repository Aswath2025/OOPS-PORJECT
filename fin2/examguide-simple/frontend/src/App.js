import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavigationBar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// User Components
import Dashboard from './components/user/Dashboard';
import Profile from './components/user/Profile';
import ExamList from './components/user/ExamList';
import ScholarshipList from './components/user/ScholarshipList';
import MaterialsList from './components/user/MaterialsList';
import RecommendationBox from './components/user/RecommendationBox';
import ExamDetail from './components/user/ExamDetail';
import MyBookmarks from './components/user/MyBookmarks';
import ScholarshipDetail from './components/user/ScholarshipDetail';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import ExamManagement from './components/admin/ExamManagement';

import './styles/App.css';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole === 'ADMIN' && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const LandingPage = () => (
  <div className="landing-page">
    <div className="hero-section">
      <div className="hero-content">
        <h1>ExamGuide</h1>
        <p>Your Complete Platform for Exam Preparation and Scholarship Discovery</p>
        <div className="hero-buttons">
          <a href="/login" className="btn btn-primary btn-lg">Login</a>
          <a href="/register" className="btn btn-outline-primary btn-lg">Register</a>
        </div>
      </div>
    </div>
  </div>
);

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Router>
      <NavigationBar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams"
            element={
              <ProtectedRoute>
                <ExamList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/:id"
            element={
              <ProtectedRoute>
                <ExamDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scholarships"
            element={
              <ProtectedRoute>
                <ScholarshipList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scholarships/:id"
            element={
              <ProtectedRoute>
                <ScholarshipDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials"
            element={
              <ProtectedRoute>
                <MaterialsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <RecommendationBox />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <MyBookmarks />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ExamManagement />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
