import React from "react";
import Slider from "../navigation/SliderNav";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImageUploader from 'react-images-upload';
import Tooltip from '@mui/material/Tooltip';
import SCELogo from "../../resources/images/SCE_Logo.png";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SliderNav from "../navigation/SliderNav";

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});


const Profile = () => {
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate("/createItinerary");
    };

    return (

        <ThemeProvider theme={theme}>
            <Box display={{ xs: 'block', md: 'flex' }} flexDirection="row" alignItems="center" p={2} sx={{ bgcolor: theme.palette.background.default }}>
                <Box pr={2}>
                    <AccountCircleIcon fontSize="large" />
                </Box>
                {/* <SliderNav /> */}
                <Box pr={2}>
                    <Typography variant="h6">Jane Doe</Typography>
                    <Typography variant="subtitle2">Personal Account</Typography>
                </Box>
                <Box pr={2}>
                    <ImageUploader
                        buttonText='Upload Image'
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                    />
                </Box>
            </Box>

            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: 'column', md: 'row' },
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        maxHeight: 700,
                        p: 7,
                        m: 1,
                        ml: 5,
                        mr: 5,
                        borderRadius: '20px',
                        bgcolor: theme.palette.background.paper
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            flexWrap: "wrap",
                            textAlign: "left",
                            m: 2,
                        }}
                    >
                        <Typography variant="h2" component="div" sx={{ fontWeight: 500 }}>
                            Explore Manhattan
                        </Typography>
                    </Box>

                    <Tooltip title="Hold onto your hat! It's about to get busy!" arrow>
                        <Button
                            variant="contained"
                            sx={{ height: 50, width: 200, backgroundColor: "#757de8", color: "white", mt: 2, mb: 2 }}
                            onClick={handleOnClick}
                            startIcon={<LuggageRoundedIcon />}
                        >
                            Create Itinerary
                        </Button>
                    </Tooltip>
                </Box>
            </Container>

            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" p={2}>
                <Box sx={{ '&:hover': { transform: 'rotate(360deg)', transition: '1s' } }}>
                    <img src={SCELogo} alt="sce-logo" style={{ height: "100px" }} />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Profile;
