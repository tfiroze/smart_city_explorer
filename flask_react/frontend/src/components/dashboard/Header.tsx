import React, { useContext, useState, useCallback } from "react";
import { ThemeContext } from "../../utils/ApplicationContext";
import { AuthContext } from "../../utils/AuthContext";
import Logo from "../../resources/images/SCE_Logo.png";
import {
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Typography,
  useTheme,
  Grid,
  styled,
  Button,
  TextField,
  Hidden
} from "@mui/material";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation, useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircle from "@mui/icons-material/AccountCircle";
import InputAdornment from "@mui/material/InputAdornment";
interface IProps {
  activeStep?: number;
  steps?: string[];
}

const primaryColor = "#757de8";
const hoverColor = "#5966c1";

const toSentenceCase = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const LogoImage = styled(Grid)({
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  cursor: "pointer",
});

const WelcomeText = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  marginRight: "10px",
  color: primaryColor,
  transition: "color 0.3s",
  "&:hover": {
    color: hoverColor,
  },
});

const HeaderContainer = styled(Grid)({
  padding: "10px 20px", // Add padding for better spacing
  boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", // A subtle shadow for depth
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  cursor: "pointer",
  backgroundColor: primaryColor,
  marginRight: "10px",
  boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
  width: "40px",
  height: "40px",
  border: `2px solid ${primaryColor}`,
  transition: "transform 0.3s, background-color 0.3s",
  "&:hover": {
    backgroundColor: hoverColor,
    transform: "scale(1.05)",
  },
}));

export const Header: React.FC<Partial<IProps>> = ({
  activeStep = 0,
  steps = [],
}) => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);
  const currentTheme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [friendAnchorEl, setfriendAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [friendRequest, setFriendRequest] = useState<string[]>([
    " Jane Doe",
    " Thea Jaeger",
    " John Doe",
    " :(",
  ]);

  const handleThemeChange = useCallback(() => {
    themeContext.onChange();
    setAnchorEl(null); // Close dropdown after changing theme
  }, [themeContext]);

  const handleActionFriend = (index: number, action: "accept" | "reject") => {
    let tempLst = friendRequest;
    tempLst.splice(index, 1);
    setFriendRequest([...tempLst]);
  };

  return (
    <>
      <Menu
        anchorEl={friendAnchorEl}
        open={Boolean(friendAnchorEl)}
        onClose={() => setfriendAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div style={{ minWidth: "550px", maxWidth: "550px" }}>
          <Typography display="flex" variant="body1" justifyContent="center">
            Friend Requests
          </Typography>
          <Grid container style={{ marginBottom: '10px' }}>
            <Grid item xs={12} display='flex' justifyContent='center'>
              <TextField
                label="Add Friend"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span style={{ marginRight: '30px !important' }}>
                        <AccountCircle />
                      </span>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                style={{ margin: "10px", width: "80%" }}
              />
              <Button>Add</Button>
            </Grid>
          </Grid>

          {friendRequest.length == 0 && (
            <Typography display="flex" variant="body1" justifyContent="center">
              No pending Friend Requests
            </Typography>
          )}
          <Grid container style={{ minWidth: "200px" }}>
            {friendRequest.map((item, index) => {
              return (
                <>
                  <Grid
                    item
                    xs={8}
                    display="flex"
                    justifyContent="left"
                    alignContent="center"
                  >
                    <Avatar style={{ marginLeft: "5px" }} />
                    <Typography
                      display="flex"
                      variant="body1"
                      justifyContent="center"
                    >
                      {item}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    display="flex"
                    justifyContent="right"
                    alignContent="center"
                    style={{ marginBottom: "10px" }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      style={{ marginRight: "5px" }}
                      onClick={() => handleActionFriend(index, "reject")}
                    >
                      <CloseIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      color="success"
                      style={{ marginRight: "5px" }}
                      onClick={() => handleActionFriend(index, "accept")}
                    >
                      <CheckIcon />
                    </Button>
                  </Grid>
                </>
              );
            })}
          </Grid>
        </div>
      </Menu>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            navigate("/editProfile");
            setAnchorEl(null);
          }}
        >
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
        <MenuItem
          onClick={() => {
						/* Add logout functionality here */ setAnchorEl(null);
          }}
        >
          <LogoutIcon />
          <Typography variant="subtitle1">Log Out</Typography>
        </MenuItem>
      </Menu>
      <HeaderContainer container alignItems="center">
        <LogoImage item xs={2} onClick={() => navigate("/")}>
          <img
            src={Logo}
            alt="logo"
            style={{
              aspectRatio: "16/9",
              height: "5vh",
              transition: "height 0.5s",
            }}
          />
        </LogoImage>
        <Grid item xs={6} className="viewDtailsModal">
          {steps.length > 0 && (
            <Stepper
              activeStep={activeStep}
              sx={{
                mx: "auto",
                padding: "5px",
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
        </Grid>
        <Grid
          item
          xs={10}
          md={steps.length ? 4 : 4}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <StyledAvatar onClick={(event) => setAnchorEl(event.currentTarget)} />
        </Grid>
      </HeaderContainer>
    </>
  );
};
