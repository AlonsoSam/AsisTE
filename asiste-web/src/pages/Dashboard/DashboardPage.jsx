import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
    const navigate = useNavigate();

    const username =
        localStorage.getItem("username") || "Usuario";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");

        navigate("/");
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                Dashboard AsisTE
            </Typography>

            <Typography sx={{ mb: 3 }}>
                Bienvenido, {username}
            </Typography>

            <Button
                variant="outlined"
                onClick={handleLogout}
            >
                Cerrar sesión
            </Button>
        </Box>
    );
}

export default DashboardPage;