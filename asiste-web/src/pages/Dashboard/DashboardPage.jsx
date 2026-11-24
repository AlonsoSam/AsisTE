import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DevicesIcon from "@mui/icons-material/Devices";

import api from "../../services/api";

function DashboardPage() {
    const [summary, setSummary] = useState({
        students: 0,
        todayAttendances: 0,
        pendingNotifications: 0,
        activeDevices: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getToday = () => {
        const today = new Date();

        const year = today.getFullYear();

        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            today.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const today = getToday();

            const [
                studentsResponse,
                attendancesResponse,
                notificationsResponse,
                devicesResponse,
            ] = await Promise.all([
                api.get("/Students"),

                api.get(
                    `/Attendances/date/${today}`
                ),

                api.get(
                    "/Notifications/status/pendiente"
                ),

                api.get("/Devices"),
            ]);

            const activeDevices =
                devicesResponse.data.filter(
                    (device) => device.active
                ).length;

            setSummary({
                students:
                studentsResponse.data.length,

                todayAttendances:
                attendancesResponse.data.length,

                pendingNotifications:
                notificationsResponse.data.length,

                activeDevices,
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo cargar el resumen del sistema"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const cards = [
        {
            title: "Estudiantes",
            value: summary.students,
            icon: <SchoolIcon />,
            color: "#2F80ED",
            background: "#E8F2FF",
        },

        {
            title: "Asistencias de hoy",
            value: summary.todayAttendances,
            icon: <FactCheckIcon />,
            color: "#2FA36B",
            background: "#E8F7EF",
        },

        {
            title: "Notificaciones pendientes",
            value: summary.pendingNotifications,
            icon: <NotificationsIcon />,
            color: "#F39C3D",
            background: "#FFF4E5",
        },

        {
            title: "Dispositivos activos",
            value: summary.activeDevices,
            icon: <DevicesIcon />,
            color: "#36A7B4",
            background: "#E7F8FA",
        },
    ];

    return (
        <Box>
            <Typography
                variant="h4"
                gutterBottom
            >
                Dashboard
            </Typography>

            <Typography
                color="text.secondary"
                sx={{ mb: 4 }}
            >
                Resumen general del sistema de asistencia
            </Typography>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 6,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {cards.map((card) => (
                        <Grid
                            key={card.title}
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 3,
                            }}
                        >
                            <Card
                                elevation={0}
                                sx={{
                                    height: "100%",

                                    border:
                                        "1px solid #E4EBF3",

                                    borderRadius: 3,

                                    background:
                                        "linear-gradient(135deg, #FFFFFF 0%, #FAFCFF 100%)",

                                    boxShadow:
                                        "0 8px 24px rgba(15,39,66,0.06)",

                                    transition:
                                        "all 0.2s ease",

                                    "&:hover": {
                                        transform:
                                            "translateY(-4px)",

                                        boxShadow:
                                            "0 14px 30px rgba(15,39,66,0.10)",
                                    },
                                }}
                            >
                                <CardContent
                                    sx={{
                                        p: 2.5,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                color="text.secondary"
                                                sx={{
                                                    mb: 1,
                                                    fontWeight:
                                                        500,
                                                }}
                                            >
                                                {card.title}
                                            </Typography>

                                            <Typography
                                                variant="h4"
                                                fontWeight={750}
                                            >
                                                {card.value}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                width: 54,
                                                height: 54,

                                                borderRadius: 2.5,

                                                bgcolor:
                                                card.background,

                                                color:
                                                card.color,

                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                "& svg": {
                                                    fontSize: 28,
                                                },
                                            }}
                                        >
                                            {card.icon}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

export default DashboardPage;