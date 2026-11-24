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

function DevicesPage() {
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        deviceCode: "",
        name: "",
        location: "",
    });

    const loadDevices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/Devices");

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

    const handleCreate = async () => {
        try {
            setError("");

            await api.post("/Devices", {
                deviceCode: form.deviceCode,
                name: form.name,
                location: form.location || null,
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
                        Dispositivos
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de dispositivos registrados
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Nuevo dispositivo
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
                            <TableCell>Código</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Ubicación</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            devices.map((device) => (
                                <TableRow key={device.deviceId}>
                                    <TableCell>
                                        {device.deviceCode}
                                    </TableCell>

                                    <TableCell>
                                        {device.name}
                                    </TableCell>

                                    <TableCell>
                                        {device.location || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {device.active
                                            ? "Activo"
                                            : "Inactivo"}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading && devices.length === 0 && (
                <Typography
                    textAlign="center"
                    color="text.secondary"
                    sx={{ mt: 3 }}
                >
                    No hay dispositivos registrados
                </Typography>
            )}

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Nuevo dispositivo
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Código"
                        name="deviceCode"
                        value={form.deviceCode}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Nombre"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Ubicación"
                        name="location"
                        value={form.location}
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
                            !form.deviceCode.trim() ||
                            !form.name.trim()
                        }
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default DevicesPage;