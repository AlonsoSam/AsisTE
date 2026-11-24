import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import api from "../../services/api";

function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);

    const [aiOpen, setAiOpen] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSummary, setAiSummary] = useState("");
    const [aiStudent, setAiStudent] = useState(null);

    const [form, setForm] = useState({
        dni: "",
        firstName: "",
        lastName: "",
        grade: "",
        section: "",
    });

    const loadStudents = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/Students");

            setStudents(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar los estudiantes"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
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

            await api.post("/Students", {
                dni: form.dni || null,
                firstName: form.firstName,
                lastName: form.lastName,
                grade: form.grade || null,
                section: form.section || null,
            });

            setForm({
                dni: "",
                firstName: "",
                lastName: "",
                grade: "",
                section: "",
            });

            setOpen(false);

            await loadStudents();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo registrar el estudiante"
            );
        }
    };

    const handleAiSummary = async (student) => {
        try {
            setError("");

            setAiStudent(student);
            setAiSummary("");
            setAiLoading(true);
            setAiOpen(true);

            const response = await api.get(
                `/Students/${student.studentId}/ai-summary`
            );

            setAiSummary(response.data.summary);
        } catch (err) {
            setAiSummary(
                err.response?.data?.message ||
                "No se pudo generar el resumen con IA"
            );
        } finally {
            setAiLoading(false);
        }
    };

    const handleCloseAi = () => {
        if (aiLoading) {
            return;
        }

        setAiOpen(false);
        setAiSummary("");
        setAiStudent(null);
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
                        Estudiantes
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de estudiantes registrados
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Nuevo estudiante
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
                            <TableCell>DNI</TableCell>
                            <TableCell>Nombres</TableCell>
                            <TableCell>Apellidos</TableCell>
                            <TableCell>Grado</TableCell>
                            <TableCell>Sección</TableCell>
                            <TableCell>Estado</TableCell>

                            <TableCell align="right">
                                IA
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            students.map((student) => (
                                <TableRow
                                    key={student.studentId}
                                >
                                    <TableCell>
                                        {student.dni || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {student.firstName}
                                    </TableCell>

                                    <TableCell>
                                        {student.lastName}
                                    </TableCell>

                                    <TableCell>
                                        {student.grade || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {student.section || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {student.active
                                            ? "Activo"
                                            : "Inactivo"}
                                    </TableCell>

                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            startIcon={
                                                <AutoAwesomeIcon />
                                            }
                                            onClick={() =>
                                                handleAiSummary(
                                                    student
                                                )
                                            }
                                        >
                                            Analizar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading &&
                students.length === 0 && (
                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        sx={{ mt: 3 }}
                    >
                        No hay estudiantes registrados
                    </Typography>
                )}

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Nuevo estudiante
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="DNI"
                        name="dni"
                        value={form.dni}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Nombres"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Apellidos"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Grado"
                        name="grade"
                        value={form.grade}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Sección"
                        name="section"
                        value={form.section}
                        onChange={handleChange}
                        fullWidth
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
                            !form.firstName.trim() ||
                            !form.lastName.trim()
                        }
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={aiOpen}
                onClose={handleCloseAi}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Análisis de asistencia con IA
                </DialogTitle>

                <DialogContent>
                    {aiStudent && (
                        <Typography
                            fontWeight="bold"
                            sx={{ mb: 2 }}
                        >
                            {aiStudent.firstName}{" "}
                            {aiStudent.lastName}
                        </Typography>
                    )}

                    {aiLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 2,
                                py: 5,
                            }}
                        >
                            <CircularProgress />

                            <Typography color="text.secondary">
                                Analizando asistencia...
                            </Typography>
                        </Box>
                    ) : (
                        <Typography
                            sx={{
                                whiteSpace: "pre-line",
                                lineHeight: 1.7,
                            }}
                        >
                            {aiSummary}
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleCloseAi}
                        disabled={aiLoading}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default StudentsPage;