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
import { Register } from "../components/login/Register";
import { isMobile } from "react-device-detect";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import background from "../resources/images/login-background.jpg";
import ILoginRequest from "../models/ILoginRequest";
import { smartApi } from "../utils/apiCalls";
import { AuthContext } from "../utils/AuthContext";
import { CButton } from "../components/common/button";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/lab";
import { Card, CardContent, CardActions, Snackbar } from "@mui/material";


export const Login = () => {
	const [registerOpen, setRegisterOpen] = useState(false);
	const authContext = useContext(AuthContext);
	const [autoLogin, setAutoLogin] = useState(false);
	const [loginRequest, setLoginRequest] = useState<ILoginRequest>({
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	const [format, setformat] = useState({
		email: false,
		password: false,
	});

	const formValidator = () => {
		handleSubmit();
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
		let results = smartApi.login(loginRequest, false);
		if (results.valid) {
			const d = new Date();
			d.setTime(d.getTime() + 360 * 24 * 60 * 60 * 1000);
			let expires = d.toUTCString();
			setCookie("accessToken", results.token, expires);
			setCookie("refreshToken", results.refreshToken, expires);
			console.log("logged In");

			authContext.authenticate(true, {
				first_name: "string",
				last_name: "string",
				userUid: "string",
				email: "string",
			});
			localStorage.setItem("userUid", "string");
			localStorage.setItem("email", "string");
			localStorage.setItem("first_name", "string");
			localStorage.setItem("last_name", "string");
		} else {
		}
		navigate("/dashboard");
	};
	function setCookie(
		name: string,
		value: string | null | undefined,
		expires: string
	) {
		document.cookie = `${name}=${value}; expires=${expires}; path=/`;
	}

	const handleAutoLoginChange = () => {
		setAutoLogin(!autoLogin);
	};

	const handleRegisterDialogOpen = () => setRegisterOpen(!registerOpen);
	return (
		<>
			<Register
				open={registerOpen}
				handleRegisterDialogOpen={handleRegisterDialogOpen}
			/>
			<Paper
				elevation={0}
				style={{
					background: '#f7f7f7'
				}}
			>
				<Grid container>
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
										? "Looks like your Email decided to take a vacation! Please enter a valid one."
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
										? "Oops! Your password needs a vacation from errors. Please enter a valid one."
										: ""
								}
							/>
						</Box>
						<FormControlLabel
							control={
								<Checkbox
									checked={autoLogin}
									onChange={handleAutoLoginChange}
								/>
							}
							label="Remember Me?"
						/>
						<Box mt={3}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<CButton
										title="LOGIN"
										onClick={formValidator}
										style={{
											background: '#008080', color: 'white'
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
