import React, { useContext, useState } from 'react';
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
  Dialog,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import { smartApi } from '../../utils/apiCalls';
import { Loader } from '../common/loader';
import { ErrorPage } from '../../views/ErrorPage';
import { AuthContext } from '../../utils/AuthContext';
import { MessagePopups } from '../common/messagePopups';


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
  venids: string[],
  date: string
}

export const ConfirmItineraryItems: React.FC<IProps> = ({
  venids,
  date
}) => {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState({
    name: false
  })
  const [loader, setLoader] = useState<boolean>(false)
  const [error, setError] = useState<string>("0")
  const [oneButtonModal, setOneButtonModal] = useState<boolean>(false);
  const [oneButtonMessage, setOneButtonMessage] = useState<string>('');

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleFinish = () => {
    // setLoader(true)
    if (validateTripName(name)) {
      let req = {
        trip_name: name,
        date: date,
        ven_1: venids[0],
        ven_2: venids[1],
        ven_3: venids[3],
        ven_4: venids[4],
        rest_1: venids[2],
        rest_2: venids[5],
        user_id: authContext.userInfo?.user_id
      }
      console.log(req);

      smartApi.confirmItienary(req)
        .then((results) => {
          setLoader(false)
          if (results?.valid) {
            setOpen(true);
            navigate("/dashboard");
          } else {
            // ... handle the case when results?.valid is falsy ...
            setError(results.errorType)
          }
        })
        .catch((error) => {
          // console.log(error);
          setError('2')
          setLoader(false)
          // setLoading(false)
        });
    } else {
      handleSelectionError('Please Provide a Name for your Trip!')
    }


  };

  const validateTripName = (name: string) => {
    if (name === "" || !/^[a-zA-Z\s'-]+$/.test(name)) {
      setFormat({
        ...format,
        name: true,
      });
      return false;
    } else {
      setFormat({
        ...format,
        name: false,
      });
      return true;
    }
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

  const setErrorMessage = (message: string) => {
    setOneButtonMessage(message)
}

const handleSelectionError = (message: string) => {
    setErrorMessage(message)
    handleOneButtonPopup()
}

const handleOneButtonPopup = () => {
    setOneButtonModal(!oneButtonModal)
}

  return (
    <>
      {loader && false ? <Loader /> :
        error !== '0' ? <ErrorPage /> : <Grid container justifyContent="center" alignItems="center">
          <Dialog
            open={oneButtonModal}
            onClose={handleOneButtonPopup}
            maxWidth="sm"
            fullWidth
          >
            <MessagePopups totalButtons={1} message={oneButtonMessage} buttonText={'OK'} onFirstClick={handleOneButtonPopup} />
          </Dialog>
          <StyledPaper elevation={0} style={{ height: '100vh' }}>
            <Typography variant="h6" gutterBottom>
              Confirm Itinerary
            </Typography>
            <TextField
              label="Itinerary Name"
              fullWidth
              value={name}
              onChange={handleNameChange}
              style={{ width: '20%' }}
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
        </Grid>}
    </>
  );
};
