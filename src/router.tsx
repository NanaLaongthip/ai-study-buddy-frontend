import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import SummaryPage from './pages/SummaryPage';
import QuizPage from './pages/QuizPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'summary/:docId',
        element: (
          <ProtectedRoute>
            <SummaryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'quiz/:docId',
        element: (
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
