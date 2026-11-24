import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import api from "../../services/api";

function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post(
                "/Auth/login",
                {
                    username,
                    password,
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "username",
                response.data.username
            );

            localStorage.setItem(
                "userId",
                response.data.userId
            );

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

                background:
                    "radial-gradient(circle at top left, #E8F2FF 0%, #F5F8FC 35%, #F8FAFD 100%)",

                px: 2,
            }}
        >
            <Card
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 900,
                    minHeight: 520,

                    display: "grid",

                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr 1fr",
                    },

                    borderRadius: 4,
                    overflow: "hidden",

                    border:
                        "1px solid #E0E8F0",

                    boxShadow:
                        "0 22px 60px rgba(15,39,66,0.13)",
                }}
            >
                {/* panel izquierdo */}

                <Box
                    sx={{
                        display: {
                            xs: "none",
                            md: "flex",
                        },

                        flexDirection: "column",

                        justifyContent:
                            "space-between",

                        p: 5,

                        color: "#FFFFFF",

                        background:
                            "linear-gradient(145deg, #0F2742 0%, #143C63 55%, #1F6FB2 100%)",

                        position: "relative",
                        overflow: "hidden",

                        "&::after": {
                            content: '""',
                            position: "absolute",
                            width: 260,
                            height: 260,
                            borderRadius: "50%",
                            right: -110,
                            top: -110,

                            background:
                                "rgba(54,194,180,0.08)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <Box
                            component="img"
                            src="/logoasiste.png"
                            alt="Logo AsisTE"
                            sx={{
                                width: 86,
                                height: 86,

                                objectFit:
                                    "contain",

                                borderRadius:
                                    "50%",

                                mb: 2.5,

                                filter:
                                    "drop-shadow(0 8px 20px rgba(0,190,255,0.32))",

                                transition:
                                    "transform 0.25s ease",

                                "&:hover": {
                                    transform:
                                        "scale(1.04)",
                                },
                            }}
                        />

                        <Typography
                            variant="h3"
                            fontWeight={750}
                            sx={{
                                mb: 1,
                            }}
                        >
                            AsisTE
                        </Typography>

                        <Typography
                            sx={{
                                color:
                                    "rgba(255,255,255,0.78)",

                                fontSize: 17,

                                maxWidth: 320,

                                lineHeight: 1.6,
                            }}
                        >
                            Control inteligente y
                            centralizado de asistencia
                            escolar.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "grid",
                            gap: 2,

                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <Feature
                            icon={
                                <FactCheckIcon />
                            }
                            text="Control de asistencias"
                        />

                        <Feature
                            icon={<SchoolIcon />}
                            text="Gestión de estudiantes"
                        />

                        <Feature
                            icon={
                                <NotificationsActiveIcon />
                            }
                            text="Notificaciones a apoderados"
                        />
                    </Box>
                </Box>

                {/* panel derecho */}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",

                        p: {
                            xs: 4,
                            sm: 5,
                        },
                    }}
                >
                    {/* logo visible solo en móvil */}

                    <Box
                        component="img"
                        src="/logoasiste.png"
                        alt="Logo AsisTE"
                        sx={{
                            display: {
                                xs: "block",
                                md: "none",
                            },

                            width: 72,
                            height: 72,

                            objectFit:
                                "contain",

                            borderRadius:
                                "50%",

                            mb: 2,

                            filter:
                                "drop-shadow(0 6px 16px rgba(47,128,237,0.24))",
                        }}
                    />

                    <Typography
                        variant="h4"
                        sx={{
                            mb: 1,
                            fontWeight: 700,
                            color: "#0F2742",
                        }}
                    >
                        Bienvenido
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mb: 4,
                        }}
                    >
                        Ingresa tus credenciales
                        para acceder al sistema.
                    </Typography>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                            }}
                            onClose={() =>
                                setError("")
                            }
                        >
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
                            value={username}
                            onChange={(event) =>
                                setUsername(
                                    event.target
                                        .value
                                )
                            }
                            margin="normal"
                            required
                            autoComplete="username"
                            disabled={loading}
                        />

                        <TextField
                            label="Contraseña"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target
                                        .value
                                )
                            }
                            margin="normal"
                            required
                            autoComplete="current-password"
                            disabled={loading}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                mt: 3,
                                py: 1.4,

                                background:
                                    "linear-gradient(90deg, #2F80ED, #2675D8)",

                                boxShadow:
                                    "0 7px 18px rgba(47,128,237,0.22)",

                                transition:
                                    "all 0.2s ease",

                                "&:hover": {
                                    background:
                                        "linear-gradient(90deg, #2875D8, #1F67C0)",

                                    transform:
                                        "translateY(-1px)",

                                    boxShadow:
                                        "0 9px 22px rgba(47,128,237,0.28)",
                                },
                            }}
                        >
                            {loading ? (
                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: 1.2,
                                    }}
                                >
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />

                                    Ingresando...
                                </Box>
                            ) : (
                                "Iniciar sesión"
                            )}
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}

function Feature({ icon, text }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,

                color:
                    "rgba(255,255,255,0.88)",

                transition:
                    "transform 0.2s ease",

                "&:hover": {
                    transform:
                        "translateX(4px)",
                },
            }}
        >
            <Box
                sx={{
                    width: 38,
                    height: 38,

                    borderRadius: 2,

                    bgcolor:
                        "rgba(255,255,255,0.10)",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    "& svg": {
                        fontSize: 20,
                    },
                }}
            >
                {icon}
            </Box>

            <Typography
                fontSize={14}
                fontWeight={500}
            >
                {text}
            </Typography>
        </Box>
    );
}

export default LoginPage;