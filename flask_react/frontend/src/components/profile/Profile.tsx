import React from "react";
import Slider from "../../components/navigation/Slider";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Tooltip from '@mui/material/Tooltip';
import SCELogo from "../../resources/images/SCE_Logo.png";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";

const Profile = () => { //props: ProfileProps
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate("/createItinerary");
    };

    return (
        <>
            <Slider />
            <Box display={{ xs: 'block', md: 'flex' }} flexDirection="row" alignItems="center" p={2}>
                <Box pr={2}>
                    <AccountCircleIcon fontSize="large" />
                </Box>
                <Box pr={2}>
                    <Typography variant="h6">Busy Beaver</Typography>
                    <Typography variant="subtitle2">Workaholic Account</Typography>
                </Box>
                <Box pr={2}>
                    <Button variant="outlined" startIcon={<UploadFileIcon />} >
                        Upload Image
                    </Button>
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
                        borderRadius: '20px'
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
        </>
    );
};

export default Profile;
