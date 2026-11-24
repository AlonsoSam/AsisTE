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
    IconButton,
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
    Tooltip,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

import api from "../../services/api";
import { isAdministrator } from "../../services/auth";

function NotificationsPage() {
    const administrator = isAdministrator();

    const [notifications, setNotifications] =
        useState([]);

    const [guardians, setGuardians] = useState([]);
    const [attendances, setAttendances] = useState([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [
        notificationToDelete,
        setNotificationToDelete,
    ] = useState(null);

    const [form, setForm] = useState({
        guardianId: "",
        attendanceId: "",
        message: "",
    });

    const getGuardianName = (guardianId) => {
        const guardian = guardians.find(
            (item) => item.guardianId === guardianId
        );

        if (!guardian) {
            return "-";
        }

        return `${guardian.firstName} ${guardian.lastName}`;
    };

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/Notifications");

            setNotifications(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar las notificaciones"
            );
        } finally {
            setLoading(false);
        }
    };

    const loadFormData = async () => {
        try {
            const [
                guardiansResponse,
                attendancesResponse,
            ] = await Promise.all([
                api.get("/Guardians"),
                api.get("/Attendances"),
            ]);

            setGuardians(
                guardiansResponse.data
            );

            setAttendances(
                attendancesResponse.data
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar los datos necesarios"
            );
        }
    };

    useEffect(() => {
        loadNotifications();
        loadFormData();
    }, []);

    const handleCreate = async () => {
        try {
            setError("");

            await api.post("/Notifications", {
                guardianId: form.guardianId,
                attendanceId:
                    form.attendanceId || null,
                message: form.message,
            });

            setForm({
                guardianId: "",
                attendanceId: "",
                message: "",
            });

            setOpen(false);

            await loadNotifications();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo registrar la notificación"
            );
        }
    };

    const handleMarkSent = async (notification) => {
        try {
            setError("");

            await api.put(
                `/Notifications/${notification.notificationId}/send`
            );

            await loadNotifications();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo marcar la notificación como enviada"
            );
        }
    };

    const handleOpenDelete = (notification) => {
        setNotificationToDelete(notification);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!notificationToDelete) {
            return;
        }

        try {
            setError("");

            await api.delete(
                `/Notifications/${notificationToDelete.notificationId}`
            );

            setDeleteOpen(false);
            setNotificationToDelete(null);

            await loadNotifications();
        } catch (err) {
            setDeleteOpen(false);
            setNotificationToDelete(null);

            setError(
                err.response?.data?.message ||
                "No se pudo eliminar la notificación"
            );
        }
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
                    <Typography variant="h4">
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
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    border: "1px solid #E4EBF3",
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Apoderado
                            </TableCell>

                            <TableCell>
                                Mensaje
                            </TableCell>

                            <TableCell>
                                Estado
                            </TableCell>

                            <TableCell>
                                Enviado
                            </TableCell>

                            <TableCell align="right">
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            notifications.map(
                                (notification) => (
                                    <TableRow
                                        key={
                                            notification.notificationId
                                        }
                                        hover
                                    >
                                        <TableCell>
                                            {getGuardianName(notification.guardianId)}
                                        </TableCell>

                                        <TableCell>
                                            {
                                                notification.message
                                            }
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    notification.status
                                                }
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {notification.sentAt
                                                ? new Date(
                                                    notification.sentAt
                                                ).toLocaleString()
                                                : "-"}
                                        </TableCell>

                                        <TableCell align="right">
                                            {notification.status !==
                                                "enviado" && (
                                                    <Tooltip title="Marcar enviada">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() =>
                                                                handleMarkSent(
                                                                    notification
                                                                )
                                                            }
                                                        >
                                                            <SendIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                            {administrator && (
                                                <Tooltip title="Eliminar">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() =>
                                                            handleOpenDelete(
                                                                notification
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                    </TableBody>
                </Table>
            </TableContainer>

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
                            value={form.guardianId}
                            label="Apoderado"
                            onChange={(event) =>
                                setForm(
                                    (previous) => ({
                                        ...previous,
                                        guardianId:
                                        event.target.value,
                                    })
                                )
                            }
                        >
                            {guardians.map(
                                (guardian) => (
                                    <MenuItem
                                        key={
                                            guardian.guardianId
                                        }
                                        value={
                                            guardian.guardianId
                                        }
                                    >
                                        {
                                            guardian.firstName
                                        }{" "}
                                        {
                                            guardian.lastName
                                        }
                                    </MenuItem>
                                )
                            )}
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
                            value={
                                form.attendanceId
                            }
                            label="Asistencia"
                            onChange={(event) =>
                                setForm(
                                    (previous) => ({
                                        ...previous,
                                        attendanceId:
                                        event.target.value,
                                    })
                                )
                            }
                        >
                            {attendances.map(
                                (attendance) => (
                                    <MenuItem
                                        key={
                                            attendance.attendanceId
                                        }
                                        value={
                                            attendance.attendanceId
                                        }
                                    >
                                        {attendance.attendanceDate} -{" "}
                                        {attendance.status}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Mensaje"
                        value={form.message}
                        onChange={(event) =>
                            setForm(
                                (previous) => ({
                                    ...previous,
                                    message:
                                    event.target.value,
                                })
                            )
                        }
                        fullWidth
                        multiline
                        minRows={3}
                        margin="normal"
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

            <Dialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setNotificationToDelete(null);
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Eliminar notificación
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        ¿Deseas eliminar esta notificación?
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setDeleteOpen(false);
                            setNotificationToDelete(null);
                        }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleConfirmDelete}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default NotificationsPage;