import React, { useState } from 'react';
import IItinerary from "../../models/IItinerary";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  SnackbarCloseReason,
  styled,
  Theme,
  createStyles,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";


const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  [theme.breakpoints.up("md")]: {
    width: "80%",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  // animation: "wiggle 1s infinite",
  // "@keyframes wiggle": {
  //   "0%": {
  //     transform: "rotate(-2deg)",
  //   },
  //   "50%": {
  //     transform: "rotate(2deg)",
  //   },
  //   "100%": {
  //     transform: "rotate(-2deg)",
  //   },
  // },
}));

const StyledDisclaimer = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(10),
  transition: "transform 0.3s ease-in-out",
  cursor: "default",
  "&:hover": {
    transform: "scale(1.2)",
  },
}));

interface IProps {
  venids:string[], 
  date: string
  // completed: (data: IItinerary) => void;
}

export const ConfirmItineraryItems: React.FC<IProps> = ({ 
  venids,
  date
  // completed 
}) => {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleFinish = () => {
    setOpen(true);
    navigate("/dashboard");
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };

  const handleClose = (
    event: React.SyntheticEvent<Event, any> | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <StyledPaper elevation={0} style={{height:'100vh'}}>
        <Typography variant="h6" gutterBottom>
          Confirm Itinerary
        </Typography>
          <TextField
            label="Itinerary Name"
            fullWidth
            value={name}
            onChange={handleNameChange}
            style={{width:'20%'}}
          />

          <StyledButton
            variant="contained"
            endIcon={<CheckCircleOutlineIcon />}
            onClick={handleFinish}
          >
            Finish Planning
          </StyledButton>
        <StyledDisclaimer variant="body2" align="center" mt={2}>
          *Disclaimer: By clicking "Finish Planning," you agree to embark on this amazing adventure with a smile and a sense of humour. Bon voyage!
        </StyledDisclaimer>
      </StyledPaper>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Congratulations! Your itinerary has been confirmed. Now get ready for an amazing adventure!
        </Alert>
      </Snackbar>
    </Grid>
  );
};
