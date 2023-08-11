import { AccountCircle } from "@mui/icons-material";
import {
	Grid,
	Paper,
	Typography,
	TextField,
	InputAdornment,
	FormControlLabel,
	Checkbox,
	Button,
} from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, useState, useContext, useEffect } from "react";
import { Register } from "../../components/login/Register";
import { isMobile } from "react-device-detect";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import background from "../resources/images/login-background.jpg";
import ILoginRequest from "../../models/ILoginRequest";
import { smartApi } from "../../utils/apiCalls";
import { AuthContext } from "../../utils/AuthContext";
import { CButton } from "../../components/common/button";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/lab";
import { Card, CardContent, CardActions, Snackbar } from "@mui/material";
import { ForgotPassword } from "../../components/login/ForgotPassword";



const erroDict: { [key: string]: string } = {
	'0': '',
	'1': 'Oops! Your Email or password is not ready for the journey. 🌊 Please check and try again!',
	'2': 'Oops! Our journey encountered a hiccup. 🌊 Please check again or try later.'
}

function getCookie(name: string) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export const Login = () => {
	const [registerOpen, setRegisterOpen] = useState(false);
	const authContext = useContext(AuthContext);
	const [autoLogin, setAutoLogin] = useState(false);
	const [loginRequest, setLoginRequest] = useState<ILoginRequest>({
		email: "",
		password: "",
	});
	const [error, setError] = useState<string>("0")
	const [loading, setLoading] = useState(false)


	const navigate = useNavigate();

	const [format, setformat] = useState({
		email: false,
		password: false,
	});

	const [forgotPasswordOpen, setForgotPasswordOpen] = useState<boolean>(false)

	const formValidator = () => {
		if (
			validateEmail(loginRequest.email) &&
			validatePassword(loginRequest.password)
		) {
			handleSubmit();
		}
	};

	const validateEmail = (email: string) => {
		if (
			email === "" ||
			!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
		) {
			setformat((prevFormat) => ({
				...prevFormat,
				email: true,
			}));
			return false;
		} else {
			setformat((prevFormat) => ({
				...prevFormat,
				email: false,
			}));
			return true;
		}
	};

	const validatePassword = (password: string) => {
		if (password === "") {
			setformat((prevFormat) => ({
				...prevFormat,
				password: true,
			}));
			return false;
		} else {
			setformat((prevFormat) => ({
				...prevFormat,
				password: false,
			}));
			return true;
		}
	};

	const handleInputOnChange = (event: ChangeEvent<HTMLInputElement>) =>
		setLoginRequest({
			...loginRequest,
			[event.target.name]: event.target.value,
		});

	const handleSubmit = () => {
		setLoading(true)
		smartApi.login(loginRequest)
			.then((results) => {
				console.log(results);

				if (results?.valid && results?.token && results?.tokenExpirationTime) {
					nagvigateToDashboard(results.token, results.tokenExpirationTime)
				} else {
					// ... handle the case when results?.valid is falsy ...
					setError(results.errorType)
					setLoading(false)
				}
			})
			.catch((error) => {
				console.log(error);
				setError('2')
				setLoading(false)
			});
	};

	function setCookie(
		name: string,
		value: string | null | undefined,
		expires: string
	) {
		document.cookie = `${name}=${value}; expires=${expires}; path=/`;
	}

	const nagvigateToDashboard = (token: string, tokenExpirationTime: string) => {
		smartApi.dashboard(token)
			.then((results) => {
				console.log(results);

				if (results?.valid) {
					const d = new Date(tokenExpirationTime);
					d.setTime(d.getTime());
					let expires = d.toUTCString();

					setCookie("token", results.token, expires);
					authContext.authenticate(true, {
						first_name: results.firstname,
						surname: results.surname,
						user_id: results.user_id,
						email: results.email,
					});
					localStorage.setItem("user_id", results.user_id);
					localStorage.setItem("email", results.email);
					localStorage.setItem("first_name", results.firstname);
					localStorage.setItem("surname", results.surname);
					setError('0')
					setLoading(false)
					navigate("/dashboard");
				} else {
					// ... handle the case when results?.valid is falsy ...
					setError(results.errorType)
					setLoading(false)
				}
			})
			.catch((error) => {
				console.log(error);
				setError('2')
				setLoading(false)
			});
	}

	const handleRegisterDialogOpen = () => setRegisterOpen(!registerOpen);
	const handleForgotPasswordDialogOpen = () => setForgotPasswordOpen(!forgotPasswordOpen)

	useEffect(() => {
		const token = getCookie("token");
		if (token) {
			// Verify token with the server
			smartApi.dashboard(token)
				.then((results) => {
					if (results?.valid) {

						navigate("/dashboard");
					} else {

					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [navigate]);



	return (
		<>
			<Register
				open={registerOpen}
				handleRegisterDialogOpen={handleRegisterDialogOpen}
			/>

			<ForgotPassword
				open={forgotPasswordOpen}
				handleForgotPasswordDialogOpen={handleForgotPasswordDialogOpen}
			/>
			<Paper
				elevation={0}
				style={{
					background: '#f7f7f7',

				}}
			>
				<Grid container style={{ padding: '20px' }}>
					<Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: "10px" }}>
						<Typography
							variant="h4"
							align="center"
							color="textSecondary"
							gutterBottom
							style={{ margin: "20px 0" }}
						>
							Welcome
						</Typography>
						<Box my={2}>
							<TextField
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<AccountCircle />
										</InputAdornment>
									),
								}}
								label="Email"
								placeholder="Please enter your email..."
								variant="outlined"
								color="primary"
								fullWidth
								type="email"
								name="email"
								value={loginRequest.email}
								onChange={handleInputOnChange}
								error={format.email}
								helperText={
									format.email
										? "Your Email is off on a tropical getaway! 🏝️ Please provide a valid email address so we can catch up."
										: ""
								}
							/>
						</Box>
						<Box my={2}>
							<TextField
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LockOpenIcon />
										</InputAdornment>
									),
								}}
								label="Password"
								placeholder="Please enter your password..."
								variant="outlined"
								color="primary"
								fullWidth
								type="password"
								name="password"
								value={loginRequest.password}
								error={format.password}
								onChange={handleInputOnChange}
								helperText={
									format.password
										? "Oops! Your password needs a vacation from errors 🏖️. Please enter a valid one."
										: ""
								}
							/>
						</Box>
						<span onClick={() => { handleForgotPasswordDialogOpen() }} style={{ cursor: 'pointer' }}>
							<Typography variant="subtitle1" >
								Password lost? Let's reset it! 🗝️
							</Typography>
						</span>
						{error !== '0' && <Typography variant="subtitle1" color={'red'}>
							{erroDict[error.toString()]}
						</Typography>}
						{/* <FormControlLabel
							control={
								<Checkbox
									checked={autoLogin}
									onChange={handleAutoLoginChange}
								/>
							}
							label="Remember Me?"
						/> */}
						<Box mt={3}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<CButton
										title="LOGIN"
										loading={loading}
										onClick={formValidator}
										style={{
											background: '#757de8', color: 'white'
										}}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Button
										style={{ float: "right" }}
										onClick={handleRegisterDialogOpen}
									>
										Need an account?
									</Button>
								</Grid>
							</Grid>
						</Box>
					</Grid>
				</Grid>
			</Paper>
		</>
	);
};
