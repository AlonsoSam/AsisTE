import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
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

import api from "../../services/api";

function AttendancesPage() {
    const [attendances, setAttendances] = useState([]);
    const [students, setStudents] = useState([]);
    const [devices, setDevices] = useState([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        studentId: "",
        deviceId: "",
        attendanceDate: "",
        entryTime: "",
        exitTime: "",
        status: "puntual",
    });

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                attendancesResponse,
                studentsResponse,
                devicesResponse,
            ] = await Promise.all([
                api.get("/Attendances"),
                api.get("/Students"),
                api.get("/Devices"),
            ]);

            setAttendances(attendancesResponse.data);
            setStudents(studentsResponse.data);
            setDevices(devicesResponse.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar las asistencias"
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

            await api.post("/Attendances", {
                studentId: form.studentId,
                deviceId: form.deviceId || null,
                attendanceDate: form.attendanceDate,
                entryTime: form.entryTime
                    ? `${form.attendanceDate}T${form.entryTime}:00`
                    : null,
                exitTime: form.exitTime
                    ? `${form.attendanceDate}T${form.exitTime}:00`
                    : null,
                status: form.status,
            });

            setForm({
                studentId: "",
                deviceId: "",
                attendanceDate: "",
                entryTime: "",
                exitTime: "",
                status: "puntual",
            });

            setOpen(false);

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo registrar la asistencia"
            );
        }
    };

    const getStudentName = (studentId) => {
        const student = students.find(
            (item) => item.studentId === studentId
        );

        if (!student) {
            return studentId;
        }

        return `${student.firstName} ${student.lastName}`;
    };

    const getDeviceName = (deviceId) => {
        if (!deviceId) {
            return "-";
        }

        const device = devices.find(
            (item) => item.deviceId === deviceId
        );

        return device?.name || deviceId;
    };

    const getStatusLabel = (status) => {
        if (!status) {
            return "-";
        }

        switch (status.toLowerCase()) {
            case "puntual":
                return "Puntual";

            case "tarde":
                return "Tarde";

            case "ausente":
                return "Ausente";

            default:
                return status;
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
                    <Typography variant="h4" fontWeight="bold">
                        Asistencias
                    </Typography>

                    <Typography color="text.secondary">
                        Registro y control de asistencias
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Nueva asistencia
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Estudiante</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Entrada</TableCell>
                            <TableCell>Salida</TableCell>
                            <TableCell>Dispositivo</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            attendances.map((attendance) => (
                                <TableRow key={attendance.attendanceId}>
                                    <TableCell>
                                        {getStudentName(attendance.studentId)}
                                    </TableCell>

                                    <TableCell>
                                        {attendance.attendanceDate}
                                    </TableCell>

                                    <TableCell>
                                        {attendance.entryTime
                                            ? new Date(
                                                attendance.entryTime
                                            ).toLocaleTimeString()
                                            : "-"}
                                    </TableCell>

                                    <TableCell>
                                        {attendance.exitTime
                                            ? new Date(
                                                attendance.exitTime
                                            ).toLocaleTimeString()
                                            : "-"}
                                    </TableCell>

                                    <TableCell>
                                        {getDeviceName(attendance.deviceId)}
                                    </TableCell>

                                    <TableCell>
                                        {getStatusLabel(attendance.status)}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading && attendances.length === 0 && (
                <Typography
                    textAlign="center"
                    color="text.secondary"
                    sx={{ mt: 3 }}
                >
                    No hay asistencias registradas
                </Typography>
            )}

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
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
                            value={form.studentId}
                            label="Estudiante"
                            onChange={handleChange}
                        >
                            {students.map((student) => (
                                <MenuItem
                                    key={student.studentId}
                                    value={student.studentId}
                                >
                                    {student.firstName}{" "}
                                    {student.lastName}
                                </MenuItem>
                            ))}
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
                            value={form.deviceId}
                            label="Dispositivo"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                Sin dispositivo
                            </MenuItem>

                            {devices.map((device) => (
                                <MenuItem
                                    key={device.deviceId}
                                    value={device.deviceId}
                                >
                                    {device.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Fecha"
                        name="attendanceDate"
                        type="date"
                        value={form.attendanceDate}
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
                        value={form.entryTime}
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
                        value={form.exitTime}
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
                            onChange={handleChange}
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
                    <Button onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        disabled={
                            !form.studentId ||
                            !form.attendanceDate ||
                            !form.status
                        }
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AttendancesPage;