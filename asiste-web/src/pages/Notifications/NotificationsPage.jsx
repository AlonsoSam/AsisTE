import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";

import api from "../../services/api";

function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [guardians, setGuardians] = useState([]);
    const [attendances, setAttendances] = useState([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        guardianId: "",
        attendanceId: "",
        message: "",
    });

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                notificationsResponse,
                guardiansResponse,
                attendancesResponse,
            ] = await Promise.all([
                api.get("/Notifications"),
                api.get("/Guardians"),
                api.get("/Attendances"),
            ]);

            setNotifications(notificationsResponse.data);
            setGuardians(guardiansResponse.data);
            setAttendances(attendancesResponse.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar las notificaciones"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCreate = async () => {
        try {
            setError("");

            await api.post("/Notifications", {
                guardianId: form.guardianId,
                attendanceId: form.attendanceId || null,
                message: form.message,
            });

            setForm({
                guardianId: "",
                attendanceId: "",
                message: "",
            });

            setOpen(false);

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo registrar la notificación"
            );
        }
    };

    const handleMarkAsSent = async (notificationId) => {
        try {
            setError("");

            await api.put(
                `/Notifications/${notificationId}/send`
            );

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo actualizar la notificación"
            );
        }
    };

    const getGuardianName = (guardianId) => {
        const guardian = guardians.find(
            (item) => item.guardianId === guardianId
        );

        if (!guardian) {
            return guardianId;
        }

        return `${guardian.firstName} ${guardian.lastName}`;
    };

    const getAttendanceLabel = (attendanceId) => {
        if (!attendanceId) {
            return "-";
        }

        const attendance = attendances.find(
            (item) => item.attendanceId === attendanceId
        );

        if (!attendance) {
            return attendanceId;
        }

        return `${attendance.attendanceDate} - ${attendance.status}`;
    };

    const getStatusChip = (status) => {
        const normalizedStatus =
            status?.toLowerCase() || "pendiente";

        if (normalizedStatus === "enviado") {
            return (
                <Chip
                    label="Enviado"
                    color="success"
                    size="small"
                />
            );
        }

        return (
            <Chip
                label="Pendiente"
                color="warning"
                size="small"
            />
        );
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Notificaciones
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de notificaciones para apoderados
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Nueva notificación
                </Button>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Apoderado</TableCell>
                            <TableCell>Asistencia</TableCell>
                            <TableCell>Mensaje</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Enviado</TableCell>
                            <TableCell align="right">
                                Acción
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            notifications.map((notification) => (
                                <TableRow
                                    key={notification.notificationId}
                                >
                                    <TableCell>
                                        {getGuardianName(
                                            notification.guardianId
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {getAttendanceLabel(
                                            notification.attendanceId
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {notification.message}
                                    </TableCell>

                                    <TableCell>
                                        {getStatusChip(
                                            notification.status
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {notification.sentAt
                                            ? new Date(
                                                notification.sentAt
                                            ).toLocaleString()
                                            : "-"}
                                    </TableCell>

                                    <TableCell align="right">
                                        {notification.status?.toLowerCase() !==
                                            "enviado" && (
                                                <Button
                                                    size="small"
                                                    startIcon={<SendIcon />}
                                                    onClick={() =>
                                                        handleMarkAsSent(
                                                            notification.notificationId
                                                        )
                                                    }
                                                >
                                                    Marcar enviada
                                                </Button>
                                            )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading &&
                notifications.length === 0 && (
                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        sx={{ mt: 3 }}
                    >
                        No hay notificaciones registradas
                    </Typography>
                )}

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Nueva notificación
                </DialogTitle>

                <DialogContent>
                    <FormControl
                        fullWidth
                        margin="normal"
                    >
                        <InputLabel>
                            Apoderado
                        </InputLabel>

                        <Select
                            name="guardianId"
                            value={form.guardianId}
                            label="Apoderado"
                            onChange={handleChange}
                        >
                            {guardians.map((guardian) => (
                                <MenuItem
                                    key={guardian.guardianId}
                                    value={guardian.guardianId}
                                >
                                    {guardian.firstName}{" "}
                                    {guardian.lastName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl
                        fullWidth
                        margin="normal"
                    >
                        <InputLabel>
                            Asistencia
                        </InputLabel>

                        <Select
                            name="attendanceId"
                            value={form.attendanceId}
                            label="Asistencia"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                Sin asistencia relacionada
                            </MenuItem>

                            {attendances.map((attendance) => (
                                <MenuItem
                                    key={attendance.attendanceId}
                                    value={attendance.attendanceId}
                                >
                                    {attendance.attendanceDate} -{" "}
                                    {attendance.status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Mensaje"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        minRows={4}
                        margin="normal"
                        required
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpen(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        disabled={
                            !form.guardianId ||
                            !form.message.trim()
                        }
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default NotificationsPage;