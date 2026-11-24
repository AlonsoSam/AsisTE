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
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import api from "../../services/api";

function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [openRole, setOpenRole] = useState(false);
    const [openAssign, setOpenAssign] = useState(false);

    const [roleName, setRoleName] = useState("");

    const [assignForm, setAssignForm] = useState({
        userId: "",
        roleId: "",
    });

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [rolesResponse, usersResponse] =
                await Promise.all([
                    api.get("/Roles"),
                    api.get("/Users"),
                ]);

            setRoles(rolesResponse.data);
            setUsers(usersResponse.data);
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
        loadData();
    }, []);

    const handleCreateRole = async () => {
        try {
            setError("");

            await api.post("/Roles", {
                roleName,
            });

            setRoleName("");
            setOpenRole(false);

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo registrar el rol"
            );
        }
    };

    const handleAssignChange = (event) => {
        const { name, value } = event.target;

        setAssignForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleAssignRole = async () => {
        try {
            setError("");

            await api.post("/Roles/assign", {
                userId: assignForm.userId,
                roleId: assignForm.roleId,
            });

            setAssignForm({
                userId: "",
                roleId: "",
            });

            setOpenAssign(false);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo asignar el rol"
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
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Roles
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de roles y permisos
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<PersonAddAltIcon />}
                        onClick={() => setOpenAssign(true)}
                    >
                        Asignar rol
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenRole(true)}
                    >
                        Nuevo rol
                    </Button>
                </Box>
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
                            <TableCell>Nombre del rol</TableCell>
                            <TableCell>ID</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            roles.map((role) => (
                                <TableRow key={role.roleId}>
                                    <TableCell>
                                        {role.roleName}
                                    </TableCell>

                                    <TableCell>
                                        {role.roleId}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading && roles.length === 0 && (
                <Typography
                    textAlign="center"
                    color="text.secondary"
                    sx={{ mt: 3 }}
                >
                    No hay roles registrados
                </Typography>
            )}

            <Dialog
                open={openRole}
                onClose={() => setOpenRole(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Nuevo rol
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Nombre del rol"
                        value={roleName}
                        onChange={(event) =>
                            setRoleName(event.target.value)
                        }
                        fullWidth
                        margin="normal"
                        required
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpenRole(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCreateRole}
                        disabled={!roleName.trim()}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openAssign}
                onClose={() => setOpenAssign(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Asignar rol a usuario
                </DialogTitle>

                <DialogContent>
                    <FormControl
                        fullWidth
                        margin="normal"
                    >
                        <InputLabel>
                            Usuario
                        </InputLabel>

                        <Select
                            name="userId"
                            value={assignForm.userId}
                            label="Usuario"
                            onChange={handleAssignChange}
                        >
                            {users.map((user) => (
                                <MenuItem
                                    key={user.userId}
                                    value={user.userId}
                                >
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl
                        fullWidth
                        margin="normal"
                    >
                        <InputLabel>
                            Rol
                        </InputLabel>

                        <Select
                            name="roleId"
                            value={assignForm.roleId}
                            label="Rol"
                            onChange={handleAssignChange}
                        >
                            {roles.map((role) => (
                                <MenuItem
                                    key={role.roleId}
                                    value={role.roleId}
                                >
                                    {role.roleName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpenAssign(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleAssignRole}
                        disabled={
                            !assignForm.userId ||
                            !assignForm.roleId
                        }
                    >
                        Asignar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default RolesPage;