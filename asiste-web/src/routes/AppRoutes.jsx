import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
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
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;