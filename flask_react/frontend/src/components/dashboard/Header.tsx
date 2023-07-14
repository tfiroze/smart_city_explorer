import React, { useContext, useState } from "react";
import { ThemeContext } from "../../utils/ApplicationContext";
import { AuthContext } from "../../utils/AuthContext";
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
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

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
    <div style={{marginBottom:'20px'}}>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <SettingsIcon />
          <Typography variant="subtitle1">User Settings</Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <NightsStayIcon />
          <Typography>Dark Mode</Typography>
          <Switch
            checked={themeContext.theme === "dark"}
            onChange={handleThemeChange}
          />
        </MenuItem>
        <Divider />
        <MenuItem>
          <LogoutIcon />
          <Typography variant="subtitle1">Log Out</Typography>
        </MenuItem>
      </Menu>
      <Paper
        square
        elevation={3}
        sx={{
          padding: "10px",
          backgroundColor: "#115b4c",
          color: "#fff",
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={10}>
            <Typography variant="h5">
              Welcome {authContext.userInfo?.first_name}!
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Avatar
              style={{ float: "right", cursor: "pointer" }}
              onClick={handleClick}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};