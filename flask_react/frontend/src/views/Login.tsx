import { AccountCircle } from "@mui/icons-material";
import {
	Grid,
	Typography,
	TextField,
	InputAdornment,
	Button,
} from "@mui/material";
import { ChangeEvent, useState, useContext } from "react";
import { Register } from "../components/login/Register";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ILoginRequest from "../models/ILoginRequest";
import { smartApi } from "../utils/apiCalls";
import { AuthContext } from "../utils/AuthContext";
import { CButton } from "../components/common/button";
import { useNavigate } from "react-router-dom";
import { ForgotPassword } from "../components/login/ForgotPassword";
import { StyledPaper, StyledButton } from '../styles/loginStyles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/system';
import { Divider } from "@mui/material";



const erroDict: { [key: string]: string } = {
	'0': '',
	'1': 'Oops! Your Email or password is not ready for the journey. 🌊 Please check and try again!',
	'2': 'Oops! Our journey encountered a hiccup. 🌊 Please check again or try later.',
	'3': 'An unknown error occurred. Please try again later.'

}



const iconStyle = {
	color: '#757de8',
	fontSize: '1.5rem',
};
const LoginButton = styled(CButton)(({ theme }) => ({
	background: '#757de8',
	color: 'white',
	padding: '10px 20px',
	borderRadius: '4px',
	transition: 'all 0.3s ease',
	fontSize: '1rem',
	fontWeight: 600,
	boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.1)',
	'&:hover': {
		background: '#6066d0', // Slightly darkened color for hover effect
		boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
	},
	[theme.breakpoints.down('xs')]: {
		width: '100%',
	},
}));
const StyledTypography = styled(Typography)(({ theme }) => ({
	color: theme.palette.primary.main,
	fontFamily: "'Roboto', sans-serif",
	textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
	fontWeight: 300,
	marginBottom: '20px',
}));




// const StyledPaper = styled(Paper)(({ theme }) => ({
// 	padding: theme.spacing(3),
// }));



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
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

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

	const StyledForgotPasswordButton = styled(StyledButton)({
		'&:hover': {
			textDecoration: 'underline', // Underlines the text on hover
		},
	});


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

	function setCookie(name: string, value: string | null | undefined, expires: string) {
		const secure = window.location.protocol === 'https:'; // check if it's a secure origin
		document.cookie = `${name}=${value}; expires=${expires}; path=/;${secure ? 'secure;' : ''} HttpOnly; SameSite=Strict`;
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
			<StyledPaper>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<StyledTypography variant="h4" align="center">
							Welcome
						</StyledTypography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							InputProps={{
								startAdornment: (
									<InputAdornment position="start" style={iconStyle}>
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
					</Grid>
					<Grid item xs={12}>
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
					</Grid>
					<Grid item xs={12}>
						<span onClick={() => { handleForgotPasswordDialogOpen() }} style={{ cursor: 'pointer' }}>
							<Typography variant="body2" align="left" style={{ marginTop: '10px', cursor: 'pointer' }}>
								<span onClick={handleForgotPasswordDialogOpen} style={{ textDecoration: 'underline', color: theme.palette.primary.main }}>
									Password lost? Let's reset it! 🗝️
								</span>
							</Typography>



						</span>
						{error !== '0' && <Typography variant="subtitle1" color="error">
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
					</Grid>
					<Grid item xs={12} container direction="row" justifyContent="flex-start" alignItems="center">
						<Grid item>
							<LoginButton
								title="LOGIN"
								loading={loading}
								onClick={formValidator}
							/>
						</Grid>
						<Grid item style={{ flexGrow: 1, textAlign: 'right' }}>
							<Button onClick={handleRegisterDialogOpen}>
								Need an account?
							</Button>
						</Grid>
					</Grid>

				</Grid>
			</StyledPaper >
		</>
	);
};