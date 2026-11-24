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

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [editForm, setEditForm] = useState({
        username: "",
    });

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

    const handleCreate = async () => {
        try {
            setError("");

            await api.post("/Users", {
                username: form.username,
                password: form.password,
            });

            setForm({
                username: "",
                password: "",
            });

            setOpen(false);

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
            username: user.username || "",
        });

        setEditOpen(true);
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
                }
            );

            setEditOpen(false);
            setSelectedUser(null);

            await loadUsers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo actualizar el usuario"
            );
        }
    };

    const handleOpenDelete = (user) => {
        setUserToDelete(user);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) {
            return;
        }

        try {
            setError("");

            await api.delete(
                `/Users/${userToDelete.userId}`
            );

            setDeleteOpen(false);
            setUserToDelete(null);

            await loadUsers();
        } catch (err) {
            setDeleteOpen(false);
            setUserToDelete(null);

            setError(
                err.response?.data?.message ||
                "No se pudo eliminar el usuario"
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
                        Usuarios
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de usuarios del sistema
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Nuevo usuario
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
                                Usuario
                            </TableCell>

                            <TableCell align="right">
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            users.map((user) => (
                                <TableRow
                                    key={user.userId}
                                    hover
                                >
                                    <TableCell>
                                        {user.username}
                                    </TableCell>

                                    <TableCell align="right">
                                        <Tooltip title="Editar">
                                            <IconButton
                                                onClick={() =>
                                                    handleOpenEdit(
                                                        user
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
                                                        user
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

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Registrar usuario
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Usuario"
                        value={form.username}
                        onChange={(event) =>
                            setForm(
                                (previous) => ({
                                    ...previous,
                                    username:
                                    event.target.value,
                                })
                            )
                        }
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Contraseña"
                        type="password"
                        value={form.password}
                        onChange={(event) =>
                            setForm(
                                (previous) => ({
                                    ...previous,
                                    password:
                                    event.target.value,
                                })
                            )
                        }
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
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Editar usuario
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Usuario"
                        value={editForm.username}
                        onChange={(event) =>
                            setEditForm({
                                username:
                                event.target.value,
                            })
                        }
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

            <Dialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setUserToDelete(null);
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Eliminar usuario
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        ¿Deseas eliminar al usuario{" "}
                        <strong>
                            {userToDelete?.username}
                        </strong>
                        ?
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        El usuario solo podrá eliminarse si no
                        tiene información relacionada.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setDeleteOpen(false);
                            setUserToDelete(null);
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

export default UsersPage;