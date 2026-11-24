import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import DeleteIcon from "@mui/icons-material/Delete";

import api from "../../services/api";

function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // modal para crear estudiante
    const [open, setOpen] = useState(false);

    // estados para inteligencia artificial
    const [aiOpen, setAiOpen] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSummary, setAiSummary] = useState("");
    const [aiStudent, setAiStudent] = useState(null);

    // estados para apoderados
    const [guardiansOpen, setGuardiansOpen] = useState(false);
    const [guardianLoading, setGuardianLoading] = useState(false);
    const [studentGuardians, setStudentGuardians] = useState([]);
    const [allGuardians, setAllGuardians] = useState([]);
    const [guardianStudent, setGuardianStudent] = useState(null);

    const [guardianForm, setGuardianForm] = useState({
        guardianId: "",
        relationship: "",
    });

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

    const handleGuardians = async (student) => {
        try {
            setError("");

            setGuardianStudent(student);
            setGuardianLoading(true);
            setGuardiansOpen(true);

            const [
                relationsResponse,
                guardiansResponse,
            ] = await Promise.all([
                api.get(
                    `/Students/${student.studentId}/guardians`
                ),
                api.get("/Guardians"),
            ]);

            setStudentGuardians(relationsResponse.data);
            setAllGuardians(guardiansResponse.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar los apoderados"
            );
        } finally {
            setGuardianLoading(false);
        }
    };

    const handleAssignGuardian = async () => {
        if (!guardianStudent) {
            return;
        }

        try {
            setError("");

            await api.post(
                `/Students/${guardianStudent.studentId}/guardians`,
                {
                    guardianId: guardianForm.guardianId,
                    relationship:
                        guardianForm.relationship || null,
                }
            );

            setGuardianForm({
                guardianId: "",
                relationship: "",
            });

            const response = await api.get(
                `/Students/${guardianStudent.studentId}/guardians`
            );

            setStudentGuardians(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo asignar el apoderado"
            );
        }
    };

    const handleRemoveGuardian = async (guardianId) => {
        if (!guardianStudent) {
            return;
        }

        try {
            setError("");

            await api.delete(
                `/Students/${guardianStudent.studentId}/guardians/${guardianId}`
            );

            setStudentGuardians((previous) =>
                previous.filter(
                    (guardian) =>
                        guardian.guardianId !== guardianId
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo desvincular el apoderado"
            );
        }
    };

    const handleCloseGuardians = () => {
        setGuardiansOpen(false);
        setGuardianStudent(null);
        setStudentGuardians([]);
        setGuardianForm({
            guardianId: "",
            relationship: "",
        });
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ color: "#16324F" }}
                    >
                        Estudiantes
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Gestión de estudiantes registrados
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: "#1F6FB2",
                        "&:hover": {
                            bgcolor: "#185B93",
                        },
                    }}
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

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    border: "1px solid #E1E7ED",
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow
                            sx={{
                                bgcolor: "#F4F7FA",
                            }}
                        >
                            <TableCell sx={{ fontWeight: 700 }}>
                                DNI
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Nombres
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Apellidos
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Grado
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Sección
                            </TableCell>

                            <TableCell sx={{ fontWeight: 700 }}>
                                Estado
                            </TableCell>

                            <TableCell
                                align="right"
                                sx={{ fontWeight: 700 }}
                            >
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            students.map((student) => (
                                <TableRow
                                    key={student.studentId}
                                    hover
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
                                        <Chip
                                            label={
                                                student.active
                                                    ? "Activo"
                                                    : "Inactivo"
                                            }
                                            size="small"
                                            sx={{
                                                bgcolor: student.active
                                                    ? "#E7F4EC"
                                                    : "#F2F2F2",
                                                color: student.active
                                                    ? "#2E7D4F"
                                                    : "#666",
                                                fontWeight: 600,
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            startIcon={
                                                <FamilyRestroomIcon />
                                            }
                                            onClick={() =>
                                                handleGuardians(
                                                    student
                                                )
                                            }
                                            sx={{
                                                textTransform: "none",
                                                mr: 1,
                                                color: "#546E7A",
                                            }}
                                        >
                                            Apoderados
                                        </Button>

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
                                            sx={{
                                                textTransform: "none",
                                                color: "#1F6FB2",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Analizar IA
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

            {/* crear estudiante */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Registrar estudiante
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
                        sx={{
                            textTransform: "none",
                        }}
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
                        sx={{
                            textTransform: "none",
                            bgcolor: "#1F6FB2",
                        }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* apoderados */}
            <Dialog
                open={guardiansOpen}
                onClose={handleCloseGuardians}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Apoderados del estudiante
                </DialogTitle>

                <DialogContent>
                    {guardianStudent && (
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                fontWeight={700}
                                sx={{ color: "#16324F" }}
                            >
                                {guardianStudent.firstName}{" "}
                                {guardianStudent.lastName}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Gestiona las personas responsables
                                asociadas al estudiante
                            </Typography>
                        </Box>
                    )}

                    {guardianLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                py: 4,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {studentGuardians.length === 0 ? (
                                <Alert
                                    severity="info"
                                    sx={{ mb: 2 }}
                                >
                                    Todavía no tiene apoderados
                                    asignados.
                                </Alert>
                            ) : (
                                studentGuardians.map(
                                    (guardian) => (
                                        <Paper
                                            key={
                                                guardian.guardianId
                                            }
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                mb: 1.5,
                                                border:
                                                    "1px solid #E1E7ED",
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center",
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    fontWeight={600}
                                                >
                                                    {
                                                        guardian.firstName
                                                    }{" "}
                                                    {
                                                        guardian.lastName
                                                    }
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {guardian.relationship ||
                                                        "Sin parentesco especificado"}
                                                </Typography>
                                            </Box>

                                            <Button
                                                color="error"
                                                size="small"
                                                startIcon={
                                                    <DeleteIcon />
                                                }
                                                onClick={() =>
                                                    handleRemoveGuardian(
                                                        guardian.guardianId
                                                    )
                                                }
                                                sx={{
                                                    textTransform:
                                                        "none",
                                                }}
                                            >
                                                Desvincular
                                            </Button>
                                        </Paper>
                                    )
                                )
                            )}

                            <Typography
                                fontWeight={700}
                                sx={{
                                    mt: 3,
                                    color: "#16324F",
                                }}
                            >
                                Asignar apoderado
                            </Typography>

                            <FormControl
                                fullWidth
                                margin="normal"
                            >
                                <InputLabel>
                                    Apoderado
                                </InputLabel>

                                <Select
                                    value={
                                        guardianForm.guardianId
                                    }
                                    label="Apoderado"
                                    onChange={(event) =>
                                        setGuardianForm(
                                            (previous) => ({
                                                ...previous,
                                                guardianId:
                                                event.target
                                                    .value,
                                            })
                                        )
                                    }
                                >
                                    {allGuardians.map(
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

                            <TextField
                                label="Parentesco"
                                value={
                                    guardianForm.relationship
                                }
                                onChange={(event) =>
                                    setGuardianForm(
                                        (previous) => ({
                                            ...previous,
                                            relationship:
                                            event.target.value,
                                        })
                                    )
                                }
                                fullWidth
                                margin="normal"
                                placeholder="Ej. Madre, Padre, Tutor"
                            />
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleCloseGuardians}
                        sx={{
                            textTransform: "none",
                        }}
                    >
                        Cerrar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleAssignGuardian}
                        disabled={
                            !guardianForm.guardianId
                        }
                        sx={{
                            textTransform: "none",
                            bgcolor: "#1F6FB2",
                        }}
                    >
                        Asignar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* inteligencia artificial */}
            <Dialog
                open={aiOpen}
                onClose={handleCloseAi}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Resumen de asistencia
                </DialogTitle>

                <DialogContent>
                    {aiStudent && (
                        <Box
                            sx={{
                                mb: 2,
                                borderLeft:
                                    "4px solid #1F6FB2",
                                pl: 2,
                            }}
                        >
                            <Typography
                                fontWeight={700}
                                sx={{
                                    color: "#16324F",
                                }}
                            >
                                {aiStudent.firstName}{" "}
                                {aiStudent.lastName}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Análisis generado a partir de
                                sus registros de asistencia
                            </Typography>
                        </Box>
                    )}

                    {aiLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                                py: 5,
                            }}
                        >
                            <CircularProgress />

                            <Typography
                                color="text.secondary"
                            >
                                Analizando registros...
                            </Typography>
                        </Box>
                    ) : (
                        <Typography
                            sx={{
                                lineHeight: 1.75,
                                whiteSpace: "pre-line",
                            }}
                        >
                            {aiSummary
                                .replaceAll("**", "")}
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleCloseAi}
                        disabled={aiLoading}
                        sx={{
                            textTransform: "none",
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default StudentsPage;