import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DevicesIcon from "@mui/icons-material/Devices";

function DashboardPage() {
    const cards = [
        {
            title: "Estudiantes",
            value: "0",
            icon: <SchoolIcon fontSize="large" />,
        },
        {
            title: "Asistencias de hoy",
            value: "0",
            icon: <FactCheckIcon fontSize="large" />,
        },
        {
            title: "Notificaciones",
            value: "0",
            icon: <NotificationsIcon fontSize="large" />,
        },
        {
            title: "Dispositivos",
            value: "0",
            icon: <DevicesIcon fontSize="large" />,
        },
    ];

    return (
        <Box>
            <Typography
                variant="h4"
                fontWeight="bold"
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
                        <Card>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box>
                                        <Typography color="text.secondary">
                                            {card.title}
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                        >
                                            {card.value}
                                        </Typography>
                                    </Box>

                                    {card.icon}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default DashboardPage;