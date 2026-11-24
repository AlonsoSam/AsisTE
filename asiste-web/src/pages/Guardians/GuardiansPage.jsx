import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
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
import DeleteIcon from "@mui/icons-material/Delete";

import api from "../../services/api";

function GuardiansPage() {
    const [guardians, setGuardians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [guardianToDelete, setGuardianToDelete] =
        useState(null);

    const [selectedGuardian, setSelectedGuardian] =
        useState(null);

    const [form, setForm] = useState({
        dni: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
    });

    const [editForm, setEditForm] = useState({
        dni: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
    });

    const loadGuardians = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/Guardians");

            setGuardians(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar los apoderados"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGuardians();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCreate = async () => {
        try {
            setError("");

            await api.post("/Guardians", {
                dni: form.dni || null,
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone || null,
                email: form.email || null,
            });

            setForm({
                dni: "",
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
            });

            setOpen(false);

            await loadGuardians();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo registrar el apoderado"
            );
        }
    };

    const handleOpenEdit = (guardian) => {
        setSelectedGuardian(guardian);

        setEditForm({
            dni: guardian.dni || "",
            firstName: guardian.firstName || "",
            lastName: guardian.lastName || "",
            phone: guardian.phone || "",
            email: guardian.email || "",
        });

        setEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedGuardian) {
            return;
        }

        try {
            setError("");

            await api.put(
                `/Guardians/${selectedGuardian.guardianId}`,
                {
                    dni: editForm.dni || null,
                    firstName: editForm.firstName,
                    lastName: editForm.lastName,
                    phone: editForm.phone || null,
                    email: editForm.email || null,
                }
            );

            setEditOpen(false);
            setSelectedGuardian(null);

            await loadGuardians();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo actualizar el apoderado"
            );
        }
    };

    const handleOpenDelete = (guardian) => {
        setGuardianToDelete(guardian);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!guardianToDelete) {
            return;
        }

        try {
            setError("");

            await api.delete(
                `/Guardians/${guardianToDelete.guardianId}`
            );

            setDeleteOpen(false);
            setGuardianToDelete(null);

            await loadGuardians();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo eliminar el apoderado"
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
                        Apoderados
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de apoderados registrados
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Nuevo apoderado
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
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
                            <TableCell>DNI</TableCell>
                            <TableCell>Nombres</TableCell>
                            <TableCell>Apellidos</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell align="right">
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            guardians.map((guardian) => (
                                <TableRow
                                    key={guardian.guardianId}
                                    hover
                                >
                                    <TableCell>
                                        {guardian.dni || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {guardian.firstName}
                                    </TableCell>

                                    <TableCell>
                                        {guardian.lastName}
                                    </TableCell>

                                    <TableCell>
                                        {guardian.phone || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {guardian.email || "-"}
                                    </TableCell>

                                    <TableCell align="right">
                                        <Tooltip title="Editar">
                                            <IconButton
                                                onClick={() =>
                                                    handleOpenEdit(
                                                        guardian
                                                    )
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    handleOpenDelete(
                                                        guardian
                                                    )
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* CREAR */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Registrar apoderado
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
                        label="Teléfono"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Correo"
                        name="email"
                        value={form.email}
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
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* EDITAR */}
            <Dialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Editar apoderado
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="DNI"
                        name="dni"
                        value={editForm.dni}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Nombres"
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Apellidos"
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Teléfono"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Correo"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />
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
                        onClick={handleUpdate}
                    >
                        Actualizar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ELIMINAR */}
            <Dialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Eliminar apoderado
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        ¿Deseas eliminar al apoderado{" "}
                        <strong>
                            {guardianToDelete?.firstName}{" "}
                            {guardianToDelete?.lastName}
                        </strong>
                        ?
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
                            setGuardianToDelete(null);
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

export default GuardiansPage;