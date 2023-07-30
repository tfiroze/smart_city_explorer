import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../utils/ApplicationContext';
import { AuthContext } from '../../utils/AuthContext';
import Paper from '@mui/material/Paper';
import { Avatar, Divider, Menu, MenuItem, Step, StepLabel, Stepper, Switch, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

import { useLocation } from 'react-router-dom';

interface IProps {
  activeStep: number | undefined;
  steps: null | string[];
}


export const Header : React.FC<Partial<IProps>> = ({
  activeStep,
  steps
})=> {

  const pathname = useLocation()

  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showTimeline, setShowTimeLine] = useState<boolean>(false)

  useEffect(() => {
    pathname.pathname == '/createItinerary' ? setShowTimeLine(true) : setShowTimeLine(false)
  }, [])

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

  const getAvatarColor = () => {
    return themeContext.theme === 'dark' ? '#ffffff' : '#115b4c';
  };





  return (
    <div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <SettingsIcon />
          <Typography variant="subtitle1">User Settings</Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <NightsStayIcon />
          <Typography>Dark Mode</Typography>
          <Switch checked={themeContext.theme === 'dark'} onChange={handleThemeChange} />
        </MenuItem>
        <Divider />
        <MenuItem>
          <LogoutIcon />
          <Typography variant="subtitle1">Log Out</Typography>
        </MenuItem>
      </Menu>
      <Paper
        elevation={0}
        style={{
          padding: '10px',
          backgroundColor: '#ffff',
          color: '#115b4c',
        }}
      >
        <Grid container alignItems="center" xs={12}>
          <Grid item xs={3}>
            <Typography variant="h5" align='left'>
              Welcome {authContext.userInfo?.first_name}!
            </Typography>
          </Grid>
          <Grid item xs={5}>
              <Stepper activeStep={activeStep} sx={{ mx: "auto" }}>
                {steps?.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
          </Grid>
          <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Avatar
              style={{
                cursor: 'pointer',
                backgroundColor: getAvatarColor(),
              }}
              onClick={handleClick}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
