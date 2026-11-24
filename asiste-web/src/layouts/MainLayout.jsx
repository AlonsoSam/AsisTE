import { useEffect, useState } from "react";

import {
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    AppBar,
    Avatar,
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

const drawerWidth = 250;

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

                    background:
                        "linear-gradient(90deg, #0F2742 0%, #143C63 100%)",

                    boxShadow:
                        "0 4px 18px rgba(15,39,66,0.18)",
                }}
            >
                <Toolbar>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.3,
                            flexGrow: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: 2.2,

                                background:
                                    "linear-gradient(135deg, #2F80ED, #36C2B4)",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                color: "#FFFFFF",
                                fontWeight: 800,
                                fontSize: 19,

                                boxShadow:
                                    "0 4px 12px rgba(47,128,237,0.35)",
                            }}
                        >
                            A
                        </Box>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                letterSpacing: 0.4,
                            }}
                        >
                            AsisTE
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.3,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 34,
                                height: 34,
                                bgcolor: "#2F80ED",
                                fontSize: 14,
                                fontWeight: 700,
                            }}
                        >
                            {username
                                .charAt(0)
                                .toUpperCase()}
                        </Avatar>

                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: 15,
                            }}
                        >
                            {username}
                        </Typography>
                    </Box>
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
                            "1px solid #E5ECF3",

                        bgcolor: "#FFFFFF",
                    },
                }}
            >
                <Toolbar />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <List
                        sx={{
                            px: 1.3,
                            pt: 2,
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
                                    mb: 0.7,
                                    px: 1.5,
                                    borderRadius: 2,

                                    transition:
                                        "all 0.2s ease",

                                    "&.Mui-selected": {
                                        bgcolor: "#E8F2FF",
                                        color: "#0F2742",
                                        boxShadow:
                                            "inset 4px 0 0 #2F80ED",
                                    },

                                    "&.Mui-selected:hover": {
                                        bgcolor: "#E8F2FF",
                                    },

                                    "&:hover": {
                                        bgcolor: "#F3F7FB",
                                        transform:
                                            "translateX(2px)",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 42,

                                        color:
                                            selected ===
                                            item.text
                                                ? "#2F80ED"
                                                : "#74879A",
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
                                                ? 650
                                                : 500,

                                        fontSize: 15,
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List>

                    <Box sx={{ flexGrow: 1 }} />

                    <Divider />

                    <List sx={{ p: 1.3 }}>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: 2,

                                "&:hover": {
                                    bgcolor: "#FFF1F1",
                                    color: "#D64545",
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 42,
                                    color: "#74879A",
                                }}
                            >
                                <LogoutIcon />
                            </ListItemIcon>

                            <ListItemText
                                primary="Cerrar sesión"
                            />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,

                    background:
                        "linear-gradient(180deg, #F5F8FC 0%, #F8FAFD 100%)",

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