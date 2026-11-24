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

function GuardiansPage() {
    const [guardians, setGuardians] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
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

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>DNI</TableCell>
                            <TableCell>Nombres</TableCell>
                            <TableCell>Apellidos</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Correo</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading &&
                            guardians.map((guardian) => (
                                <TableRow key={guardian.guardianId}>
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
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading && guardians.length === 0 && (
                <Typography
                    textAlign="center"
                    color="text.secondary"
                    sx={{ mt: 3 }}
                >
                    No hay apoderados registrados
                </Typography>
            )}

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Nuevo apoderado
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
                        type="email"
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
                        disabled={
                            !form.firstName.trim() ||
                            !form.lastName.trim()
                        }
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default GuardiansPage;