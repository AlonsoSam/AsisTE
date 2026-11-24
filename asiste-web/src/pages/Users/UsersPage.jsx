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
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";
import SecurityIcon from "@mui/icons-material/Security";

import api from "../../services/api";

function UsersPage() {
    const [users, setUsers] =
        useState([]);

    const [roles, setRoles] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [open, setOpen] =
        useState(false);

    const [editOpen, setEditOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [
        passwordOpen,
        setPasswordOpen,
    ] = useState(false);

    const [roleOpen, setRoleOpen] =
        useState(false);

    const [
        selectedUser,
        setSelectedUser,
    ] = useState(null);

    const [
        userToDelete,
        setUserToDelete,
    ] = useState(null);

    const [
        passwordUser,
        setPasswordUser,
    ] = useState(null);

    const [roleUser, setRoleUser] =
        useState(null);

    const [
        selectedRoleId,
        setSelectedRoleId,
    ] = useState("");

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
    });

    const [editForm, setEditForm] =
        useState({
            username: "",
            email: "",
        });

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/Users");

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

    const loadRoles = async () => {
        try {
            const response =
                await api.get("/Roles");

            setRoles(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar los roles"
            );
        }
    };

    useEffect(() => {
        loadUsers();
        loadRoles();
    }, []);

    const handleCreate = async () => {
        try {
            setError("");
            setSuccess("");

            await api.post("/Users", {
                username:
                form.username,

                password:
                form.password,

                email:
                    form.email || null,
            });

            setForm({
                username: "",
                password: "",
                email: "",
            });

            setOpen(false);

            setSuccess(
                "Usuario registrado correctamente"
            );

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
            username:
                user.username || "",

            email:
                user.email || "",
        });

        setEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedUser) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.put(
                `/Users/${selectedUser.userId}`,
                {
                    username:
                    editForm.username,

                    email:
                        editForm.email ||
                        null,
                }
            );

            setEditOpen(false);
            setSelectedUser(null);

            setSuccess(
                "Usuario actualizado correctamente"
            );

            await loadUsers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo actualizar el usuario"
            );
        }
    };

    const handleOpenPassword = (
        user
    ) => {
        setPasswordUser(user);

        setNewPassword("");

        setPasswordOpen(true);
    };

    const handleChangePassword =
        async () => {
            if (
                !passwordUser ||
                !newPassword.trim()
            ) {
                return;
            }

            try {
                setError("");
                setSuccess("");

                await api.put(
                    `/Users/${passwordUser.userId}/password`,
                    {
                        password:
                        newPassword,
                    }
                );

                setPasswordOpen(false);

                setPasswordUser(null);

                setNewPassword("");

                setSuccess(
                    "Contraseña actualizada correctamente"
                );
            } catch (err) {
                setError(
                    err.response?.data
                        ?.message ||
                    "No se pudo cambiar la contraseña"
                );
            }
        };

    const handleOpenRole = (user) => {
        setRoleUser(user);

        setSelectedRoleId("");

        setRoleOpen(true);
    };

    const handleAssignRole =
        async () => {
            if (
                !roleUser ||
                !selectedRoleId
            ) {
                return;
            }

            try {
                setError("");
                setSuccess("");

                await api.post(
                    "/Roles/assign",
                    {
                        userId:
                        roleUser.userId,

                        roleId:
                        selectedRoleId,
                    }
                );

                setRoleOpen(false);
                setRoleUser(null);
                setSelectedRoleId("");

                setSuccess(
                    "Rol asignado correctamente"
                );
            } catch (err) {
                setError(
                    err.response?.data
                        ?.message ||
                    "No se pudo asignar el rol"
                );
            }
        };

    const handleOpenDelete = (
        user
    ) => {
        setUserToDelete(user);

        setDeleteOpen(true);
    };

    const handleConfirmDelete =
        async () => {
            if (!userToDelete) {
                return;
            }

            try {
                setError("");
                setSuccess("");

                await api.delete(
                    `/Users/${userToDelete.userId}`
                );

                setDeleteOpen(false);
                setUserToDelete(null);

                setSuccess(
                    "Usuario eliminado correctamente"
                );

                await loadUsers();
            } catch (err) {
                setDeleteOpen(false);

                setUserToDelete(null);

                setError(
                    err.response?.data
                        ?.message ||
                    "No se pudo eliminar el usuario"
                );
            }
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
                        Usuarios
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de usuarios y
                        accesos del sistema
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() =>
                        setOpen(true)
                    }
                >
                    Nuevo usuario
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

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
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
                    overflow: "hidden",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Usuario
                            </TableCell>

                            <TableCell>
                                Correo
                            </TableCell>

                            <TableCell>
                                Creado
                            </TableCell>

                            <TableCell align="right">
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            users.map(
                                (user) => (
                                    <TableRow
                                        key={
                                            user.userId
                                        }
                                        hover
                                    >
                                        <TableCell>
                                            {
                                                user.username
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {user.email ||
                                                "-"}
                                        </TableCell>

                                        <TableCell>
                                            {user.createdAt
                                                ? new Date(
                                                    user.createdAt
                                                ).toLocaleDateString(
                                                    "es-PE"
                                                )
                                                : "-"}
                                        </TableCell>

                                        <TableCell align="right">
                                            <Tooltip title="Editar usuario">
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

                                            <Tooltip title="Cambiar contraseña">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleOpenPassword(
                                                            user
                                                        )
                                                    }
                                                >
                                                    <LockResetIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Asignar rol">
                                                <IconButton
                                                    sx={{
                                                        color: "#6F5BD3",
                                                    }}
                                                    onClick={() =>
                                                        handleOpenRole(
                                                            user
                                                        )
                                                    }
                                                >
                                                    <SecurityIcon />
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
                                )
                            )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading &&
                users.length === 0 && (
                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        sx={{ mt: 3 }}
                    >
                        No hay usuarios
                        registrados
                    </Typography>
                )}

            {/* nuevo usuario */}

            <Dialog
                open={open}
                onClose={() =>
                    setOpen(false)
                }
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Registrar usuario
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Usuario"
                        value={
                            form.username
                        }
                        onChange={(event) =>
                            setForm(
                                (previous) => ({
                                    ...previous,
                                    username:
                                    event.target
                                        .value,
                                })
                            )
                        }
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Correo"
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                            setForm(
                                (previous) => ({
                                    ...previous,
                                    email:
                                    event.target
                                        .value,
                                })
                            )
                        }
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Contraseña"
                        type="password"
                        value={
                            form.password
                        }
                        onChange={(event) =>
                            setForm(
                                (previous) => ({
                                    ...previous,
                                    password:
                                    event.target
                                        .value,
                                })
                            )
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
                            !form.username.trim() ||
                            !form.password.trim()
                        }
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* editar */}

            <Dialog
                open={editOpen}
                onClose={() =>
                    setEditOpen(false)
                }
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Editar usuario
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Usuario"
                        value={
                            editForm.username
                        }
                        onChange={(event) =>
                            setEditForm(
                                (previous) => ({
                                    ...previous,
                                    username:
                                    event.target
                                        .value,
                                })
                            )
                        }
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Correo"
                        type="email"
                        value={
                            editForm.email
                        }
                        onChange={(event) =>
                            setEditForm(
                                (previous) => ({
                                    ...previous,
                                    email:
                                    event.target
                                        .value,
                                })
                            )
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
                        onClick={
                            handleUpdate
                        }
                        disabled={
                            !editForm.username.trim()
                        }
                    >
                        Actualizar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* cambiar contraseña */}

            <Dialog
                open={passwordOpen}
                onClose={() =>
                    setPasswordOpen(false)
                }
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Cambiar contraseña
                </DialogTitle>

                <DialogContent>
                    <Typography
                        sx={{ mb: 2 }}
                    >
                        Usuario:{" "}
                        <strong>
                            {
                                passwordUser?.username
                            }
                        </strong>
                    </Typography>

                    <TextField
                        label="Nueva contraseña"
                        type="password"
                        value={newPassword}
                        onChange={(event) =>
                            setNewPassword(
                                event.target
                                    .value
                            )
                        }
                        fullWidth
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setPasswordOpen(
                                false
                            );

                            setPasswordUser(
                                null
                            );

                            setNewPassword("");
                        }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            handleChangePassword
                        }
                        disabled={
                            !newPassword.trim()
                        }
                    >
                        Cambiar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* asignar rol */}

            <Dialog
                open={roleOpen}
                onClose={() =>
                    setRoleOpen(false)
                }
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Asignar rol
                </DialogTitle>

                <DialogContent>
                    <Typography
                        sx={{ mb: 2 }}
                    >
                        Usuario:{" "}
                        <strong>
                            {
                                roleUser?.username
                            }
                        </strong>
                    </Typography>

                    <FormControl
                        fullWidth
                    >
                        <InputLabel>
                            Rol
                        </InputLabel>

                        <Select
                            value={
                                selectedRoleId
                            }
                            label="Rol"
                            onChange={(
                                event
                            ) =>
                                setSelectedRoleId(
                                    event.target
                                        .value
                                )
                            }
                        >
                            {roles.map(
                                (role) => (
                                    <MenuItem
                                        key={
                                            role.roleId
                                        }
                                        value={
                                            role.roleId
                                        }
                                    >
                                        {
                                            role.roleName
                                        }
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setRoleOpen(false);
                            setRoleUser(null);
                            setSelectedRoleId(
                                ""
                            );
                        }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            handleAssignRole
                        }
                        disabled={
                            !selectedRoleId
                        }
                    >
                        Asignar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* eliminar */}

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
                        ¿Deseas eliminar al
                        usuario{" "}
                        <strong>
                            {
                                userToDelete?.username
                            }
                        </strong>
                        ?
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        El usuario solo podrá
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

                            setUserToDelete(
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

export default UsersPage;