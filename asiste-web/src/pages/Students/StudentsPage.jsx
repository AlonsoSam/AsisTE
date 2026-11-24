import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
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

import api from "../../services/api";

function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);

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
                <Alert severity="error" sx={{ mb: 2 }}>
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
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            students.map((student) => (
                                <TableRow key={student.studentId}>
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
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading && students.length === 0 && (
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
                    <Button onClick={() => setOpen(false)}>
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
        </Box>
    );
}

export default StudentsPage;