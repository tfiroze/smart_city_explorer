import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Header } from "../dashboard/Header";
import Avatar from "@mui/material/Avatar";
import Tooltip from '@mui/material/Tooltip';
import SCELogo from "../../resources/images/SCE_Logo.png";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import { ProfileDrawer } from "../navigation/ProfileDrawer";
import { Dialog, Drawer, Grid, List, ListItem, ListItemIcon, ListItemText, TextField, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import LuggageIcon from "@mui/icons-material/Luggage";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HistoryIcon from '@mui/icons-material/History';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { AuthContext } from "../../utils/AuthContext";
import { CButton } from "../common/button";
import { smartApi } from "../../utils/apiCalls";
import { MessagePopups } from "../common/messagePopups";
import IItinerary from "../../models/IItinerary";
import { toTitleCase } from "../../utils/utility_func";
import dayjs from "dayjs";
import grass from '../../resources/images/grass.jpg'
import { TripNotFound } from "../common/tripNotFound";
import { Loader } from "../common/loader";
import { ErrorPage } from "../../views/ErrorPage";
import { LoadingButton } from "@mui/lab";
import { RequestLoader } from "../common/requestLoader";

const erroDict: { [key: string]: string } = {
    '0': '',
    '1': 'Oops! Your password did not match. 🌊 Please double-check and try again!',
    '2': 'Oops! Our journey encountered a hiccup. 🌊 Please check again or try later.'
}



const Profile = () => {
    const navigate = useNavigate();
    const [ProfileDrawerOpen, setProfileDrawerOpen] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [activeOption, setActiveOption] = useState<string>('Home');
    const [passwordRequest, setPasswordRequest] = useState({
        old_password: "",
        password: "",
    });
    const [userRequest, setUserRequest] = useState({
        firstname: "",
        surname: "",
        email: "",
        user_id: ""
    });
    const [format, setFormat] = useState({
        password: false,
        old_password: false,
        firstname: false,
        surname: false,
        email: false
    });
    const [error, setError] = useState<string>("0")
    const [submitLoading, setSubmitLoading] = useState<boolean>(false)
    const [oneButtonModal, setOneButtonModal] = useState<boolean>(false);
    const [oneButtonMessage, setOneButtonMessage] = useState<string>('');
    const [upcomingTrips, setUpcomingTrips] = useState<IItinerary[]>([]);
    const [pastTrips, setPastTrips] = useState<IItinerary[]>([]);

    const [loader, setLoader] = useState<boolean>(false)
    const [errorPage, setErrorPage] = useState(false)

    const [requestLoader, setRequestLoader] = useState<boolean>(false)
    const [requestList, setRequestList] = useState<any[]>([])

    const [acceptBtnLoading, setAcceptBtnLoading] = useState<boolean>(false)
    const [declineBtnLoading, setDeclineBtnLoading] = useState<boolean>(false)


    useEffect(() => {
        if (authContext.userInfo?.first_name !== undefined &&
            authContext.userInfo?.surname !== undefined &&
            authContext.userInfo?.email !== undefined &&
            authContext.userInfo?.user_id !== undefined &&
            authContext.userInfo?.first_name !== null &&
            authContext.userInfo?.surname !== null &&
            authContext.userInfo?.email !== null &&
            authContext.userInfo?.user_id !== null) {
            setUserRequest({
                ...userRequest,
                firstname: authContext.userInfo?.first_name,
                surname: authContext.userInfo?.surname,
                email: authContext.userInfo?.email,
                user_id: authContext.userInfo?.user_id
            })


        }
    }, [])

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setUploadedImage(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOnClick = () => {
        navigate("/createItinerary");
    };

    const handleClose = () => {
        setProfileDrawerOpen(false);
    };

    const handleProfileOpen = () => {
        setProfileDrawerOpen(true);
    };

    const getUserInitials = (name: string) => {
        const splitName = name.split(" ");
        if (splitName.length === 1) return splitName[0][0];
        return splitName[0][0] + splitName[1][0];
    };

    const renderAvatar = () => {
        if (uploadedImage) {
            return <img src={uploadedImage} alt="Uploaded Profile" style={{ width: 100, height: 100, borderRadius: '50%' }} />;
        }
        return <Avatar>{getUserInitials(`${authContext.userInfo?.first_name} ${authContext.userInfo?.surname}`)}</Avatar>;
    };

    const handleInputOnChange = (event: ChangeEvent<HTMLInputElement>) =>
        setPasswordRequest({
            ...passwordRequest,
            [event.target.name]: event.target.value,
        });
    const handleUserInputOnChange = (event: ChangeEvent<HTMLInputElement>) =>
        setUserRequest({
            ...userRequest,
            [event.target.name]: event.target.value,
        });

    const authContext = useContext(AuthContext);

    const validatePassword = (password: string) => {
        if (password === "") {
            setFormat((prevFormat) => ({
                ...prevFormat,
                old_password: true,
            }));
            return false;
        } else {
            setFormat((prevFormat) => ({
                ...prevFormat,
                old_password: false,
            }));
            return true;
        }
    };

    const validateConfirmPassword = (password: string) => {
        if (password === "" || password !== passwordRequest.password) {
            setFormat((prevFormat) => ({
                ...prevFormat,
                password: true,
            }));
            return false;
        } else {
            setFormat((prevFormat) => ({
                ...prevFormat,
                password: false,
            }));
            return true;
        }
    };

    const formPasswordValidator = () => {
        // handleSubmit();
        if (
            validatePassword(passwordRequest.old_password) &&
            validateConfirmPassword(passwordRequest.password)
        ) {
            handlePasswordSubmit();
        }
    };

    const formUserValidator = () => {
        // handleSubmit();
        if (
            validateName(userRequest.firstname) &&
            validateSurname(userRequest.surname) &&
            validateEmail(userRequest.email)
        ) {
            handleUserSubmit();
        }
    };

    const handleUserSubmit = () => {
        setSubmitLoading(true)
        smartApi.updateUserDetails(userRequest).then((results) => {
            console.log(results);
            setSubmitLoading(false)
            if (results?.valid) {
                setError(results.errorType)
                handleSelectionError('User Details has been Successfully Updated!')
                setActiveOption('Home')

                authContext.authenticate(true, {
                    first_name: userRequest.firstname,
                    surname: userRequest.surname,
                    user_id: userRequest.user_id,
                    email: userRequest.email,
                });
                localStorage.setItem("user_id", userRequest.user_id);
                localStorage.setItem("email", userRequest.email);
                localStorage.setItem("first_name", userRequest.firstname);
                localStorage.setItem("surname", userRequest.surname);
            } else {
                // ... handle the case when results?.valid is falsy ...
                setError(results.errorType)
            }
        })
            .catch((error) => {
                console.log(error);
                setError('2')
            });
    }

    const handlePasswordSubmit = () => {
        setSubmitLoading(true)
        const token = getCookieValue("token")
        token && smartApi.updatePassword(passwordRequest, token).then((results) => {
            console.log(results);
            setSubmitLoading(false)
            if (results?.valid) {
                setPasswordRequest({
                    password: "",
                    old_password: "",
                })
                setFormat({
                    ...format,
                    password: false,
                    old_password: false,
                })
                setError(results.errorType)
                handleSelectionError('Password has been Successfully Updated!')
                setActiveOption('Home')
            } else {
                // ... handle the case when results?.valid is falsy ...
                setError(results.errorType)
            }
        })
            .catch((error) => {
                console.log(error);
                setError('2')
            });
    }

    function getCookieValue(cookieName: string) {
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split("=");
            if (name === cookieName) {
                return decodeURIComponent(value);
            }
        }
        return null; // Cookie not found
    }

    const setErrorMessage = (message: string) => {
        setOneButtonMessage(message)
    }

    const handleOneButtonPopup = () => {
        setOneButtonModal(!oneButtonModal)
    }

    const handleSelectionError = (message: string) => {
        setErrorMessage(message)
        handleOneButtonPopup()
    }

    const validateName = (name: string) => {
        if (name === "" || !/^[a-zA-Z\s'-]+$/.test(name)) {
            setFormat({
                ...format,
                firstname: true,
            });
            return false;
        } else {
            setFormat({
                ...format,
                firstname: false,
            });
            return true;
        }
    };

    const validateSurname = (name: string) => {
        if (name === "" || !/^[a-z ,.'-]+$/i.test(name)) {
            setFormat({
                ...format,
                surname: true,
            });
            return false;
        } else {
            setFormat({
                ...format,
                surname: false,
            });
            return true;
        }
    };

    const validateEmail = (email: string) => {
        if (
            email === "" ||
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
        ) {
            setFormat((prevFormat) => ({
                ...prevFormat,
                email: true,
            }));
            return false;
        } else {
            setFormat((prevFormat) => ({
                ...prevFormat,
                email: false,
            }));
            return true;
        }
    };


    const handlegetTripDetails = () => {
        
        if (userRequest?.user_id) {
            setRequestLoader(true)
            smartApi.allTrips(userRequest.user_id)
                .then((results) => {
                    console.log(results);
                    setLoader(false)
                    setRequestLoader(false)
                    // setLoader(false)
                    if (results?.valid) {
                        setPastTrips([...results.completedTrips])
                        setUpcomingTrips([...results.upcomingTrips])
                        setErrorPage(false)
                    setRequestLoader(false)

                        //   getPopularPlaces()
                    } else {
                        // ... handle the case when results?.valid is falsy ...
                        setErrorPage(true)
                    setRequestLoader(false)

                    }
                })
                .catch((error) => {
                    console.log(error);
                    setErrorPage(true)
                    setLoader(false)
                });
        }
    }

    const handleDetailsNavigation = (id: number) => {
        setLoader(true)
        smartApi.getItienaryDetails(id)
            .then((results) => {
                console.log(results);
                setLoader(false)
                if (results?.valid) {
                    navigate('/ItineraryDetails', { state: { data: results.data } })
                } else {
                    // ... handle the case when results?.valid is falsy ...
                    setErrorPage(true)
                }
            })
            .catch((error) => {
                // console.log(error);
                setErrorPage(true)
                setLoader(false)
            });
    }

    const handleRequest = () => {
        if(authContext?.userInfo?.user_id){
            setRequestLoader(true)
            let req = {
                user_id: parseInt(authContext.userInfo?.user_id)
            }
            console.log(req)
            smartApi.getRequest(req)
                .then((results) => {
                    setRequestLoader(false)
                    if (results?.valid && results?.data) {
                        setRequestList(results.data)
                    } else {
                        // ... handle the case when results?.valid is falsy ...
                        setErrorPage(true)
                    }
                })
                .catch((error) => {
                    setLoader(false)
                });
        }
    }

    const handleAcceptRequest = (id: number) => {
        if(authContext?.userInfo?.user_id){
            let req = {
                user_id: parseInt(authContext.userInfo?.user_id),
                trip_id: id
            }
        setAcceptBtnLoading(true)

            smartApi.acceptRequest(req)
                .then((results) => {
                    if (results?.valid) {
                        handleRequest()
                        setAcceptBtnLoading(false)
                    } else {
                        // ... handle the case when results?.valid is falsy ...
                        setErrorPage(true)
                        setAcceptBtnLoading(false)
                    }
                })
                .catch((error) => {
                    setErrorPage(true)
                    setAcceptBtnLoading(false)
                });
        }
    }

    const handleDeclineRequest = (id: number) => {
        if (authContext?.userInfo?.user_id) {
            setDeclineBtnLoading(true)
   
            let req = {
                user_id: parseInt(authContext.userInfo?.user_id),
                trip_id: id
            }
            smartApi.acceptRequest(req)
                .then((results) => {
                    if (results?.valid) {
                        handleRequest()
                        setDeclineBtnLoading(false)
                    } else {
                        // ... handle the case when results?.valid is falsy ...
                        setErrorPage(true)
                        setDeclineBtnLoading(false)
                    }
                })
                .catch((error) => {
                    setErrorPage(true)
                    setDeclineBtnLoading(false)
                });
        }
    }

    const handleProfileClicks = (text: string) => {
        setActiveOption(text)
        if (text == 'Dashboard') {
            navigate('/')
        } else if (text == 'Past Trips' || text == 'Upcoming Trips') {
            handlegetTripDetails();
        } else if (text == 'Requests') {
            handleRequest();
        }

    }

    const currentTheme = useTheme();
    return (
        <>{
            errorPage ? <ErrorPage /> :
                <Container>
                    <Dialog
                        open={oneButtonModal}
                        onClose={handleOneButtonPopup}
                        maxWidth="sm"
                        fullWidth
                    >
                        <MessagePopups totalButtons={1} message={oneButtonMessage} buttonText={'OK'} onFirstClick={handleOneButtonPopup} />
                    </Dialog>

                    <Header />

                    <Box display="flex" flexDirection="row" mt={4}>
                        <Box width={240} mr={4} p={2} bgcolor="background.paper" borderRadius={2} boxShadow={3}>
                            <Typography variant="h6" sx={{ marginBottom: 2, marginLeft: 1 }}>Navigation</Typography>
                            <Divider />
                            <List>
                                {['Home', 'Update Details', 'Update Password', 'Requests', 'Past Trips', 'Upcoming Trips', 'Dashboard'].map((text, index) => (
                                    <ListItem button style={{ backgroundColor: activeOption == text ? currentTheme?.palette?.secondary?.main : 'transparent' }} key={text} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' } }} onClick={() => { handleProfileClicks(text) }}>
                                        <ListItemIcon>
                                            {index === 0 ? <HomeIcon /> :
                                                index === 1 ? <AdminPanelSettingsOutlinedIcon /> :
                                                    index === 2 ? <LockOpenIcon /> :
                                                        index === 3 ? <ListAltIcon /> :
                                                            index === 4 ? <HistoryIcon /> :
                                                                index === 5 ? <LuggageIcon /> :
                                                                    index === 6 ? <LocalAirportIcon /> :
                                                                        <></>}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center" flex={1}>
                            {activeOption == 'Home' && <>
                                <Box display="flex" flexDirection="row" alignItems="center" p={2}>
                                    {renderAvatar()}
                                    <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} id="imageUpload" />
                                    <Box ml={4}>
                                        <Typography variant="h6" sx={{ fontWeight: 500 }}>{authContext.userInfo?.first_name} {authContext.userInfo?.surname}</Typography>
                                        <Typography variant="subtitle2" color="textSecondary">Personal Account</Typography>
                                    </Box>
                                </Box>
                                {/* <label htmlFor="imageUpload">
                        <Button component="span" variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
                            Upload Profile Picture
                        </Button>
                    </label> */}
                                <Divider orientation="horizontal" flexItem sx={{ width: "100%", my: 2 }} />
                                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width="100%" mt={2}>
                                    <ProfileDrawer open={ProfileDrawerOpen} handleClose={handleClose} />
                                    <Paper elevation={3} sx={{ padding: 4, flex: 1, ml: 3, borderRadius: "10px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography variant="h5" component="div" sx={{ fontWeight: 500, mb: 3 }}>
                                            Explore Manhattan
                                        </Typography>
                                        <Tooltip title="Hold onto your hat! It's about to get busy!" arrow>
                                            <Button
                                                variant="contained"
                                                sx={{ height: 50, width: "100%", backgroundColor: "#757de8", color: "white", mt: 2, mb: 2 }}
                                                onClick={handleOnClick}
                                                startIcon={<LuggageRoundedIcon />}
                                            >
                                                Create Itinerary
                                            </Button>
                                        </Tooltip>
                                        <Box display="flex" justifyContent="center" mt={2} sx={{ '& img:hover': { transform: 'scale(1.1)' } }}>
                                            <img src={SCELogo} alt="sce-logo" style={{ height: "80px" }} />
                                        </Box>
                                    </Paper>
                                </Box>
                            </>}
                            {activeOption == 'Update Password' && <>

                                <Box my={2} minWidth={'100%'}>
                                    <TextField
                                        label="Current Password"
                                        placeholder="Please enter your current password..."
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        type="password"
                                        name="old_password"
                                        value={passwordRequest.old_password}
                                        onChange={handleInputOnChange}
                                        error={format.old_password}
                                        helperText={
                                            format.old_password
                                                ? "Oops! Your password needs a vacation from errors 🏖️. Please enter a valid one."
                                                : ""
                                        }
                                    />
                                </Box>
                                <Box my={2} minWidth={'100%'}>
                                    <TextField
                                        label="New Password"
                                        placeholder="Please enter your new password..."
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        type="password"
                                        name="password"
                                        value={passwordRequest.password}
                                        onChange={handleInputOnChange}
                                        error={format.password}
                                        helperText={
                                            format.password
                                                ? "Uh-oh! Your password wants a travel companion for confirmation. Let's make sure they're on the same journey! 🛂"
                                                : ""
                                        }
                                    />

                                </Box>
                                {error !== '0' && <Typography variant="subtitle1" color={'red'}>
                                    {erroDict[error.toString()]}
                                </Typography>}
                                <CButton
                                    title="Confirm"
                                    onClick={formPasswordValidator}
                                    style={{
                                        background: '#757de8', color: 'white', margin: '10px 0px'
                                    }}
                                    loading={submitLoading}
                                />
                            </>}
                            {activeOption == 'Update Details' && <>

                                <Box my={2} minWidth={'100%'}>
                                    <TextField
                                        label="First Name"
                                        placeholder="Please enter your First Name..."
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        type="firstname"
                                        name="firstname"
                                        value={userRequest.firstname}
                                        onChange={handleUserInputOnChange}
                                        error={format.firstname}
                                        helperText={
                                            format.firstname
                                                ? "Upgrade your first name for a travel adventure! 🌟"
                                                : ""
                                        }
                                    />
                                </Box>
                                <Box my={2} minWidth={'100%'}>
                                    <TextField
                                        label="Last Name"
                                        placeholder="Please enter your Last Name..."
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        type="surname"
                                        name="surname"
                                        value={userRequest.surname}
                                        onChange={handleUserInputOnChange}
                                        error={format.surname}
                                        helperText={
                                            format.surname
                                                ? "Your surname is ready for a getaway! 🌊 Enter a valid one to set sail!"
                                                : ""
                                        }
                                    />
                                </Box>
                                <Box my={2} minWidth={'100%'}>
                                    <TextField
                                        label="Email"
                                        placeholder="Please enter your Email..."
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        type="email"
                                        name="email"
                                        value={userRequest.email}
                                        onChange={handleUserInputOnChange}
                                        error={format.email}
                                        helperText={
                                            format.email
                                                ? "Your Email is off on a tropical getaway! 🏝️ Please provide a valid email address so we can catch up."
                                                : ""
                                        }
                                    />
                                </Box>
                                {(error && error !== '0') && <Typography variant="subtitle1" color={'red'}>
                                    {erroDict[error.toString()]}
                                </Typography>}
                                <CButton
                                    title="Confirm"
                                    onClick={formUserValidator}
                                    style={{
                                        background: '#757de8', color: 'white', margin: '10px 0px'
                                    }}
                                    loading={submitLoading}
                                />
                            </>}
                            {activeOption == 'Past Trips' && <>
                                {requestLoader?<RequestLoader/>:<Grid container md={12} style={{ height: '100%', display: 'flex', flexWrap: 'wrap', overflow: 'scroll' }}>
                                    {(pastTrips?.length > 0) && pastTrips.map((item: any, index: number) =>
                                        <>
                                            <div
                                                style={{
                                                    cursor: "pointer",
                                                    padding: '15px',
                                                    width: '30%',
                                                    height: '10%',
                                                    backgroundColor: currentTheme?.palette?.secondary?.main,
                                                    marginRight: '5px',
                                                    borderRadius: '10px',
                                                    backgroundPosition: 'top', // Center the background image
                                                    backgroundSize: 'cover', // Ensure the image covers the entire container
                                                    backgroundRepeat: 'no-repeat', // Prevent image repetition
                                                    margin: '10px',
                                                    border: '2px solid #757de8'
                                                }}
                                                className="unselectable"
                                                onClick={() => { handleDetailsNavigation(item.trip_id) }}
                                            >
                                                <Grid xs={12} style={{ backgroundColor: 'transparent' }}>
                                                    <Typography variant="subtitle2" fontWeight={600} align="center" style={{ backgroundColor: 'transparent' }}>
                                                        {toTitleCase(item.trip_name)}
                                                    </Typography>
                                                    <Typography variant="subtitle2" fontWeight={600} align="center" style={{ backgroundColor: 'transparent' }}>
                                                        {dayjs(item.trip_date).format("YYYY-MM-DD")}
                                                    </Typography>
                                                </Grid>
                                            </div>
                                        </>
                                    )}
                                    {
                                        (pastTrips?.length == 0) && <TripNotFound />
                                    }
                                </Grid>}
                            </>
                            }
                            {activeOption == 'Upcoming Trips' && <>
                                {requestLoader ? <RequestLoader/> : <div style={{ width: '100%', height:'50vh', display: 'flex', flexWrap: 'wrap', overflow: 'scroll' }}>
                                    {(upcomingTrips?.length > 0) && upcomingTrips.map((item: any, index: number) =>
                                        <>
                                            <div
                                                style={{
                                                    cursor: "pointer",
                                                    padding: '15px',
                                                    width: '30%',
                                                    height: '10%',
                                                    backgroundColor: currentTheme?.palette?.secondary?.main,
                                                    marginRight: '5px',
                                                    borderRadius: '10px',
                                                    backgroundPosition: 'top', // Center the background image
                                                    backgroundSize: 'cover', // Ensure the image covers the entire container
                                                    backgroundRepeat: 'no-repeat', // Prevent image repetition
                                                    margin: '10px',
                                                    border: '2px solid #757de8'
                                                }}
                                                className="unselectable"
                                                onClick={() => { handleDetailsNavigation(item.trip_id) }}
                                            >
                                                <Grid xs={12} style={{ backgroundColor: 'transparent' }}>
                                                    <Typography variant="subtitle2" fontWeight={600} align="center" style={{ backgroundColor: 'transparent' }}>
                                                        {toTitleCase(item.trip_name)}
                                                    </Typography>
                                                    <Typography variant="subtitle2" fontWeight={600} align="center" style={{ backgroundColor: 'transparent' }}>
                                                        {dayjs(item.trip_date).format("YYYY-MM-DD")}
                                                    </Typography>
                                                </Grid>
                                            </div>
                                        </>
                                    )}
                                    {
                                        (upcomingTrips?.length == 0) && <TripNotFound />
                                    }
                                </div>}

                            </>}

                            {activeOption == 'Requests' &&
                                <>
                                    {requestLoader ? <RequestLoader/> :
                                        <>{requestList?.length > 0 ?
                                            <Grid container md={12} style={{ height: '100%', display: 'flex', flexWrap: 'wrap', overflow: 'scroll', alignItems:'flex-start', justifyContent:'flex-start' }}>
                                                {requestList.map((el) => (
                                                    <div style={{ width: '100%', padding: '10px', border: '2px solid #757de8', height: '50px', borderRadius: '10px', display: 'flex', flexDirection: 'row' }}>
                                                        <div style={{ width: '50%' }}>
                                                            <Typography align="center" fontWeight={"bold"}>{el.firstname} {el.surname}</Typography>
                                                            <Typography align="center">Trip: {el.trip_name}</Typography>
                                                        </div>
                                                        <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between' }}>
                                                            <LoadingButton
                                                                variant="contained"
                                                                onClick={() => handleAcceptRequest(el.trip_id)}
                                                                style={{
                                                                    margin: '10px 0px'
                                                                }}
                                                                loading={acceptBtnLoading}
                                                            >
                                                                Accept
                                                            </LoadingButton>
                                                            <LoadingButton
                                                                variant="contained"
                                                                onClick={() => handleDeclineRequest(el.trip_id)}
                                                                style={{
                                                                    margin: '10px 0px'
                                                                }}
                                                                loading={declineBtnLoading}
                                                            >
                                                                Decline
                                                            </LoadingButton>
                                                        </div>
                                                    </div>
                                                ))}
                                            </Grid>:
                                            <Grid container md={12} style={{ height: '100%', display: 'flex', flexWrap: 'wrap', overflow: 'scroll', alignItems:'center', justifyContent:'center' }}>
                                            <Typography align="center" fontWeight={"bold"}>No Requests Found</Typography>
                                            </Grid>
                                            }
                                        </>
                                    }
                                </>
                            }
                        </Box>
                    </Box>
                </Container>}</>
    );
};


export default Profile;
