import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#2F80ED",
            dark: "#0F2742",
            light: "#E8F2FF",
        },

        secondary: {
            main: "#36C2B4",
        },

        success: {
            main: "#2FA36B",
        },

        error: {
            main: "#E25858",
        },

        background: {
            default: "#F5F8FC",
            paper: "#FFFFFF",
        },

        text: {
            primary: "#132238",
            secondary: "#6C7A89",
        },
    },

    typography: {
        fontFamily:
            '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

        h4: {
            fontWeight: 750,
            color: "#0F2742",
            letterSpacing: "-0.5px",
        },

        h5: {
            fontWeight: 700,
            color: "#0F2742",
        },

        button: {
            textTransform: "none",
            fontWeight: 650,
        },
    },

    shape: {
        borderRadius: 12,
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                    borderRadius: 10,
                    paddingLeft: 18,
                    paddingRight: 18,
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
                    backgroundColor: "#F3F7FB",
                },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 700,
                    color: "#0F2742",
                },
            },
        },

        MuiTextField: {
            defaultProps: {
                variant: "outlined",
            },
        },
    },
});

export default theme;