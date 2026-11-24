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

function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedRole, setSelectedRole] = useState(null);
    const [roleToDelete, setRoleToDelete] = useState(null);

    const [form, setForm] = useState({
        roleName: "",
    });

    const [editForm, setEditForm] = useState({
        roleName: "",
    });

    const loadRoles = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/Roles");
            setRoles(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar los roles"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    const handleCreate = async () => {
        try {
            setError("");

            await api.post("/Roles", {
                roleName: form.roleName,
            });

            setForm({
                roleName: "",
            });

            setOpen(false);

            await loadRoles();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo registrar el rol"
            );
        }
    };

    const handleOpenEdit = (role) => {
        setSelectedRole(role);

        setEditForm({
            roleName: role.roleName || "",
        });

        setEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedRole) {
            return;
        }

        try {
            setError("");

            await api.put(
                `/Roles/${selectedRole.roleId}`,
                {
                    name: editForm.roleName,
                }
            );

            setEditOpen(false);
            setSelectedRole(null);

            await loadRoles();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo actualizar el rol"
            );
        }
    };

    const handleOpenDelete = (role) => {
        setRoleToDelete(role);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!roleToDelete) {
            return;
        }

        try {
            setError("");

            await api.delete(
                `/Roles/${roleToDelete.roleId}`
            );

            setDeleteOpen(false);
            setRoleToDelete(null);

            await loadRoles();
        } catch (err) {
            setDeleteOpen(false);
            setRoleToDelete(null);

            setError(
                err.response?.data?.message ||
                "No se pudo eliminar el rol"
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
                        Roles
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de roles del sistema
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Nuevo rol
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
                                Nombre del rol
                            </TableCell>

                            <TableCell align="right">
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            roles.map((role) => (
                                <TableRow
                                    key={role.roleId}
                                    hover
                                >
                                    <TableCell>
                                        {role.roleName}
                                    </TableCell>

                                    <TableCell align="right">
                                        <Tooltip title="Editar">
                                            <IconButton
                                                onClick={() =>
                                                    handleOpenEdit(
                                                        role
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
                                                        role
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
                    Registrar rol
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Nombre del rol"
                        value={form.roleName}
                        onChange={(event) =>
                            setForm({
                                roleName:
                                event.target.value,
                            })
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
                        disabled={
                            !form.roleName.trim()
                        }
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
                    Editar rol
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Nombre del rol"
                        value={editForm.roleName}
                        onChange={(event) =>
                            setEditForm({
                                roleName:
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
                        disabled={
                            !editForm.roleName.trim()
                        }
                    >
                        Actualizar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setRoleToDelete(null);
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Eliminar rol
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        ¿Deseas eliminar el rol{" "}
                        <strong>
                            {roleToDelete?.roleName}
                        </strong>
                        ?
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        El rol solo podrá eliminarse si no
                        está asignado a ningún usuario.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setDeleteOpen(false);
                            setRoleToDelete(null);
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

export default RolesPage;