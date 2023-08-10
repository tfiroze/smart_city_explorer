import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Fade,
	Grid,
	Snackbar,
	TextField,
	Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { ChangeEvent, useState } from "react";
import IRegisterRequest from "../../models/IRegisterRequest";
import { smartApi } from "../../utils/apiCalls";
import { CButton } from "../common/button";
import { TransitionProps } from "@mui/material/transitions";


interface IProps {
	open: boolean;
	handleRegisterDialogOpen: () => void;
}

const erroDict: { [key: string]: string } = {
	'0': '',
	'1': 'Oops! Email aboard 🚀. Pick another ticket! 🌈',
	'2': 'Oops! Our journey encountered a hiccup. 🌊 Please check again or try later.'
}

const globalStyles = {
	input: {
		mb: 2,
		'& .MuiOutlinedInput-root': {
			borderRadius: '8px',
		}
	},
	dialogAction: {
		justifyContent: 'space-between',
		mt: 2,
	},
	errorText: {
		mt: 1,
		color: 'error.main',
		textAlign: 'center',
	},
	verifyButton: {
		alignSelf: 'flex-end',
		ml: 2,
		color: '#ffffff',
		backgroundColor: '#757de8',
		'&:hover': {
			backgroundColor: '#5860a5'
		}
	}
};









