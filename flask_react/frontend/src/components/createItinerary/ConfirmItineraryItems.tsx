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
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from "react-router-dom";
import { smartApi } from '../../utils/apiCalls';
import { Loader } from '../common/loader';
import { ErrorPage } from '../../views/ErrorPage';
import { AuthContext } from '../../utils/AuthContext';
import { MessagePopups } from '../common/messagePopups';
import { FriendsModal } from '../dashboard/Friends';
import { LoadingButton } from '@mui/lab';


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
  const [tripid, setTripId] = useState<number>();
  const [openFriendsModal, setOpenFriendsModal] = useState<boolean>(false);

  const [disableFinishBtn, setDisableFinishBtn] = useState<boolean>(false);
  const [buttonLoaderConfirm, setButtonLoaderConfirm] = useState<boolean>(false); 
  const [friendReqLoading, setFriendReqLoading] = useState<boolean>(false)

  const [disableTextBox, setDisableTextBox] = useState<boolean>(false)
  const [emailMessage, setEmailMessage] = useState<string>("")
  const [emailError, setEmailError] = useState<boolean>(false)

  const [emailSentPop, setEmailSentPop] = useState<boolean>(false)

  const [friendsCount, setFriendsCount] = useState<number>(0)


  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleFinish = () => {
    // setLoader(true)
    setButtonLoaderConfirm(true)
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
          setButtonLoaderConfirm(false)
          console.log(results);
          if (results?.valid && results?.trip_id) {
            setOpen(true);
            // navigate("/dashboard");
            setTripId(results.trip_id)
            setDisableFinishBtn(true)
            setDisableTextBox(true)
            
          } else {
            // ... handle the case when results?.valid is falsy ...
            setError(results.errorType)
            setDisableFinishBtn(false)
          }
        })
        .catch((error) => {
          // console.log(error);
          setError('2')
          setLoader(false)
          setDisableFinishBtn(false)
          setButtonLoaderConfirm(false)

          // setLoading(false)
        });
    } else {
      handleSelectionError('Please Provide a Name for your Trip!')
    }


  };

  const handleAddFriends = () => {
      if(tripid && friendsCount < 4){
        setEmailError(false)
        handleFriendsModal()
        setEmailMessage("")
      }else if(tripid && friendsCount == 4){
        setErrorMessage('Only 4 friends can be added!')
        handleOneButtonPopup()
      }
      else{
        setErrorMessage('Please Confirm your Trip to add Friends!')
        handleOneButtonPopup()
      }
  }

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



  const handleFriendsModal = () => setOpenFriendsModal(!openFriendsModal)

  const handleClose = (
    event: React.SyntheticEvent<Event, any> | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setEmailSentPop(false)
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

  const handleAddFriendReq = (email: string)=>{
    console.log(email);
    setFriendReqLoading(true)
    smartApi.checkEmail(email)
        .then((results) => {
          console.log(results);
          if (results?.valid && results?.user_id) {
            sendFriendRequest(results.user_id)
            setEmailError(false)
          } else {
            // ... handle the case when results?.valid is falsy ...
            setError(results.errorType)
            setEmailMessage(results.message)
            setEmailError(true)
          setFriendReqLoading(false)

          }
        })
        .catch((error) => {
          // console.log(error);
          setError('2')
          setFriendReqLoading(false)
          
          // setLoader(false)
          // setDisableFinishBtn(false)
          // setLoading(false)
        });
  }

  const sendFriendRequest = (id: number)=>{
    let req = {
      user_id: id,
      trip_id: tripid,
      trip_owner_id: authContext.userInfo?.user_id ? parseInt(authContext.userInfo?.user_id) : 0
    }
    smartApi.sendRequest(req)
    .then((results) => {
      setLoader(false)
      console.log(results);
      if (results?.valid && results?.message) {
        setFriendReqLoading(false)
        handleFriendsModal()
        setEmailSentPop(true)
        setFriendsCount(friendsCount+1)
      } else {
        // ... handle the case when results?.valid is falsy ...
        setError(results.errorType)
        
      }
    })
    .catch((error) => {
      // console.log(error);
      setError('2')
      setLoader(false)
      // setDisableFinishBtn(false)
      // setLoading(false)
    });
  }

  return (
    <>
      {loader && false ? <Loader /> :
        error == '7' ? <ErrorPage /> : <Grid container justifyContent="center" alignItems="center">
          <Dialog
            open={oneButtonModal}
            onClose={handleOneButtonPopup}
            maxWidth="sm"
            fullWidth
          >
            <MessagePopups totalButtons={1} message={oneButtonMessage} buttonText={'OK'} onFirstClick={handleOneButtonPopup} />
          </Dialog>

          <Dialog
            open={openFriendsModal}
            onClose={handleFriendsModal}
            maxWidth="sm"
            fullWidth
          >
            <FriendsModal 
            onSubmit={handleAddFriendReq} 
            loading={friendReqLoading}
            isError={emailError}
            errorMessage={emailMessage}
            />
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
              disabled={disableTextBox}
            />

            <LoadingButton
              variant="contained"
              endIcon={<CheckCircleOutlineIcon />}
              onClick={handleFinish}
              disabled={disableFinishBtn}
              style={{
                margin: '10px 0px'
              }}
              loading={buttonLoaderConfirm}
            >
              Finish Planning
            </LoadingButton>

            <div style={{display:'flex', justifyContent:'center', alignItems:'center',  width:'40%'}}>
            <StyledButton
              variant="contained"
              endIcon={<GroupAddIcon />}
              onClick={handleAddFriends}
              style={{margin:'0px 10px'}}
            >
              Add upto 4 Friends!
            </StyledButton>
            <StyledButton
              variant="contained"
              endIcon={<DashboardIcon />}
              onClick={()=>{navigate("/dashboard")}}
              style={{margin:'0px 10px'}}
              disabled={tripid ? false : true}
            >
              Dashboard
            </StyledButton>
            </div>
            <StyledDisclaimer variant="body2" align="center" mt={2}>
              *Disclaimer: By clicking "Finish Planning," you agree to embark on this amazing adventure with a smile and a sense of humour. Bon voyage!
            </StyledDisclaimer>
          
          </StyledPaper>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert severity="success" sx={{ width: '100%' }}>
              Congratulations! Your itinerary has been confirmed. Now get ready for an amazing adventure!
            </Alert>
          </Snackbar>
          <Snackbar open={emailSentPop} autoHideDuration={6000} onClose={handleClose}>
            <Alert severity="success" sx={{ width: '100%' }}>
              Email Sent!
            </Alert>
          </Snackbar>
        </Grid>}
    </>
  );
};
