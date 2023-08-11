import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../utils/ApplicationContext';
import { AuthContext } from '../../utils/AuthContext';
import Logo from '../../resources/images/SCE_Logo.png';
import { Avatar, Divider, Menu, MenuItem, Step, StepLabel, Stepper, Switch, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation } from 'react-router-dom';
import { ProfileDrawer } from "../../components/navigation/ProfileDrawer";
import { useNavigate } from "react-router-dom";
interface IProps {
  activeStep: number | undefined;
  steps: null | string[];
}


export const Header: React.FC<Partial<IProps>> = ({
  activeStep,
  steps
}) => {
  const pathname = useLocation();
  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showTimeline, setShowTimeLine] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    pathname.pathname === '/createItinerary' ? setShowTimeLine(true) : setShowTimeLine(false);
  }, []);

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
    return themeContext.theme === 'dark' ? '#757de8' : '#757de8';
  };
  const currentTheme = useTheme();
  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate("/editProfile")}>
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
      <Grid container alignItems="center" xs={12}>
        <Grid item xs={2} style={{ justifyContent: 'center', display: 'flex' }}>
          <img src={Logo} alt='logo' style={{ aspectRatio: 16 / 9, height: '8vh', transition: 'height 0.5s' }} />
        </Grid>
        {steps?.length && <Grid item xs={6}>
          <Stepper activeStep={activeStep} sx={{ mx: "auto", backgroundColor:currentTheme.palette.secondary.main }}>
            {steps?.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>}
        <Grid item xs={steps?.length ? 4 : 10} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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

          />
        </Grid>
      </Grid>
    </>
  );
};
