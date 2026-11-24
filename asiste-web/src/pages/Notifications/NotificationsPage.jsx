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
    Skeleton,
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
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import api from "../../services/api";
import { isAdministrator } from "../../services/auth";

function NotificationsPage() {
    const administrator =
        isAdministrator();

    const [notifications, setNotifications] =
        useState([]);

    const [guardians, setGuardians] =
        useState([]);

    const [attendances, setAttendances] =
        useState([]);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [open, setOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [
        notificationToDelete,
        setNotificationToDelete,
    ] = useState(null);

    const [filterStatus, setFilterStatus] =
        useState("");

    const [
        filterGuardian,
        setFilterGuardian,
    ] = useState("");

    const [form, setForm] = useState({
        guardianId: "",
        attendanceId: "",
        message: "",
    });

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/Notifications"
                );

            setNotifications(
                response.data
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar las notificaciones"
            );
        } finally {
            setLoading(false);
        }
    };

    const loadRelatedData = async () => {
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
        loadRelatedData();
    }, []);

    const getGuardianName = (
        guardianId
    ) => {
        const guardian =
            guardians.find(
                (item) =>
                    item.guardianId ===
                    guardianId
            );

        if (!guardian) {
            return "-";
        }

        return `${guardian.firstName} ${guardian.lastName}`;
    };

    const getAttendanceLabel = (
        attendanceId
    ) => {
        if (!attendanceId) {
            return "-";
        }

        const attendance =
            attendances.find(
                (item) =>
                    item.attendanceId ===
                    attendanceId
            );

        if (!attendance) {
            return "-";
        }

        return `${attendance.attendanceDate} - ${attendance.status}`;
    };

    const handleCreate = async () => {
        try {
            setError("");
            setSuccess("");

            await api.post(
                "/Notifications",
                {
                    guardianId:
                    form.guardianId,

                    attendanceId:
                        form.attendanceId ||
                        null,

                    message:
                    form.message,
                }
            );

            setForm({
                guardianId: "",
                attendanceId: "",
                message: "",
            });

            setOpen(false);

            setSuccess("Notificación registrada correctamente");

            await loadNotifications();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo registrar la notificación"
            );
        }
    };

    const handleMarkSent = async (
        notification
    ) => {
        try {
            setError("");
            setSuccess("");

            await api.put(
                `/Notifications/${notification.notificationId}/send`
            );

            setSuccess("Notificación marcada como enviada");

            await loadNotifications();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo marcar la notificación como enviada"
            );
        }
    };

    const handleReset = async (
        notification
    ) => {
        try {
            setError("");
            setSuccess("");

            await api.put(
                `/Notifications/${notification.notificationId}/reset`
            );

            setSuccess("Notificación restablecida a pendiente");

            await loadNotifications();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo restablecer la notificación"
            );
        }
    };

    const handleFilterByStatus =
        async (status) => {
            setFilterStatus(status);

            // filtro individual
            setFilterGuardian("");

            if (!status) {
                await loadNotifications();
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/Notifications/status/${status}`
                    );

                setNotifications(
                    response.data
                );
            } catch (err) {
                setError(
                    err.response?.data
                        ?.message ||
                    "No se pudieron filtrar las notificaciones"
                );
            } finally {
                setLoading(false);
            }
        };

    const handleFilterByGuardian =
        async (guardianId) => {
            setFilterGuardian(
                guardianId
            );

            // filtro individual
            setFilterStatus("");

            if (!guardianId) {
                await loadNotifications();
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/Notifications/guardian/${guardianId}`
                    );

                setNotifications(
                    response.data
                );
            } catch (err) {
                setError(
                    err.response?.data
                        ?.message ||
                    "No se pudieron filtrar las notificaciones"
                );
            } finally {
                setLoading(false);
            }
        };

    const handleClearFilters =
        async () => {
            setFilterStatus("");
            setFilterGuardian("");

            await loadNotifications();
        };

    const handleOpenDelete = (
        notification
    ) => {
        setNotificationToDelete(
            notification
        );

        setDeleteOpen(true);
    };

    const handleConfirmDelete =
        async () => {
            if (!notificationToDelete) {
                return;
            }

            try {
                setError("");
                setSuccess("");

                await api.delete(
                    `/Notifications/${notificationToDelete.notificationId}`
                );

                setDeleteOpen(false);

                setNotificationToDelete(
                    null
                );

                setSuccess("Notificación eliminada correctamente");

                await loadNotifications();
            } catch (err) {
                setDeleteOpen(false);

                setNotificationToDelete(
                    null
                );

                setError(
                    err.response?.data
                        ?.message ||
                    "No se pudo eliminar la notificación"
                );
            }
        };

    const getStatusStyle = (
        status
    ) => {
        if (
            status?.toLowerCase() ===
            "enviado"
        ) {
            return {
                bgcolor: "#E8F7EF",
                color: "#2FA36B",
            };
        }

        return {
            bgcolor: "#FFF4E5",
            color: "#C97A17",
        };
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    justifyContent:
                        "space-between",
                    alignItems: {
                        xs: "stretch",
                        sm: "center",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h4">
                        Notificaciones
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de
                        notificaciones para
                        apoderados
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() =>
                        setOpen(true)
                    }
                    sx={{
                        alignSelf: {
                            xs: "stretch",
                            sm: "auto",
                        },
                    }}
                >
                    Nueva notificación
                </Button>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2, borderRadius: 2 }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 2, borderRadius: 2 }}
                    onClose={() => setSuccess("")}
                >
                    {success}
                </Alert>
            )}

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 2,
                    border:
                        "1px solid #E4EBF3",
                    borderRadius: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 210,
                        }}
                    >
                        <InputLabel>
                            Estado
                        </InputLabel>

                        <Select
                            value={
                                filterStatus
                            }
                            label="Estado"
                            onChange={(
                                event
                            ) =>
                                handleFilterByStatus(
                                    event.target
                                        .value
                                )
                            }
                        >
                            <MenuItem value="">
                                Todos
                            </MenuItem>

                            <MenuItem value="pendiente">
                                Pendiente
                            </MenuItem>

                            <MenuItem value="enviado">
                                Enviado
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 240,
                        }}
                    >
                        <InputLabel>
                            Apoderado
                        </InputLabel>

                        <Select
                            value={
                                filterGuardian
                            }
                            label="Apoderado"
                            onChange={(
                                event
                            ) =>
                                handleFilterByGuardian(
                                    event.target
                                        .value
                                )
                            }
                        >
                            <MenuItem value="">
                                Todos
                            </MenuItem>

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

                    <Button
                        variant="outlined"
                        startIcon={
                            <FilterAltOffIcon />
                        }
                        onClick={
                            handleClearFilters
                        }
                    >
                        Limpiar filtros
                    </Button>
                </Box>
            </Paper>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    border:
                        "1px solid #E4EBF3",
                    borderRadius: 3,
                    overflowX: "auto",
                }}
            >
                <Table sx={{ minWidth: 980 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Apoderado
                            </TableCell>

                            <TableCell>
                                Asistencia
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
                        {loading
                            ? Array.from({ length: 4 }).map((_, index) => (
                                <TableRow key={index}>
                                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                                        <TableCell key={cellIndex}>
                                            <Skeleton height={32} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : notifications.map(
                                (
                                    notification
                                ) => (
                                    <TableRow
                                        key={
                                            notification.notificationId
                                        }
                                        hover
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
                                                sx={{
                                                    ...getStatusStyle(
                                                        notification.status
                                                    ),
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {notification.sentAt
                                                ? new Date(
                                                    notification.sentAt
                                                ).toLocaleString(
                                                    "es-PE"
                                                )
                                                : "-"}
                                        </TableCell>

                                        <TableCell align="right">
                                            {notification.status?.toLowerCase() ===
                                                "pendiente" && (
                                                    <Tooltip title="Marcar enviada">
                                                        <IconButton
                                                            aria-label="Marcar notificación como enviada"
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

                                            {notification.status?.toLowerCase() ===
                                                "enviado" && (
                                                    <Tooltip title="Volver a pendiente">
                                                        <IconButton
                                                            aria-label="Restablecer notificación a pendiente"
                                                            sx={{
                                                                color: "#C97A17",
                                                            }}
                                                            onClick={() =>
                                                                handleReset(
                                                                    notification
                                                                )
                                                            }
                                                        >
                                                            <RestartAltIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                            {administrator && (
                                                <Tooltip title="Eliminar">
                                                    <IconButton
                                                        aria-label="Eliminar notificación"
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

            {!loading && notifications.length === 0 && (
                <Paper
                    elevation={0}
                    sx={{
                        mt: 3,
                        py: 6,
                        px: 3,
                        textAlign: "center",
                        border: "1px dashed #CCD9E6",
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.65)",
                    }}
                >
                    <NotificationsNoneOutlinedIcon
                        sx={{
                            fontSize: 52,
                            color: "#9AABBC",
                            mb: 1.5,
                        }}
                    />

                    <Typography fontWeight={700} color="#0F2742">
                        No hay notificaciones para mostrar
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        Las notificaciones registradas aparecerán en esta sección.
                    </Typography>
                </Paper>
            )}

            <Dialog
                open={open}
                onClose={() =>
                    setOpen(false)
                }
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
                            value={
                                form.guardianId
                            }
                            label="Apoderado"
                            onChange={(
                                event
                            ) =>
                                setForm(
                                    (previous) => ({
                                        ...previous,
                                        guardianId:
                                        event
                                            .target
                                            .value,
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
                            onChange={(
                                event
                            ) =>
                                setForm(
                                    (previous) => ({
                                        ...previous,
                                        attendanceId:
                                        event
                                            .target
                                            .value,
                                    })
                                )
                            }
                        >
                            <MenuItem value="">
                                Sin asistencia
                            </MenuItem>

                            {attendances.map(
                                (
                                    attendance
                                ) => (
                                    <MenuItem
                                        key={
                                            attendance.attendanceId
                                        }
                                        value={
                                            attendance.attendanceId
                                        }
                                    >
                                        {
                                            attendance.attendanceDate
                                        }{" "}
                                        -{" "}
                                        {
                                            attendance.status
                                        }
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
                                    event.target
                                        .value,
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
                        onClick={() =>
                            setOpen(false)
                        }
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            handleCreate
                        }
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

                    setNotificationToDelete(
                        null
                    );
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Eliminar notificación
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        ¿Deseas eliminar esta
                        notificación?
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Esta acción no se puede
                        deshacer.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setDeleteOpen(
                                false
                            );

                            setNotificationToDelete(
                                null
                            );
                        }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={
                            handleConfirmDelete
                        }
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default NotificationsPage;
