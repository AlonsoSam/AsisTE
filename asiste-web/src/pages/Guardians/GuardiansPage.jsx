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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FamilyRestroomOutlinedIcon from "@mui/icons-material/FamilyRestroomOutlined";

import api from "../../services/api";
import { isAdministrator } from "../../services/auth";

function GuardiansPage() {
    const administrator = isAdministrator();

    const [guardians, setGuardians] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedGuardian, setSelectedGuardian] =
        useState(null);

    const [guardianToDelete, setGuardianToDelete] =
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

            const response =
                await api.get("/Guardians");

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
        const { name, value } =
            event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleEditChange = (event) => {
        const { name, value } =
            event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCreate = async () => {
        try {
            setError("");
            setSuccess("");

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

            setSuccess(
                "Apoderado registrado correctamente"
            );

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
            firstName:
                guardian.firstName || "",
            lastName:
                guardian.lastName || "",
            phone:
                guardian.phone || "",
            email:
                guardian.email || "",
        });

        setEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedGuardian) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.put(
                `/Guardians/${selectedGuardian.guardianId}`,
                {
                    dni:
                        editForm.dni || null,

                    firstName:
                    editForm.firstName,

                    lastName:
                    editForm.lastName,

                    phone:
                        editForm.phone || null,

                    email:
                        editForm.email || null,
                }
            );

            setEditOpen(false);
            setSelectedGuardian(null);

            setSuccess(
                "Apoderado actualizado correctamente"
            );

            await loadGuardians();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo actualizar el apoderado"
            );
        }
    };

    const handleOpenDelete = (
        guardian
    ) => {
        setGuardianToDelete(guardian);
        setDeleteOpen(true);
    };

    const handleConfirmDelete =
        async () => {
            if (!guardianToDelete) {
                return;
            }

            try {
                setError("");
                setSuccess("");

                await api.delete(
                    `/Guardians/${guardianToDelete.guardianId}`
                );

                setDeleteOpen(false);
                setGuardianToDelete(null);

                setSuccess(
                    "Apoderado eliminado correctamente"
                );

                await loadGuardians();
            } catch (err) {
                setDeleteOpen(false);
                setGuardianToDelete(null);

                setError(
                    err.response?.data
                        ?.message ||
                    "No se pudo eliminar el apoderado"
                );
            }
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
                        Apoderados
                    </Typography>

                    <Typography color="text.secondary">
                        Gestión de apoderados registrados
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
                        Nuevo apoderado
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
                        minWidth: 850,
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
                                Teléfono
                            </TableCell>

                            <TableCell>
                                Correo
                            </TableCell>

                            {administrator && (
                                <TableCell align="right">
                                    Acciones
                                </TableCell>
                            )}
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
                                                length:
                                                    administrator
                                                        ? 6
                                                        : 5,
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
                            : guardians.map(
                                (guardian) => (
                                    <TableRow
                                        key={
                                            guardian.guardianId
                                        }
                                        hover
                                    >
                                        <TableCell>
                                            {guardian.dni ||
                                                "-"}
                                        </TableCell>

                                        <TableCell>
                                            {
                                                guardian.firstName
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                guardian.lastName
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {guardian.phone ||
                                                "-"}
                                        </TableCell>

                                        <TableCell>
                                            {guardian.email ||
                                                "-"}
                                        </TableCell>

                                        {administrator && (
                                            <TableCell align="right">
                                                <Tooltip title="Editar">
                                                    <IconButton
                                                        aria-label={`Editar ${guardian.firstName} ${guardian.lastName}`}
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
                                                        aria-label={`Eliminar ${guardian.firstName} ${guardian.lastName}`}
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
                                        )}
                                    </TableRow>
                                )
                            )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading &&
                guardians.length === 0 && (
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
                        <FamilyRestroomOutlinedIcon
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
                            Aún no hay apoderados
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            Los apoderados registrados
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
                            Registrar apoderado
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
                                label="Teléfono"
                                name="phone"
                                value={
                                    form.phone
                                }
                                onChange={
                                    handleChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Correo"
                                name="email"
                                type="email"
                                value={
                                    form.email
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
                            Editar apoderado
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
                                label="Teléfono"
                                name="phone"
                                value={
                                    editForm.phone
                                }
                                onChange={
                                    handleEditChange
                                }
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Correo"
                                name="email"
                                type="email"
                                value={
                                    editForm.email
                                }
                                onChange={
                                    handleEditChange
                                }
                                fullWidth
                                margin="normal"
                            />
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

                            setGuardianToDelete(
                                null
                            );
                        }}
                        fullWidth
                        maxWidth="xs"
                    >
                        <DialogTitle>
                            Eliminar apoderado
                        </DialogTitle>

                        <DialogContent>
                            <Typography>
                                ¿Deseas eliminar al
                                apoderado{" "}
                                <strong>
                                    {
                                        guardianToDelete?.firstName
                                    }{" "}
                                    {
                                        guardianToDelete?.lastName
                                    }
                                </strong>
                                ?
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                }}
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

                                    setGuardianToDelete(
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

export default GuardiansPage;