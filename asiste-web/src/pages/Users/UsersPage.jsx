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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";

import api from "../../services/api";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const [createForm, setCreateForm] = useState({
        username: "",
        password: "",
        email: "",
    });

    const [editForm, setEditForm] = useState({
        username: "",
        email: "",
    });

    const [newPassword, setNewPassword] = useState("");

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/Users");

            setUsers(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar los usuarios"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreateChange = (event) => {
        const { name, value } = event.target;

        setCreateForm((previous) => ({
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

            await api.post("/Users", {
                username: createForm.username,
                password: createForm.password,
                email: createForm.email || null,
            });

            setCreateForm({
                username: "",
                password: "",
                email: "",
            });

            setOpenCreate(false);

            await loadUsers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo registrar el usuario"
            );
        }
    };

    const handleOpenEdit = (user) => {
        setSelectedUser(user);

        setEditForm({
            username: user.username,
            email: user.email || "",
        });

        setOpenEdit(true);
    };

    const handleUpdate = async () => {
        if (!selectedUser) {
            return;
        }

        try {
            setError("");

            await api.put(
                `/Users/${selectedUser.userId}`,
                {
                    username: editForm.username,
                    email: editForm.email || null,
                }
            );

            setOpenEdit(false);
            setSelectedUser(null);

            await loadUsers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo actualizar el usuario"
            );
        }
    };

    const handleDelete = async (userId) => {
        const confirmed = window.confirm(
            "¿Deseas eliminar este usuario?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await api.delete(`/Users/${userId}`);

            await loadUsers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo eliminar el usuario"
            );
        }
    };

    const handleOpenPassword = (user) => {
        setSelectedUser(user);
        setNewPassword("");
        setOpenPassword(true);
    };

    const handleChangePassword = async () => {
        if (!selectedUser) {
            return;
        }

        try {
            setError("");

            await api.put(
                `/Users/${selectedUser.userId}/password`,
                {
                    password: newPassword,
                }
            );

            setOpenPassword(false);
            setSelectedUser(null);
            setNewPassword("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo cambiar la contraseña"
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
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Usuarios
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de usuarios del sistema
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreate(true)}
                >
                    Nuevo usuario
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
                            <TableCell>Usuario</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell>Creado</TableCell>
                            <TableCell align="right">
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            users.map((user) => (
                                <TableRow key={user.userId}>
                                    <TableCell>
                                        {user.username}
                                    </TableCell>

                                    <TableCell>
                                        {user.email || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {user.createdAt
                                            ? new Date(
                                                user.createdAt
                                            ).toLocaleString()
                                            : "-"}
                                    </TableCell>

                                    <TableCell align="right">
                                        <Tooltip title="Editar">
                                            <IconButton
                                                onClick={() =>
                                                    handleOpenEdit(user)
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Cambiar contraseña">
                                            <IconButton
                                                onClick={() =>
                                                    handleOpenPassword(user)
                                                }
                                            >
                                                <LockResetIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                onClick={() =>
                                                    handleDelete(user.userId)
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

            {!loading && users.length === 0 && (
                <Typography
                    textAlign="center"
                    color="text.secondary"
                    sx={{ mt: 3 }}
                >
                    No hay usuarios registrados
                </Typography>
            )}

            <Dialog
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Nuevo usuario
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Usuario"
                        name="username"
                        value={createForm.username}
                        onChange={handleCreateChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={createForm.password}
                        onChange={handleCreateChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Correo"
                        name="email"
                        type="email"
                        value={createForm.email}
                        onChange={handleCreateChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpenCreate(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        disabled={
                            !createForm.username.trim() ||
                            !createForm.password.trim()
                        }
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Editar usuario
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Usuario"
                        name="username"
                        value={editForm.username}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Correo"
                        name="email"
                        type="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleUpdate}
                        disabled={!editForm.username.trim()}
                    >
                        Actualizar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openPassword}
                onClose={() => setOpenPassword(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Cambiar contraseña
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Nueva contraseña"
                        type="password"
                        value={newPassword}
                        onChange={(event) =>
                            setNewPassword(event.target.value)
                        }
                        fullWidth
                        margin="normal"
                        required
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpenPassword(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={!newPassword.trim()}
                    >
                        Cambiar contraseña
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default UsersPage;