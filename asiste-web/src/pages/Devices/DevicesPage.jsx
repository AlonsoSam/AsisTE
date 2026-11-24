import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
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

import api from "../../services/api";
import { isAdministrator } from "../../services/auth";

function DevicesPage() {
    const administrator = isAdministrator();

    const [devices, setDevices] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedDevice, setSelectedDevice] =
        useState(null);

    const [deviceToDelete, setDeviceToDelete] =
        useState(null);

    const [form, setForm] = useState({
        deviceCode: "",
        name: "",
        location: "",
    });

    const [editForm, setEditForm] = useState({
        deviceCode: "",
        name: "",
        location: "",
        active: true,
    });

    const loadDevices = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/Devices");

            setDevices(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar los dispositivos"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDevices();
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

            await api.post("/Devices", {
                deviceCode:
                form.deviceCode,
                name: form.name,
                location:
                    form.location || null,
            });

            setForm({
                deviceCode: "",
                name: "",
                location: "",
            });

            setOpen(false);

            await loadDevices();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo registrar el dispositivo"
            );
        }
    };

    const handleOpenEdit = (device) => {
        setSelectedDevice(device);

        setEditForm({
            deviceCode:
                device.deviceCode || "",
            name: device.name || "",
            location:
                device.location || "",
            active: device.active,
        });

        setEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedDevice) {
            return;
        }

        try {
            setError("");

            await api.put(
                `/Devices/${selectedDevice.deviceId}`,
                {
                    deviceCode:
                    editForm.deviceCode,
                    name: editForm.name,
                    location:
                        editForm.location ||
                        null,
                    active: editForm.active,
                }
            );

            setEditOpen(false);
            setSelectedDevice(null);

            await loadDevices();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo actualizar el dispositivo"
            );
        }
    };

    const handleOpenDelete = (device) => {
        setDeviceToDelete(device);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deviceToDelete) {
            return;
        }

        try {
            setError("");

            await api.delete(
                `/Devices/${deviceToDelete.deviceId}`
            );

            setDeleteOpen(false);
            setDeviceToDelete(null);

            await loadDevices();
        } catch (err) {
            setDeleteOpen(false);
            setDeviceToDelete(null);

            setError(
                err.response?.data?.message ||
                "No se pudo eliminar el dispositivo"
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
                        Dispositivos
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de dispositivos registrados
                    </Typography>
                </Box>

                {administrator && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            setOpen(true)
                        }
                    >
                        Nuevo dispositivo
                    </Button>
                )}
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
                                Código
                            </TableCell>
                            <TableCell>
                                Nombre
                            </TableCell>
                            <TableCell>
                                Ubicación
                            </TableCell>
                            <TableCell>
                                Estado
                            </TableCell>

                            {administrator && (
                                <TableCell align="right">
                                    Acciones
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            devices.map(
                                (device) => (
                                    <TableRow
                                        key={
                                            device.deviceId
                                        }
                                        hover
                                    >
                                        <TableCell>
                                            {
                                                device.deviceCode
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                device.name
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {device.location ||
                                                "-"}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    device.active
                                                        ? "Activo"
                                                        : "Inactivo"
                                                }
                                                size="small"
                                                sx={{
                                                    bgcolor:
                                                        device.active
                                                            ? "#E8F7EF"
                                                            : "#F2F2F2",
                                                    color:
                                                        device.active
                                                            ? "#2FA36B"
                                                            : "#667788",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>

                                        {administrator && (
                                            <TableCell align="right">
                                                <Tooltip title="Editar">
                                                    <IconButton
                                                        onClick={() =>
                                                            handleOpenEdit(
                                                                device
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
                                                                device
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )
                            )}
                    </TableBody>
                </Table>
            </TableContainer>

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
                            Registrar dispositivo
                        </DialogTitle>

                        <DialogContent>
                            <TextField
                                label="Código"
                                name="deviceCode"
                                value={
                                    form.deviceCode
                                }
                                onChange={
                                    handleChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Nombre"
                                name="name"
                                value={
                                    form.name
                                }
                                onChange={
                                    handleChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Ubicación"
                                name="location"
                                value={
                                    form.location
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
                            Editar dispositivo
                        </DialogTitle>

                        <DialogContent>
                            <TextField
                                label="Código"
                                name="deviceCode"
                                value={
                                    editForm.deviceCode
                                }
                                onChange={
                                    handleEditChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Nombre"
                                name="name"
                                value={
                                    editForm.name
                                }
                                onChange={
                                    handleEditChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Ubicación"
                                name="location"
                                value={
                                    editForm.location
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
                            setDeviceToDelete(
                                null
                            );
                        }}
                        fullWidth
                        maxWidth="xs"
                    >
                        <DialogTitle>
                            Eliminar dispositivo
                        </DialogTitle>

                        <DialogContent>
                            <Typography>
                                ¿Deseas eliminar el
                                dispositivo{" "}
                                <strong>
                                    {
                                        deviceToDelete?.name
                                    }
                                </strong>
                                ?
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                El registro solo
                                podrá eliminarse si
                                no tiene asistencias
                                relacionadas.
                            </Typography>
                        </DialogContent>

                        <DialogActions>
                            <Button
                                onClick={() => {
                                    setDeleteOpen(
                                        false
                                    );
                                    setDeviceToDelete(
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
        </Box>
    );
}

export default DevicesPage;