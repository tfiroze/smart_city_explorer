import React, { useContext, useState } from "react";
import { ThemeContext } from "../../utils/ApplicationContext";
import { AuthContext } from "../../utils/AuthContext";
import Paper from "@mui/material/Paper";
import { Avatar, Divider, Menu, MenuItem, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

import locationPinGif from "../../resources/images/smart_sol.gif"; 

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
      <Paper square style={{ padding: "5px" }}>
        <Grid container alignItems="center" justifyItems='center' justifyContent='center' alignContent='center' display='flex'>
        <Grid xs={1}>
        <img
              width="50px"
                src={locationPinGif}
                alt="Location Pin"

              />
            </Grid>
          <Grid xs={9}> 
            <Typography variant="h5" style={{textAlign:'center'}}>
             <span style={{backgroundColor:'#bde0fe',padding:'10px',borderRadius:'5px'}}>Welcome {authContext.userInfo?.first_name}</span>
            </Typography>
          </Grid>
          <Grid xs={2}>
            <Avatar style={{ float: "right" }} onClick={handleClick} />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
