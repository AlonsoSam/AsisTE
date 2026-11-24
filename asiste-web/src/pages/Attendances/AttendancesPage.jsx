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
import EditIcon from "@mui/icons-material/Edit";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import api from "../../services/api";

function AttendancesPage() {
    const [attendances, setAttendances] = useState([]);
    const [students, setStudents] = useState([]);
    const [devices, setDevices] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const [selectedAttendance, setSelectedAttendance] =
        useState(null);

    const [filterDate, setFilterDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const [form, setForm] = useState({
        studentId: "",
        deviceId: "",
        attendanceDate: "",
        entryTime: "",
        exitTime: "",
        status: "puntual",
    });

    const [editForm, setEditForm] = useState({
        entryTime: "",
        exitTime: "",
        status: "puntual",
    });

    const loadAttendances = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/Attendances"
            );

            setAttendances(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar las asistencias"
            );
        } finally {
            setLoading(false);
        }
    };

    const loadRelatedData = async () => {
        try {
            const [
                studentsResponse,
                devicesResponse,
            ] = await Promise.all([
                api.get("/Students"),
                api.get("/Devices"),
            ]);

            setStudents(studentsResponse.data);
            setDevices(devicesResponse.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar los datos necesarios"
            );
        }
    };

    useEffect(() => {
        loadAttendances();
        loadRelatedData();
    }, []);

    const getStudentName = (studentId) => {
        const student = students.find(
            (item) =>
                item.studentId === studentId
        );

        if (!student) {
            return "-";
        }

        return `${student.firstName} ${student.lastName}`;
    };

    const getDeviceName = (deviceId) => {
        if (!deviceId) {
            return "-";
        }

        const device = devices.find(
            (item) =>
                item.deviceId === deviceId
        );

        return device?.name || "-";
    };

    const formatTime = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleTimeString(
            "es-PE",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const getTimeForInput = (value) => {
        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const hours = String(
            date.getHours()
        ).padStart(2, "0");

        const minutes = String(
            date.getMinutes()
        ).padStart(2, "0");

        return `${hours}:${minutes}`;
    };

    const getStatusStyle = (status) => {
        const normalized =
            status?.toLowerCase();

        if (normalized === "puntual") {
            return {
                bgcolor: "#E8F7EF",
                color: "#2FA36B",
            };
        }

        if (normalized === "tarde") {
            return {
                bgcolor: "#FFF4E5",
                color: "#C97A17",
            };
        }

        return {
            bgcolor: "#FFF0F0",
            color: "#D64545",
        };
    };

    const handleChange = (event) => {
        const { name, value } =
            event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCreate = async () => {
        try {
            setError("");

            await api.post(
                "/Attendances",
                {
                    studentId:
                    form.studentId,

                    deviceId:
                        form.deviceId ||
                        null,

                    attendanceDate:
                    form.attendanceDate,

                    entryTime:
                        form.entryTime
                            ? `${form.attendanceDate}T${form.entryTime}:00`
                            : null,

                    exitTime:
                        form.exitTime
                            ? `${form.attendanceDate}T${form.exitTime}:00`
                            : null,

                    status:
                    form.status,
                }
            );

            setForm({
                studentId: "",
                deviceId: "",
                attendanceDate: "",
                entryTime: "",
                exitTime: "",
                status: "puntual",
            });

            setOpen(false);

            await loadAttendances();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo registrar la asistencia"
            );
        }
    };

    const handleOpenEdit = (
        attendance
    ) => {
        setSelectedAttendance(
            attendance
        );

        setEditForm({
            entryTime:
                getTimeForInput(
                    attendance.entryTime
                ),

            exitTime:
                getTimeForInput(
                    attendance.exitTime
                ),

            status:
                attendance.status ||
                "puntual",
        });

        setEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedAttendance) {
            return;
        }

        try {
            setError("");

            const date =
                selectedAttendance.attendanceDate;

            await api.put(
                `/Attendances/${selectedAttendance.attendanceId}`,
                {
                    entryTime:
                        editForm.entryTime
                            ? `${date}T${editForm.entryTime}:00`
                            : null,

                    exitTime:
                        editForm.exitTime
                            ? `${date}T${editForm.exitTime}:00`
                            : null,

                    status:
                    editForm.status,
                }
            );

            setEditOpen(false);
            setSelectedAttendance(null);

            await loadAttendances();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo actualizar la asistencia"
            );
        }
    };

    const handleFilterByDate =
        async (date) => {
            setFilterDate(date);

            // trabajamos un filtro a la vez
            setFilterStatus("");

            if (!date) {
                await loadAttendances();
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/Attendances/date/${date}`
                    );

                setAttendances(
                    response.data
                );
            } catch (err) {
                setError(
                    err.response?.data
                        ?.message ||
                    "No se pudieron filtrar las asistencias"
                );
            } finally {
                setLoading(false);
            }
        };

    const handleFilterByStatus =
        async (status) => {
            setFilterStatus(status);

            // trabajamos un filtro a la vez
            setFilterDate("");

            if (!status) {
                await loadAttendances();
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/Attendances/status/${status}`
                    );

                setAttendances(
                    response.data
                );
            } catch (err) {
                setError(
                    err.response?.data
                        ?.message ||
                    "No se pudieron filtrar las asistencias"
                );
            } finally {
                setLoading(false);
            }
        };

    const handleClearFilters =
        async () => {
            setFilterDate("");
            setFilterStatus("");

            await loadAttendances();
        };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h4">
                        Asistencias
                    </Typography>

                    <Typography color="text.secondary">
                        Registro y control de
                        asistencias
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() =>
                        setOpen(true)
                    }
                >
                    Nueva asistencia
                </Button>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
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
                    <TextField
                        label="Filtrar por fecha"
                        type="date"
                        size="small"
                        value={filterDate}
                        onChange={(event) =>
                            handleFilterByDate(
                                event.target.value
                            )
                        }
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 190,
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

                            <MenuItem value="puntual">
                                Puntual
                            </MenuItem>

                            <MenuItem value="tarde">
                                Tarde
                            </MenuItem>

                            <MenuItem value="ausente">
                                Ausente
                            </MenuItem>
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
                    overflow: "hidden",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Estudiante
                            </TableCell>

                            <TableCell>
                                Fecha
                            </TableCell>

                            <TableCell>
                                Entrada
                            </TableCell>

                            <TableCell>
                                Salida
                            </TableCell>

                            <TableCell>
                                Dispositivo
                            </TableCell>

                            <TableCell>
                                Estado
                            </TableCell>

                            <TableCell align="right">
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            attendances.map(
                                (
                                    attendance
                                ) => (
                                    <TableRow
                                        key={
                                            attendance.attendanceId
                                        }
                                        hover
                                    >
                                        <TableCell>
                                            {getStudentName(
                                                attendance.studentId
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {
                                                attendance.attendanceDate
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {formatTime(
                                                attendance.entryTime
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {formatTime(
                                                attendance.exitTime
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {getDeviceName(
                                                attendance.deviceId
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    attendance.status
                                                }
                                                size="small"
                                                sx={{
                                                    ...getStatusStyle(
                                                        attendance.status
                                                    ),
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    onClick={() =>
                                                        handleOpenEdit(
                                                            attendance
                                                        )
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading &&
                attendances.length ===
                0 && (
                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        sx={{ mt: 3 }}
                    >
                        No hay asistencias para
                        mostrar
                    </Typography>
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
                    Nueva asistencia
                </DialogTitle>

                <DialogContent>
                    <FormControl
                        fullWidth
                        margin="normal"
                    >
                        <InputLabel>
                            Estudiante
                        </InputLabel>

                        <Select
                            name="studentId"
                            value={
                                form.studentId
                            }
                            label="Estudiante"
                            onChange={
                                handleChange
                            }
                        >
                            {students.map(
                                (student) => (
                                    <MenuItem
                                        key={
                                            student.studentId
                                        }
                                        value={
                                            student.studentId
                                        }
                                    >
                                        {
                                            student.firstName
                                        }{" "}
                                        {
                                            student.lastName
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
                            Dispositivo
                        </InputLabel>

                        <Select
                            name="deviceId"
                            value={
                                form.deviceId
                            }
                            label="Dispositivo"
                            onChange={
                                handleChange
                            }
                        >
                            <MenuItem value="">
                                Sin dispositivo
                            </MenuItem>

                            {devices.map(
                                (device) => (
                                    <MenuItem
                                        key={
                                            device.deviceId
                                        }
                                        value={
                                            device.deviceId
                                        }
                                    >
                                        {
                                            device.name
                                        }
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Fecha"
                        name="attendanceDate"
                        type="date"
                        value={
                            form.attendanceDate
                        }
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField
                        label="Hora de entrada"
                        name="entryTime"
                        type="time"
                        value={
                            form.entryTime
                        }
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField
                        label="Hora de salida"
                        name="exitTime"
                        type="time"
                        value={
                            form.exitTime
                        }
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <FormControl
                        fullWidth
                        margin="normal"
                    >
                        <InputLabel>
                            Estado
                        </InputLabel>

                        <Select
                            name="status"
                            value={form.status}
                            label="Estado"
                            onChange={
                                handleChange
                            }
                        >
                            <MenuItem value="puntual">
                                Puntual
                            </MenuItem>

                            <MenuItem value="tarde">
                                Tarde
                            </MenuItem>

                            <MenuItem value="ausente">
                                Ausente
                            </MenuItem>
                        </Select>
                    </FormControl>
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
                            !form.studentId ||
                            !form.attendanceDate
                        }
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={editOpen}
                onClose={() =>
                    setEditOpen(false)
                }
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Editar asistencia
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Hora de entrada"
                        type="time"
                        value={
                            editForm.entryTime
                        }
                        onChange={(event) =>
                            setEditForm(
                                (previous) => ({
                                    ...previous,
                                    entryTime:
                                    event
                                        .target
                                        .value,
                                })
                            )
                        }
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField
                        label="Hora de salida"
                        type="time"
                        value={
                            editForm.exitTime
                        }
                        onChange={(event) =>
                            setEditForm(
                                (previous) => ({
                                    ...previous,
                                    exitTime:
                                    event
                                        .target
                                        .value,
                                })
                            )
                        }
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <FormControl
                        fullWidth
                        margin="normal"
                    >
                        <InputLabel>
                            Estado
                        </InputLabel>

                        <Select
                            value={
                                editForm.status
                            }
                            label="Estado"
                            onChange={(event) =>
                                setEditForm(
                                    (previous) => ({
                                        ...previous,
                                        status:
                                        event
                                            .target
                                            .value,
                                    })
                                )
                            }
                        >
                            <MenuItem value="puntual">
                                Puntual
                            </MenuItem>

                            <MenuItem value="tarde">
                                Tarde
                            </MenuItem>

                            <MenuItem value="ausente">
                                Ausente
                            </MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setEditOpen(false)
                        }
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            handleUpdate
                        }
                    >
                        Actualizar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AttendancesPage;