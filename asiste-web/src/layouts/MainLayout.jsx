import { useEffect, useState } from "react";
import {
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    AppBar,
    Box,
    Divider,
    Drawer,
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

import { isAdministrator } from "../services/auth";

const drawerWidth = 240;

function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const administrator = isAdministrator();

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
        ...(administrator
            ? [
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
            ]
            : []),
    ];

    const getSelectedItem = () => {
        const item = menuItems.find(
            (menuItem) =>
                menuItem.path === location.pathname
        );

        return item?.text || "Dashboard";
    };

    const [selected, setSelected] = useState(
        getSelectedItem()
    );

    useEffect(() => {
        setSelected(getSelectedItem());
    }, [location.pathname]);

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
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) =>
                        theme.zIndex.drawer + 1,
                    bgcolor: "#16324F",
                    boxShadow: "none",
                    borderBottom:
                        "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <Toolbar>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            flexGrow: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1.5,
                                bgcolor: "#1F6FB2",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#FFFFFF",
                                fontWeight: 800,
                                fontSize: 18,
                            }}
                        >
                            A
                        </Box>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                letterSpacing: 0.3,
                            }}
                        >
                            AsisTE
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontWeight: 600,
                            fontSize: 15,
                            color: "#F4F7FA",
                        }}
                    >
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
                        borderRight:
                            "1px solid #E1E7ED",
                        bgcolor: "#FFFFFF",
                    },
                }}
            >
                <Toolbar />

                <Box
                    sx={{
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <List
                        sx={{
                            px: 1,
                            pt: 1.5,
                        }}
                    >
                        {menuItems.map((item) => (
                            <ListItemButton
                                key={item.text}
                                selected={
                                    selected === item.text
                                }
                                onClick={() =>
                                    handleNavigate(item)
                                }
                                sx={{
                                    mb: 0.5,
                                    borderRadius: 1.5,
                                    px: 1.5,

                                    "&.Mui-selected": {
                                        bgcolor: "#EAF2F8",
                                        color: "#16324F",
                                    },

                                    "&.Mui-selected:hover": {
                                        bgcolor: "#EAF2F8",
                                    },

                                    "&:hover": {
                                        bgcolor: "#F4F7FA",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color:
                                            selected ===
                                            item.text
                                                ? "#1F6FB2"
                                                : "#667788",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight:
                                            selected ===
                                            item.text
                                                ? 600
                                                : 500,
                                        fontSize: 15,
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List>

                    <Box sx={{ flexGrow: 1 }} />

                    <Divider />

                    <List
                        sx={{
                            px: 1,
                            py: 1.5,
                        }}
                    >
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: 1.5,
                                px: 1.5,

                                "&:hover": {
                                    bgcolor: "#FFF1F0",
                                    color: "#B42318",
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 40,
                                    color: "#667788",
                                }}
                            >
                                <LogoutIcon />
                            </ListItemIcon>

                            <ListItemText
                                primary="Cerrar sesión"
                                primaryTypographyProps={{
                                    fontWeight: 500,
                                    fontSize: 15,
                                }}
                            />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: "background.default",
                    minHeight: "100vh",
                    p: {
                        xs: 2,
                        md: 4,
                    },
                }}
            >
                <Toolbar />

                <Outlet />
            </Box>
        </Box>
    );
}

export default MainLayout;