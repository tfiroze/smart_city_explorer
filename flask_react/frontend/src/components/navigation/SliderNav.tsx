import * as React from "react";
import SCELogo from "../../resources/images/SCE_Logo.png";
import { Link } from "react-router-dom";
import { styled, useTheme, Theme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HistoryIcon from '@mui/icons-material/History';
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import HomeIcon from "@mui/icons-material/Home";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import LuggageIcon from "@mui/icons-material/Luggage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar, Grid } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from '../../utils/AuthContext';

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar)(({ theme }: { theme: Theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme }: { theme: Theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
}));

export default function SliderNav() {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        //esh
    };

    // theme thingy
    const getAvatarColor = () => {
        return theme.palette.mode === 'dark' ? '#757de8' : '#757de8';
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{
                marginLeft: `${open ? drawerWidth : 0}px`,
                width: `calc(100% - ${open ? drawerWidth : 0}px)`,
                transition: theme.transitions.create(["width", "margin"], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ marginRight: '36px', ...(open && { display: 'none' }), }}
                >
                    <MenuIcon />
                </IconButton>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h6" noWrap component="div">
                            <Link to="/">
                                <img src={SCELogo} alt="sce-logo" style={{ height: "50px" }} />
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" align='left' style={{ fontFamily: "Georgia, serif", fontWeight: 600, marginRight: '10px', color: "#757de8" }}>
                            Welcome {authContext.userInfo?.first_name}! 👋
                        </Typography>
                        <Avatar
                            style={{
                                cursor: 'pointer',
                                backgroundColor: getAvatarColor(),
                                marginRight: '10px',
                                boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
                                width: '40px',
                                height: '40px',
                                border: '2px solid #757de8',
                                transition: 'transform 0.3s'
                            }}
                            onClick={handleClick}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </Grid>
                </Grid>
            </AppBar>
            <Drawer variant="permanent" sx={{
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                width: `${open ? drawerWidth : theme.spacing(7) + 1}px`,
                overflowX: 'hidden',
            }}>
                <DrawerHeader>
                    {open ? (
                        <>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </>
                    ) : (
                        <IconButton onClick={handleDrawerOpen}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    )}
                </DrawerHeader>
                <Divider />
                <List>
                    {['Home', 'Update Password', 'Requests', 'Past Trips', 'Upcoming Trips', 'Weather'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index === 0 ? <HomeIcon /> : index === 1 ? <LockOpenIcon /> : index === 2 ? <ListAltIcon /> : index === 3 ? <HistoryIcon /> : index === 4 ? <LuggageIcon /> : <WbSunnyIcon />}
                            </ListItemIcon>
                            {open && <ListItemText primary={text} />}
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['Profile'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index === 0 ? <AccountCircleIcon /> : null}
                            </ListItemIcon>
                            {open && <ListItemText primary={text} />}
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
            </Box>
        </Box>
    );
}
