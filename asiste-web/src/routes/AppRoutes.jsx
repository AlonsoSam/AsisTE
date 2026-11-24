import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import StudentsPage from "../pages/Students/StudentsPage";
import GuardiansPage from "../pages/Guardians/GuardiansPage";
import AttendancesPage from "../pages/Attendances/AttendancesPage";
import DevicesPage from "../pages/Devices/DevicesPage";
import NotificationsPage from "../pages/Notifications/NotificationsPage";
import UsersPage from "../pages/Users/UsersPage";
import RolesPage from "../pages/Roles/RolesPage";

import { isAdministrator } from "../services/auth";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function AdminRoute({ children }) {
    if (!isAdministrator()) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<LoginPage />}
                />

                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />

                    <Route
                        path="/students"
                        element={<StudentsPage />}
                    />

                    <Route
                        path="/guardians"
                        element={<GuardiansPage />}
                    />

                    <Route
                        path="/attendances"
                        element={<AttendancesPage />}
                    />

                    <Route
                        path="/devices"
                        element={<DevicesPage />}
                    />

                    <Route
                        path="/notifications"
                        element={<NotificationsPage />}
                    />

                    <Route
                        path="/users"
                        element={
                            <AdminRoute>
                                <UsersPage />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/roles"
                        element={
                            <AdminRoute>
                                <RolesPage />
                            </AdminRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;