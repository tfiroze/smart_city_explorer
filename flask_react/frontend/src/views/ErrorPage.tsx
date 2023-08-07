import React from "react";
import {
    Button,
    Grid,
    Typography,
    Box,
    useTheme,
    styled
} from "@mui/material";

const StyledButton = styled(Button)(({ theme }) => ({
    animation: 'pulse 1.5s ease-in-out infinite',
    '&:hover': {
        animationPlayState: 'paused'
    }
}));

export const ErrorPage = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `
                    linear-gradient(to bottom, #121738 0%, #1c2a48 60%, #26344b 80%, #2e3f5c 100%)
                `,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <img
                src="/UFO.png"
                alt="UFO"
                style={{
                    width: '200px',
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    animation: 'float 2s ease-in-out infinite'
                }}
            />

            <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "80vh", p: 3 }}>
                <Grid item xs={11} md={6}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>
                            Oops! An Unexpected Encounter!
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.secondary, textAlign: 'center', maxWidth: '80%', mb: 4 }}>
                            Our content seems to have attracted some extraterrestrial attention. We're establishing communications. Meanwhile, you can return to a safer orbit.
                        </Typography>
                        <StyledButton
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => window.location.href = '/'}
                        >
                            Beam Me Up!
                        </StyledButton>
                    </Box>
                </Grid>
            </Grid>

            <style>{`
                @keyframes float {
                    0% {
                        transform: translateX(-50%) translateY(0px);
                    }
                    50% {
                        transform: translateX(-50%) translateY(-20px);
                    }
                    100% {
                        transform: translateX(-50%) translateY(0px);
                    }
                }
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        boxShadow: none;
                    }
                    50% {
                        transform: scale(1.05);
                        boxShadow: 0 0 20px #000000;
                    }
                    100% {
                        transform: scale(1);
                        boxShadow: none;
                    }
                }
            `}</style>
        </Box>
    );
};








