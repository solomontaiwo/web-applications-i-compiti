import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/UseAuth';
import { useTranslation } from 'react-i18next';
import PrivateRoute from './components/PrivateRoute';
import LoginForm from './components/LoginForm';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherAssignmentDetails from './pages/teacher/TeacherAssignmentDetails';
import TeacherClassStatusPage from './pages/teacher/TeacherClassStatusPage';
import StudentResultsPage from './pages/student/StudentResultsPage';
import NotFound from './pages/NotFound';

export default function AppRouter() {
    const { user, loading } = useAuth();
    const { t } = useTranslation();

    if (loading) return <div>{t('common.loading', 'Loading...')}</div>;

    return (
        <Routes>
            <Route path="/" element={
                user ? (
                    user.role === 'teacher' ? <Navigate to="/teacher" /> : <Navigate to="/student" />
                ) : <Navigate to="/login" />
            } />

            <Route
                path="/teacher"
                element={
                    <PrivateRoute role="teacher">
                        <TeacherDashboard />
                    </PrivateRoute>
                }
            />

            <Route
                path="/teacher/class-status"
                element={
                    <PrivateRoute role="teacher">
                        <TeacherClassStatusPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/teacher/assignments/:id"
                element={
                    <PrivateRoute role="teacher">
                        <TeacherAssignmentDetails />
                    </PrivateRoute>
                }
            />

            <Route
                path="/student"
                element={
                    <PrivateRoute role="student">
                        <StudentDashboard />
                    </PrivateRoute>
                }
            />

            <Route
                path="/student/results"
                element={
                    <PrivateRoute role="student">
                        <StudentResultsPage />
                    </PrivateRoute>
                }
            />

            // Se l'utente è loggato, viene reindirizzato al dashboard del docente o dello studente
            <Route
                path="/login"
                element={
                    user ? (
                        user.role === 'teacher' ? <Navigate to="/teacher" /> : <Navigate to="/student" />
                    ) : <LoginForm />
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}