export const Register: React.FC<IProps> = ({
	open,
	handleRegisterDialogOpen,
}) => {

	const [registerRequest, setRegisterRequest] = useState<IRegisterRequest>({
		firstname: "",
		surname: "",
		email: "",
		password: "",
		confirmPassword: "",
		captcha: ""
	});

	const [format, setFormat] = useState({
		firstname: false,
		surname: false,
		email: false,
		password: false,
		confirmPassword: false,
		captcha: false
	});

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [disableSubmit, setDisableSubmit] = useState<boolean>(true);

	const [disableVerify, setDisableVerify] = useState<boolean>(false);

	const [disableEmailInput, setEmailDisableInput] = useState<boolean>(false);

	const [error, setError] = useState<string>("0");

	const [submitLoading, setSubmitLoading] = useState<boolean>(false);

	const [verifyLoading, setVerifyLoading] = useState<boolean>(false);

	const handleInputOnChange = (event: ChangeEvent<HTMLInputElement>) =>
		setRegisterRequest({
			...registerRequest,
			[event.target.name]: event.target.value,
		});

	const handleSubmit = () => {
		setDisableSubmit(true)
		setSubmitLoading(true)
		smartApi.register(registerRequest).then((results) => {
			console.log(results);

			if (results?.valid) {
				setDisableSubmit(true)
				setSubmitLoading(false)
				setRegisterRequest({
					firstname: "",
					surname: "",
					email: "",
					password: "",
					confirmPassword: "",
					captcha: ""
				})
				setFormat({
					firstname: false,
					surname: false,
					email: false,
					password: false,
					confirmPassword: false,
					captcha: false
				})
				handleRegisterDialogOpen()
			} else {
				// ... handle the case when results?.valid is falsy ...
				setError(results.errorType)
				setDisableVerify(false)
				setDisableSubmit(false)
				setSubmitLoading(false)
			}
		})
			.catch((error) => {
				console.log(error);
				setError('2')
				setDisableVerify(false)
				setDisableSubmit(false)
				setSubmitLoading(false)
			});
	};

	const handleVerifyEmail = () => {
		setDisableVerify(true)
		setVerifyLoading(true)
		smartApi.verifyEmail(registerRequest?.email).then((results) => {
			console.log(results);

			if (results?.valid) {
				setDisableSubmit(false)
				setEmailDisableInput(true)
				setVerifyLoading(false)
				handleSnackClick()
			} else {
				// ... handle the case when results?.valid is falsy ...
				setError(results.errorType)
				setDisableVerify(false)
				setVerifyLoading(false)
				// setLoading(false)
			}
		})
			.catch((error) => {
				console.log(error);
				setError('2')
				setDisableVerify(false)
				setVerifyLoading(false)
				// setLoading(false)
			});
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

	const validatePassword = (password: string) => {
		if (password === "") {
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

	const validateConfirmPassword = (password: string) => {
		if (password === "" || password !== registerRequest.password) {
			setFormat((prevFormat) => ({
				...prevFormat,
				confirmPassword: true,
			}));
			return false;
		} else {
			setFormat((prevFormat) => ({
				...prevFormat,
				confirmPassword: false,
			}));
			return true;
		}
	};

	const validateCode = (captcha: string) => {
		if (captcha === "") {
			setFormat((prevFormat) => ({
				...prevFormat,
				captcha: true,
			}));
			return false;
		} else {
			setFormat((prevFormat) => ({
				...prevFormat,
				captcha: false,
			}));
			return true;
		}
	}

	const formValidator = () => {
		// handleSubmit();
		if (
			validateName(registerRequest.firstname) &&
			validateSurname(registerRequest.surname) &&
			validateEmail(registerRequest.email) &&
			validatePassword(registerRequest.password) &&
			validateConfirmPassword(registerRequest.confirmPassword) &&
			validateCode(registerRequest.captcha)
		) {
			handleSubmit();
		}
	};

	const emailFormValidator = () => {
		if (validateEmail(registerRequest.email)) {
			handleVerifyEmail()
		}
	}

	const [snackState, setSnackState] = React.useState<{
		open: boolean;
		Transition: React.ComponentType<
			TransitionProps & {
				children: React.ReactElement<any, any>;
			}
		>;
	}>({
		open: false,
		Transition: Fade
	});

	const handleSnackClick = (
	) => () => {
		console.log('called snack bar')
		setSnackState({
			open: true,
			Transition: Fade
		});
	};

	const handleSnackClose = () => {
		setSnackState({
			...snackState,
			open: false
		});
	};
	const globalStyles = {
		input: {
			mb: 2,
			'& .MuiOutlinedInput-root': {
				borderRadius: '8px',
			}
		},
		dialogAction: {
			justifyContent: 'space-between',
			mt: 2,
		},
		errorText: {
			mt: 1,
			color: 'error.main',
			textAlign: 'center',
		},
		verifyButton: {
			alignSelf: 'flex-end',
			ml: 2,
			color: '#ffffff',
			backgroundColor: '#757de8',
			'&:hover': {
				backgroundColor: '#5860a5'
			}
		}
	};


	return (
		<Dialog
			open={open}
			onClose={handleRegisterDialogOpen}
			maxWidth="sm"
			fullWidth
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<Snackbar
				open={snackState.open}
				onClose={handleSnackClose}
				TransitionComponent={snackState.Transition}
				message="Email Sent"
				key={snackState.Transition.name}
			/>
			<DialogTitle id="alert-dialog-title">{"Let's Create Your Free Account"}</DialogTitle>
			<Divider />
			<DialogContent>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6} md={6}>
						<TextField
							label="First Name"
							variant="outlined"
							fullWidth
							name="firstname"
							value={registerRequest.firstname}
							onChange={handleInputOnChange}
							error={format.firstname}
							helperText={format.firstname && "Invalid first name."}
							sx={globalStyles.input}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={6}>
						<TextField
							label="Last Name"
							variant="outlined"
							fullWidth
							name="surname"
							value={registerRequest.surname}
							onChange={handleInputOnChange}
							error={format.surname}
							helperText={format.surname && "Invalid last name."}
							sx={globalStyles.input}
						/>
					</Grid>
					<Grid item xs={12} >
						<TextField
							disabled={disableEmailInput}
							label="Email"
							variant="outlined"
							fullWidth
							name="email"
							value={registerRequest.email}
							onChange={handleInputOnChange}
							error={format.email}
							helperText={format.email && "Invalid email address."}
							sx={globalStyles.input}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Verification Code"
							// placeholder="Please enter the verification code you received in the email..."
							variant="outlined"
							color="primary"
							fullWidth
							type="captcha"
							name="captcha"
							value={registerRequest.captcha}
							onChange={handleInputOnChange}
							error={format.captcha}
							helperText={
								format.captcha
									? "Oops! It seems our Verification Code is feeling a bit shy today! 🙈 Please enter a valid code to proceed."
									: ""
							}
							sx={{ ...globalStyles.input, mr: 2 }} // Add a margin to the right for spacing between the input and the button
						/>
					</Grid>
					<Grid item xs={10} md={6}>
						<LoadingButton
							variant="outlined"
							onClick={emailFormValidator}
							disabled={disableVerify}
							loadingIndicator={verifyLoading}
							sx={{ ...globalStyles.verifyButton, marginTop: 1.5, marginBottom: 4, width: '90%' }}
							fullWidth
						>
							Verify
						</LoadingButton>


					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Password"
							placeholder="Please enter your password..."
							variant="outlined"
							color="primary"
							fullWidth
							type="password"
							name="password"
							value={registerRequest.password}
							onChange={handleInputOnChange}
							error={format.password}
							helperText={
								format.password
									? "Oops! Your password needs a vacation from errors 🏖️. Please enter a valid one."
									: ""
							}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Confirm Password"
							placeholder="Please enter your password again..."
							variant="outlined"
							color="primary"
							fullWidth
							type="password"
							name="confirmPassword"
							value={registerRequest.confirmPassword}
							onChange={handleInputOnChange}
							error={format.confirmPassword}
							helperText={
								format.confirmPassword
									? "Uh-oh! Your password wants a travel companion for confirmation. Let's make sure they're on the same journey! 🛂"
									: ""
							}
						/>
					</Grid>
					{error !== '0' && (
						<Grid item xs={12}>
							<Typography variant="subtitle1" sx={globalStyles.errorText}>
								{erroDict[error]}
							</Typography>
						</Grid>
					)}
				</Grid>
			</DialogContent>
			<DialogActions sx={globalStyles.dialogAction}>
				<CButton
					title="Cancel"
					onClick={handleRegisterDialogOpen}
					style={{ border: '1px solid #757de8', color: '#757de8', background: 'white' }}
				/>
				<CButton
					title="REGISTER"
					onClick={formValidator}
					loading={submitLoading}
					style={{ background: '#757de8', color: 'white' }}
				/>
			</DialogActions>
		</Dialog>
	);
};

export default Register;