import React, { useState } from "react";
import { Header } from "../dashboard/Header";
import Avatar from "@mui/material/Avatar";
import Tooltip from '@mui/material/Tooltip';
import SCELogo from "../../resources/images/SCE_Logo.png";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import { ProfileDrawer } from "../navigation/ProfileDrawer";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import LuggageIcon from "@mui/icons-material/Luggage";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HistoryIcon from '@mui/icons-material/History';

const LeftNavigation = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    return (
        <div>
            <Divider>
                <Button onClick={toggleDrawer(true)}>Open Menu</Button>
            </Divider>
            <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
                <List>
                    {['Home', 'Update User Password', 'Requests', 'Past Trips', 'Upcoming Trips', 'Weather'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index === 0 ? <HomeIcon /> :
                                    index === 1 ? <LockOpenIcon /> :
                                        index === 2 ? <ListAltIcon /> :
                                            index === 3 ? <HistoryIcon /> :
                                                index === 4 ? <LuggageIcon /> :
                                                    <WbSunnyIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </div>
    );
}

const Profile = () => {
    const navigate = useNavigate();
    const [ProfileDrawerOpen, setProfileDrawerOpen] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setUploadedImage(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOnClick = () => {
        navigate("/createItinerary");
    };

    const handleClose = () => {
        setProfileDrawerOpen(false);
    };

    const handleProfileOpen = () => {
        setProfileDrawerOpen(true);
    };

    const getUserInitials = (name: string) => {
        const splitName = name.split(" ");
        if (splitName.length === 1) return splitName[0][0];
        return splitName[0][0] + splitName[1][0];
    };

    const renderAvatar = () => {
        if (uploadedImage) {
            return <img src={uploadedImage} alt="Uploaded Profile" style={{ width: 100, height: 100, borderRadius: '50%' }} />;
        }
        return <Avatar>{getUserInitials("Jane Doe")}</Avatar>;
    };

    return (
        <Container>
            <Header />
            <LeftNavigation />
            <Box display="flex" flexDirection="column" alignItems="center" m={3}>
                <Box display="flex" flexDirection="row" alignItems="center" p={2} >
                    {renderAvatar()}
                    <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} id="imageUpload" />
                    <Box ml={2}>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>Jane Doe</Typography>
                        <Typography variant="subtitle2" color="textSecondary">Personal Account</Typography>
                    </Box>
                </Box>
                <label htmlFor="imageUpload">
                    <Button component="span" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Upload Profile Picture
                    </Button>
                </label>
                <Divider orientation="horizontal" flexItem sx={{ width: "100%", my: 2 }} />
                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width="100%" mt={2}>
                    <ProfileDrawer open={ProfileDrawerOpen} handleClose={handleClose} />
                    <Paper elevation={3} sx={{ padding: 3, flex: 1, ml: 3, borderRadius: "10px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 500, mb: 3 }}>
                            Explore Manhattan
                        </Typography>
                        <Tooltip title="Hold onto your hat! It's about to get busy!" arrow>
                            <Button
                                variant="contained"
                                sx={{ height: 50, width: "100%", backgroundColor: "#757de8", color: "white", mt: 2, mb: 2 }}
                                onClick={handleOnClick}
                                startIcon={<LuggageRoundedIcon />}
                            >
                                Create Itinerary
                            </Button>
                        </Tooltip>
                        <Box display="flex" justifyContent="center" mt={2} sx={{ '& img:hover': { transform: 'scale(1.1)' } }}>
                            <img src={SCELogo} alt="sce-logo" style={{ height: "80px" }} />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};

export default Profile;
