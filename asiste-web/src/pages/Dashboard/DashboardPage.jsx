import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Paper,
    Skeleton,
    Typography,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DevicesIcon from "@mui/icons-material/Devices";

import api from "../../services/api";

function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [stats, setStats] = useState({
        students: 0,
        attendancesToday: 0,
        pendingNotifications: 0,
        activeDevices: 0,
    });

    const getToday = () => {
        const now = new Date();

        const year = now.getFullYear();

        const month = String(
            now.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            now.getDate()
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

            setStats({
                students:
                studentsResponse.data.length,

                attendancesToday:
                attendancesResponse.data.length,

                pendingNotifications:
                notificationsResponse.data.length,

                activeDevices,
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo cargar la información del dashboard"
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
            value: stats.students,
            icon: <SchoolIcon />,
            iconColor: "#2F80ED",
            iconBackground: "#E8F2FF",
        },
        {
            title: "Asistencias de hoy",
            value: stats.attendancesToday,
            icon: <FactCheckIcon />,
            iconColor: "#2FA36B",
            iconBackground: "#E8F7EF",
        },
        {
            title: "Notificaciones pendientes",
            value: stats.pendingNotifications,
            icon: <NotificationsIcon />,
            iconColor: "#F29A38",
            iconBackground: "#FFF2E2",
        },
        {
            title: "Dispositivos activos",
            value: stats.activeDevices,
            icon: <DevicesIcon />,
            iconColor: "#27A4B8",
            iconBackground: "#E5F7FA",
        },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 750,
                        color: "#0F2742",
                        mb: 0.7,
                    }}
                >
                    Dashboard
                </Typography>

                <Typography
                    color="text.secondary"
                >
                    Resumen general del sistema de asistencia
                </Typography>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError("")}
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    display: "grid",

                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        xl: "repeat(4, 1fr)",
                    },

                    gap: 3,
                }}
            >
                {loading
                    ? Array.from({ length: 4 }).map(
                        (_, index) => (
                            <DashboardSkeleton
                                key={index}
                            />
                        )
                    )
                    : cards.map((card) => (
                        <StatCard
                            key={card.title}
                            {...card}
                        />
                    ))}
            </Box>

            {!loading && !error && (
                <Box
                    sx={{
                        mt: 4,
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "2fr 1fr",
                        },

                        gap: 3,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border:
                                "1px solid #E4EBF3",
                            borderRadius: 3,
                            background:
                                "linear-gradient(135deg, #FFFFFF 0%, #F9FBFE 100%)",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: "#0F2742",
                                mb: 1,
                            }}
                        >
                            Estado del sistema
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                lineHeight: 1.7,
                            }}
                        >
                            AsisTE se encuentra conectado
                            y listo para gestionar
                            estudiantes, asistencias,
                            notificaciones y dispositivos
                            registrados.
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border:
                                "1px solid #E4EBF3",
                            borderRadius: 3,

                            background:
                                "linear-gradient(135deg, #0F2742 0%, #1F5E91 100%)",

                            color: "#FFFFFF",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                            }}
                        >
                            AsisTE
                        </Typography>

                        <Typography
                            sx={{
                                color:
                                    "rgba(255,255,255,0.78)",

                                lineHeight: 1.7,
                            }}
                        >
                            Control inteligente y
                            centralizado de asistencia
                            escolar.
                        </Typography>
                    </Paper>
                </Box>
            )}
        </Box>
    );
}

function StatCard({
                      title,
                      value,
                      icon,
                      iconColor,
                      iconBackground,
                  }) {
    return (
        <Paper
            elevation={0}
            tabIndex={0}
            aria-label={`${title}: ${value}`}
            sx={{
                p: 2.7,

                border:
                    "1px solid #E4EBF3",

                borderRadius: 3,

                minHeight: 120,

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                background:
                    "rgba(255,255,255,0.92)",

                transition:
                    "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",

                "&:hover": {
                    transform:
                        "translateY(-3px)",

                    boxShadow:
                        "0 12px 28px rgba(15,39,66,0.09)",

                    borderColor:
                        "#D4E2F0",
                },

                "&:focus-visible": {
                    outline:
                        "3px solid rgba(47,128,237,0.25)",

                    outlineOffset: 2,
                },
            }}
        >
            <Box>
                <Typography
                    color="text.secondary"
                    sx={{
                        fontSize: 15,
                        mb: 0.7,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 34,
                        fontWeight: 750,
                        color: "#0F2742",
                        lineHeight: 1.1,
                    }}
                >
                    {value}
                </Typography>
            </Box>

            <Box
                aria-hidden="true"
                sx={{
                    width: 58,
                    height: 58,

                    borderRadius: "50%",

                    bgcolor:
                    iconBackground,

                    color:
                    iconColor,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    flexShrink: 0,

                    "& svg": {
                        fontSize: 29,
                    },
                }}
            >
                {icon}
            </Box>
        </Paper>
    );
}

function DashboardSkeleton() {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.7,

                border:
                    "1px solid #E4EBF3",

                borderRadius: 3,

                minHeight: 120,

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Box sx={{ width: "60%" }}>
                <Skeleton
                    width="75%"
                    height={24}
                />

                <Skeleton
                    width={55}
                    height={48}
                />
            </Box>

            <Skeleton
                variant="circular"
                width={58}
                height={58}
            />
        </Paper>
    );
}

export default DashboardPage;