import React, { useContext, useEffect, useState } from "react";
import { AuthContext, ThemeContext } from "../../../utils/ApplicationContext";
import Paper from "@mui/material/Paper";
import {
	Avatar,
	Divider,
	Menu,
	MenuItem,
	Switch,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import FaceIcon from "@mui/icons-material/Face";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";

export const Header = () => {
    const authContext = useContext(AuthContext);
	const themeContext = useContext(ThemeContext);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const open = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleThemeChange = () => {
		themeContext.onChange();
	};
  return (
    <div>
    <Menu
        anchorEl={anchorEl}
        open={open}
        PaperProps={{
            elevation: 2,
        }}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
        <MenuItem>
            <SettingsIcon />
            <Typography variant="subtitle1"> User Settings</Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
            <NightsStayIcon />
            <Typography> Dark Mode</Typography>
            <Switch
                checked={themeContext.theme === "dark"}
                onChange={handleThemeChange}
            />
        </MenuItem>
        <Divider />
        <MenuItem>
            <LogoutIcon />
            <Typography variant="subtitle1"> Log Out</Typography>
        </MenuItem>
    </Menu>
    <Paper square style={{ padding: "5px" }}>
        <Grid container alignItems="center">
            <Grid xs={10}>
                <Typography variant="h5">
                    Welcome {authContext.userInfo?.name}!
                </Typography>
            </Grid>
            <Grid xs={2}>
                <Avatar style={{ float: "right" }} onClick={handleClick} />
            </Grid>
        </Grid>
    </Paper>
</div>
  )
}
