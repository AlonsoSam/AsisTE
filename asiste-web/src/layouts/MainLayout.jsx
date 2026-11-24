import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
    AppBar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import DevicesIcon from "@mui/icons-material/Devices";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

function MainLayout() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState("Dashboard");

    const username =
        localStorage.getItem("username") || "Usuario";

    const menuItems = [
        {
            text: "Dashboard",
            icon: <DashboardIcon />,
            path: "/dashboard",
        },
        {
            text: "Estudiantes",
            icon: <SchoolIcon />,
            path: "/students",
        },
        {
            text: "Apoderados",
            icon: <FamilyRestroomIcon />,
            path: "/guardians",
        },
        {
            text: "Asistencias",
            icon: <FactCheckIcon />,
            path: "/attendances",
        },
        {
            text: "Dispositivos",
            icon: <DevicesIcon />,
            path: "/devices",
        },
        {
            text: "Notificaciones",
            icon: <NotificationsIcon />,
            path: "/notifications",
        },
        {
            text: "Usuarios",
            icon: <PeopleIcon />,
            path: "/users",
        },
        {
            text: "Roles",
            icon: <SecurityIcon />,
            path: "/roles",
        },
    ];

    const handleNavigate = (item) => {
        setSelected(item.text);
        navigate(item.path);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");

        navigate("/");
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ flexGrow: 1 }}
                    >
                        AsisTE
                    </Typography>

                    <Typography>
                        {username}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
            >
                <Toolbar />

                <Box sx={{ overflow: "auto" }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItemButton
                                key={item.text}
                                selected={selected === item.text}
                                onClick={() => handleNavigate(item)}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.text}
                                />
                            </ListItemButton>
                        ))}
                    </List>

                    <Divider />

                    <List>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>

                            <ListItemText primary="Cerrar sesión" />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: "#f5f6f8",
                    minHeight: "100vh",
                    p: 3,
                }}
            >
                <Toolbar />

                <Outlet />
            </Box>
        </Box>
    );
}

export default MainLayout;