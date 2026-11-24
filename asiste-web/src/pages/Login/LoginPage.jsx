import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
} from "@mui/material";
import api from "../../services/api";

function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/Auth/login", {
                username,
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("userId", response.data.userId);

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo iniciar sesión"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f4f6f8",
                px: 2,
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    borderRadius: 3,
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        textAlign="center"
                        gutterBottom
                    >
                        AsisTE
                    </Typography>

                    <Typography
                        color="text.secondary"
                        textAlign="center"
                        sx={{ mb: 3 }}
                    >
                        Sistema de gestión de asistencia
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            label="Usuario"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            required
                        />

                        <TextField
                            label="Contraseña"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                mt: 3,
                                py: 1.4,
                            }}
                        >
                            {loading
                                ? "Ingresando..."
                                : "Iniciar sesión"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default LoginPage;