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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

import api from "../../services/api";
import { isAdministrator } from "../../services/auth";

function StudentsPage() {
    const administrator = isAdministrator();

    const [students, setStudents] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        dni: "",
        firstName: "",
        lastName: "",
        grade: "",
        section: "",
    });

    const [editOpen, setEditOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [editForm, setEditForm] = useState({
        dni: "",
        firstName: "",
        lastName: "",
        grade: "",
        section: "",
        active: true,
    });

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyStudent, setHistoryStudent] = useState(null);
    const [studentAttendances, setStudentAttendances] = useState([]);

    const [historyDates, setHistoryDates] = useState({
        startDate: "",
        endDate: "",
    });

    const [aiOpen, setAiOpen] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSummary, setAiSummary] = useState("");
    const [aiStudent, setAiStudent] = useState(null);

    const [guardiansOpen, setGuardiansOpen] = useState(false);
    const [guardianLoading, setGuardianLoading] = useState(false);
    const [studentGuardians, setStudentGuardians] = useState([]);
    const [allGuardians, setAllGuardians] = useState([]);
    const [guardianStudent, setGuardianStudent] = useState(null);

    const [guardianForm, setGuardianForm] = useState({
        guardianId: "",
        relationship: "",
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
            setSuccess("");

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

            setSuccess(
                "Estudiante registrado correctamente"
            );

            await loadStudents();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo registrar el estudiante"
            );
        }
    };

    const handleOpenEdit = (student) => {
        setSelectedStudent(student);

        setEditForm({
            dni: student.dni || "",
            firstName: student.firstName || "",
            lastName: student.lastName || "",
            grade: student.grade || "",
            section: student.section || "",
            active: student.active,
        });

        setEditOpen(true);
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        if (!selectedStudent) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.put(
                `/Students/${selectedStudent.studentId}`,
                {
                    dni: editForm.dni || null,
                    firstName: editForm.firstName,
                    lastName: editForm.lastName,
                    grade: editForm.grade || null,
                    section: editForm.section || null,
                    active: editForm.active,
                }
            );

            setEditOpen(false);
            setSelectedStudent(null);

            setSuccess(
                "Estudiante actualizado correctamente"
            );

            await loadStudents();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo actualizar el estudiante"
            );
        }
    };

    const handleOpenDelete = (student) => {
        setStudentToDelete(student);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!studentToDelete) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/Students/${studentToDelete.studentId}`
            );

            setDeleteOpen(false);
            setStudentToDelete(null);

            setSuccess(
                "Estudiante eliminado correctamente"
            );

            await loadStudents();
        } catch (err) {
            setDeleteOpen(false);
            setStudentToDelete(null);

            setError(
                err.response?.data?.message ||
                "No se pudo eliminar el estudiante"
            );
        }
    };

    const handleAttendanceHistory = async (student) => {
        try {
            setError("");

            setHistoryStudent(student);
            setHistoryLoading(true);
            setHistoryOpen(true);

            setHistoryDates({
                startDate: "",
                endDate: "",
            });

            const response = await api.get(
                `/Attendances/student/${student.studentId}`
            );

            setStudentAttendances(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo cargar el historial de asistencia"
            );
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleFilterHistory = async () => {
        if (
            !historyStudent ||
            !historyDates.startDate ||
            !historyDates.endDate
        ) {
            return;
        }

        try {
            setHistoryLoading(true);
            setError("");

            const response = await api.get(
                `/Attendances/student/${historyStudent.studentId}/range`,
                {
                    params: {
                        startDate: historyDates.startDate,
                        endDate: historyDates.endDate,
                    },
                }
            );

            setStudentAttendances(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo filtrar el historial"
            );
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleResetHistory = async () => {
        if (!historyStudent) {
            return;
        }

        try {
            setHistoryLoading(true);
            setError("");

            setHistoryDates({
                startDate: "",
                endDate: "",
            });

            const response = await api.get(
                `/Attendances/student/${historyStudent.studentId}`
            );

            setStudentAttendances(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo cargar el historial"
            );
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleCloseHistory = () => {
        setHistoryOpen(false);
        setHistoryStudent(null);
        setStudentAttendances([]);

        setHistoryDates({
            startDate: "",
            endDate: "",
        });
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

            const requests = [
                api.get(
                    `/Students/${student.studentId}/guardians`
                ),
            ];

            if (administrator) {
                requests.push(
                    api.get("/Guardians")
                );
            }

            const responses =
                await Promise.all(requests);

            setStudentGuardians(
                responses[0].data
            );

            if (administrator) {
                setAllGuardians(
                    responses[1].data
                );
            }
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
        if (
            !administrator ||
            !guardianStudent
        ) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.post(
                `/Students/${guardianStudent.studentId}/guardians`,
                {
                    guardianId:
                    guardianForm.guardianId,

                    relationship:
                        guardianForm.relationship ||
                        null,
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

            setSuccess(
                "Apoderado asignado correctamente"
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo asignar el apoderado"
            );
        }
    };

    const handleRemoveGuardian = async (
        guardianId
    ) => {
        if (
            !administrator ||
            !guardianStudent
        ) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/Students/${guardianStudent.studentId}/guardians/${guardianId}`
            );

            setStudentGuardians((previous) =>
                previous.filter(
                    (guardian) =>
                        guardian.guardianId !==
                        guardianId
                )
            );

            setSuccess(
                "Apoderado desvinculado correctamente"
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
        setAllGuardians([]);

        setGuardianForm({
            guardianId: "",
            relationship: "",
        });
    };

    const getAttendanceStatusStyle = (
        status
    ) => {
        const normalizedStatus =
            status?.toLowerCase() || "";

        if (normalizedStatus === "puntual") {
            return {
                background: "#E8F7EF",
                color: "#2FA36B",
            };
        }

        if (normalizedStatus === "tarde") {
            return {
                background: "#FFF4E5",
                color: "#C97A17",
            };
        }

        return {
            background: "#FFF0F0",
            color: "#D64545",
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
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#0F2742",
                        }}
                    >
                        Estudiantes
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de estudiantes registrados
                    </Typography>
                </Box>

                {administrator && (
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
                        Nuevo estudiante
                    </Button>
                )}
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                    }}
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
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                    }}
                    onClose={() =>
                        setSuccess("")
                    }
                >
                    {success}
                </Alert>
            )}

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
                <Table
                    sx={{
                        minWidth: 1050,
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                DNI
                            </TableCell>

                            <TableCell>
                                Nombres
                            </TableCell>

                            <TableCell>
                                Apellidos
                            </TableCell>

                            <TableCell>
                                Grado
                            </TableCell>

                            <TableCell>
                                Sección
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
                        {loading
                            ? Array.from({
                                length: 4,
                            }).map(
                                (_, index) => (
                                    <TableRow
                                        key={
                                            index
                                        }
                                    >
                                        {Array.from(
                                            {
                                                length: 7,
                                            }
                                        ).map(
                                            (
                                                _,
                                                cellIndex
                                            ) => (
                                                <TableCell
                                                    key={
                                                        cellIndex
                                                    }
                                                >
                                                    <Skeleton
                                                        height={
                                                            32
                                                        }
                                                    />
                                                </TableCell>
                                            )
                                        )}
                                    </TableRow>
                                )
                            )
                            : students.map(
                                (student) => (
                                    <TableRow
                                        key={
                                            student.studentId
                                        }
                                        hover
                                    >
                                        <TableCell>
                                            {student.dni ||
                                                "-"}
                                        </TableCell>

                                        <TableCell>
                                            {
                                                student.firstName
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                student.lastName
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {student.grade ||
                                                "-"}
                                        </TableCell>

                                        <TableCell>
                                            {student.section ||
                                                "-"}
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
                                                    bgcolor:
                                                        student.active
                                                            ? "#E8F7EF"
                                                            : "#F2F2F2",

                                                    color:
                                                        student.active
                                                            ? "#2FA36B"
                                                            : "#667788",

                                                    fontWeight:
                                                        600,
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
                                                    color:
                                                        "#667788",
                                                }}
                                            >
                                                Apoderados
                                            </Button>

                                            <Button
                                                size="small"
                                                startIcon={
                                                    <HistoryIcon />
                                                }
                                                onClick={() =>
                                                    handleAttendanceHistory(
                                                        student
                                                    )
                                                }
                                            >
                                                Historial
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
                                            >
                                                IA
                                            </Button>

                                            {administrator && (
                                                <>
                                                    <Tooltip title="Editar">
                                                        <IconButton
                                                            size="small"
                                                            aria-label={`Editar ${student.firstName} ${student.lastName}`}
                                                            onClick={() =>
                                                                handleOpenEdit(
                                                                    student
                                                                )
                                                            }
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Eliminar">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            aria-label={`Eliminar ${student.firstName} ${student.lastName}`}
                                                            onClick={() =>
                                                                handleOpenDelete(
                                                                    student
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading &&
                students.length === 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            mt: 3,
                            py: 6,
                            px: 3,

                            textAlign:
                                "center",

                            border:
                                "1px dashed #CCD9E6",

                            borderRadius: 3,

                            bgcolor:
                                "rgba(255,255,255,0.65)",
                        }}
                    >
                        <SchoolOutlinedIcon
                            sx={{
                                fontSize: 52,
                                color:
                                    "#9AABBC",
                                mb: 1.5,
                            }}
                        />

                        <Typography
                            fontWeight={700}
                            color="#0F2742"
                        >
                            Aún no hay estudiantes
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Los estudiantes registrados
                            aparecerán en esta sección.
                        </Typography>
                    </Paper>
                )}

            {administrator && (
                <>
                    <Dialog
                        open={open}
                        onClose={() =>
                            setOpen(false)
                        }
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
                                onChange={
                                    handleChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Nombres"
                                name="firstName"
                                value={
                                    form.firstName
                                }
                                onChange={
                                    handleChange
                                }
                                fullWidth
                                margin="normal"
                                autoFocus
                            />

                            <TextField
                                label="Apellidos"
                                name="lastName"
                                value={
                                    form.lastName
                                }
                                onChange={
                                    handleChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Grado"
                                name="grade"
                                value={
                                    form.grade
                                }
                                onChange={
                                    handleChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Sección"
                                name="section"
                                value={
                                    form.section
                                }
                                onChange={
                                    handleChange
                                }
                                fullWidth
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
                                    !form.firstName.trim() ||
                                    !form.lastName.trim()
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
                            Editar estudiante
                        </DialogTitle>

                        <DialogContent>
                            <TextField
                                label="DNI"
                                name="dni"
                                value={
                                    editForm.dni
                                }
                                onChange={
                                    handleEditChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Nombres"
                                name="firstName"
                                value={
                                    editForm.firstName
                                }
                                onChange={
                                    handleEditChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Apellidos"
                                name="lastName"
                                value={
                                    editForm.lastName
                                }
                                onChange={
                                    handleEditChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Grado"
                                name="grade"
                                value={
                                    editForm.grade
                                }
                                onChange={
                                    handleEditChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Sección"
                                name="section"
                                value={
                                    editForm.section
                                }
                                onChange={
                                    handleEditChange
                                }
                                fullWidth
                                margin="normal"
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
                                        editForm.active
                                            ? "activo"
                                            : "inactivo"
                                    }
                                    label="Estado"
                                    onChange={(
                                        event
                                    ) =>
                                        setEditForm(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,

                                                active:
                                                    event
                                                        .target
                                                        .value ===
                                                    "activo",
                                            })
                                        )
                                    }
                                >
                                    <MenuItem value="activo">
                                        Activo
                                    </MenuItem>

                                    <MenuItem value="inactivo">
                                        Inactivo
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>

                        <DialogActions>
                            <Button
                                onClick={() =>
                                    setEditOpen(
                                        false
                                    )
                                }
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="contained"
                                onClick={
                                    handleUpdate
                                }
                                disabled={
                                    !editForm.firstName.trim() ||
                                    !editForm.lastName.trim()
                                }
                            >
                                Actualizar
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={deleteOpen}
                        onClose={() => {
                            setDeleteOpen(
                                false
                            );

                            setStudentToDelete(
                                null
                            );
                        }}
                        fullWidth
                        maxWidth="xs"
                    >
                        <DialogTitle>
                            Eliminar estudiante
                        </DialogTitle>

                        <DialogContent>
                            <Typography>
                                ¿Deseas eliminar al estudiante{" "}
                                <strong>
                                    {
                                        studentToDelete?.firstName
                                    }{" "}
                                    {
                                        studentToDelete?.lastName
                                    }
                                </strong>
                                ?
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                El registro solo podrá
                                eliminarse si no tiene
                                información relacionada.
                            </Typography>
                        </DialogContent>

                        <DialogActions>
                            <Button
                                onClick={() => {
                                    setDeleteOpen(
                                        false
                                    );

                                    setStudentToDelete(
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
                </>
            )}

            <Dialog
                open={historyOpen}
                onClose={handleCloseHistory}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Historial de asistencia
                </DialogTitle>

                <DialogContent>
                    {historyStudent && (
                        <Box
                            sx={{
                                mb: 3,

                                borderLeft:
                                    "4px solid #2F80ED",

                                pl: 2,
                            }}
                        >
                            <Typography
                                fontWeight={700}
                            >
                                {
                                    historyStudent.firstName
                                }{" "}
                                {
                                    historyStudent.lastName
                                }
                            </Typography>
                        </Box>
                    )}

                    <Box
                        sx={{
                            display: "flex",

                            alignItems:
                                "flex-end",

                            gap: 2,

                            flexWrap: "wrap",

                            mb: 3,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                color="text.secondary"
                                sx={{
                                    mb: 0.7,
                                }}
                            >
                                Fecha inicial
                            </Typography>

                            <TextField
                                type="date"
                                value={
                                    historyDates.startDate
                                }
                                onChange={(
                                    event
                                ) =>
                                    setHistoryDates(
                                        (
                                            previous
                                        ) => ({
                                            ...previous,

                                            startDate:
                                            event
                                                .target
                                                .value,
                                        })
                                    )
                                }
                                size="small"
                            />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                color="text.secondary"
                                sx={{
                                    mb: 0.7,
                                }}
                            >
                                Fecha final
                            </Typography>

                            <TextField
                                type="date"
                                value={
                                    historyDates.endDate
                                }
                                onChange={(
                                    event
                                ) =>
                                    setHistoryDates(
                                        (
                                            previous
                                        ) => ({
                                            ...previous,

                                            endDate:
                                            event
                                                .target
                                                .value,
                                        })
                                    )
                                }
                                size="small"
                            />
                        </Box>

                        <Button
                            variant="contained"
                            startIcon={
                                <FilterAltIcon />
                            }
                            onClick={
                                handleFilterHistory
                            }
                            disabled={
                                !historyDates.startDate ||
                                !historyDates.endDate
                            }
                        >
                            Filtrar
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={
                                handleResetHistory
                            }
                        >
                            Mostrar todo
                        </Button>
                    </Box>

                    {historyLoading ? (
                        <Box
                            sx={{
                                display: "flex",

                                justifyContent:
                                    "center",

                                py: 4,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : studentAttendances.length ===
                    0 ? (
                        <Alert severity="info">
                            No existen registros de
                            asistencia.
                        </Alert>
                    ) : (
                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                overflowX:
                                    "auto",
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
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
                                            Estado
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {studentAttendances.map(
                                        (
                                            attendance
                                        ) => {
                                            const statusStyle =
                                                getAttendanceStatusStyle(
                                                    attendance.status
                                                );

                                            return (
                                                <TableRow
                                                    key={
                                                        attendance.attendanceId
                                                    }
                                                >
                                                    <TableCell>
                                                        {
                                                            attendance.attendanceDate
                                                        }
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
                                                        <Chip
                                                            label={
                                                                attendance.status
                                                            }
                                                            size="small"
                                                            sx={{
                                                                bgcolor:
                                                                statusStyle.background,

                                                                color:
                                                                statusStyle.color,
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={
                            handleCloseHistory
                        }
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

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
                        <Typography
                            fontWeight={700}
                            sx={{ mb: 2 }}
                        >
                            {
                                guardianStudent.firstName
                            }{" "}
                            {
                                guardianStudent.lastName
                            }
                        </Typography>
                    )}

                    {guardianLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "center",
                                py: 3,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {studentGuardians.length ===
                            0 ? (
                                <Alert
                                    severity="info"
                                    sx={{ mb: 2 }}
                                >
                                    El estudiante no
                                    tiene apoderados
                                    asignados.
                                </Alert>
                            ) : (
                                studentGuardians.map(
                                    (
                                        guardian
                                    ) => (
                                        <Paper
                                            key={
                                                guardian.guardianId
                                            }
                                            elevation={
                                                0
                                            }
                                            sx={{
                                                border:
                                                    "1px solid #E4EBF3",

                                                borderRadius:
                                                    2,

                                                p: 2,

                                                mb: 1.5,
                                            }}
                                        >
                                            <Typography
                                                fontWeight={
                                                    600
                                                }
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
                                                    "Sin parentesco"}
                                            </Typography>

                                            {administrator && (
                                                <Button
                                                    color="error"
                                                    size="small"
                                                    sx={{
                                                        mt: 1,
                                                    }}
                                                    onClick={() =>
                                                        handleRemoveGuardian(
                                                            guardian.guardianId
                                                        )
                                                    }
                                                >
                                                    Desvincular
                                                </Button>
                                            )}
                                        </Paper>
                                    )
                                )
                            )}

                            {administrator && (
                                <>
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
                                            onChange={(
                                                event
                                            ) =>
                                                setGuardianForm(
                                                    (
                                                        previous
                                                    ) => ({
                                                        ...previous,

                                                        guardianId:
                                                        event
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                        >
                                            {allGuardians.map(
                                                (
                                                    guardian
                                                ) => (
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
                                        onChange={(
                                            event
                                        ) =>
                                            setGuardianForm(
                                                (
                                                    previous
                                                ) => ({
                                                    ...previous,

                                                    relationship:
                                                    event
                                                        .target
                                                        .value,
                                                })
                                            )
                                        }
                                        fullWidth
                                        margin="normal"
                                    />
                                </>
                            )}
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={
                            handleCloseGuardians
                        }
                    >
                        Cerrar
                    </Button>

                    {administrator && (
                        <Button
                            variant="contained"
                            onClick={
                                handleAssignGuardian
                            }
                            disabled={
                                !guardianForm.guardianId
                            }
                        >
                            Asignar
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog
                open={aiOpen}
                onClose={handleCloseAi}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: "hidden",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        pb: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background:
                                    "linear-gradient(135deg, #E8F2FF 0%, #E8F7EF 100%)",
                            }}
                        >
                            <AutoAwesomeIcon
                                sx={{
                                    color: "#2F80ED",
                                    fontSize: 23,
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                fontWeight={700}
                                fontSize={20}
                                color="#0F2742"
                            >
                                Resumen inteligente de asistencia
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Análisis automático del historial del estudiante
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    {aiStudent && (
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 1,
                                mb: 2,
                                p: 2,
                                border: "1px solid #E4EBF3",
                                borderRadius: 2,
                                bgcolor: "#F8FAFD",
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Estudiante
                            </Typography>

                            <Typography
                                fontWeight={700}
                                color="#0F2742"
                            >
                                {aiStudent.firstName}{" "}
                                {aiStudent.lastName}
                            </Typography>
                        </Paper>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            px: 2,
                            py: 1.25,
                            mb: 2.5,
                            borderRadius: 2,
                            bgcolor: "rgba(16,163,127,0.08)",
                            border: "1px solid rgba(16,163,127,0.18)",
                        }}
                    >
                        <AutoAwesomeIcon
                            sx={{
                                color: "#10A37F",
                                fontSize: 21,
                            }}
                        />

                        <Box>
                            <Typography
                                variant="body2"
                                fontWeight={700}
                                color="#153E36"
                            >
                                Generado con OpenAI
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                GPT-6 Luna
                            </Typography>
                        </Box>
                    </Box>

                    {aiLoading ? (
                        <Box
                            sx={{
                                py: 5,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 2,
                            }}
                        >
                            <CircularProgress />

                            <Typography
                                color="text.secondary"
                                variant="body2"
                            >
                                Analizando registros de asistencia...
                            </Typography>
                        </Box>
                    ) : (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                border: "1px solid #E4EBF3",
                                borderRadius: 2,
                                bgcolor: "#FFFFFF",
                            }}
                        >
                            <Typography
                                sx={{
                                    lineHeight: 1.8,
                                    whiteSpace: "pre-line",
                                    color: "#24364B",
                                }}
                            >
                                {aiSummary.replaceAll(
                                    "**",
                                    ""
                                )}
                            </Typography>
                        </Paper>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2.5,
                    }}
                >
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
