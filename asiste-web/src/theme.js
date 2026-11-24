import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1F6FB2",
            dark: "#16324F",
        },
        secondary: {
            main: "#2E7D4F",
        },
        background: {
            default: "#F4F7FA",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#1F2933",
            secondary: "#667788",
        },
    },

    typography: {
        fontFamily:
            '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

        h4: {
            fontWeight: 700,
            color: "#16324F",
        },

        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },

    shape: {
        borderRadius: 8,
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },

        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: "#F4F7FA",
                },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 700,
                    color: "#16324F",
                },
            },
        },
    },
});

export default theme;