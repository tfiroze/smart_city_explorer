import {
	Alert, Box, Button, Dialog, DialogActions, DialogContent,
	DialogTitle, Divider, Fade, Grid, Snackbar, TextField, Typography
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import IRegisterRequest from "../../models/IRegisterRequest";
import { smartApi } from "../../utils/apiCalls";
import { CButton } from "../common/button";
import { LoadingButton } from "@mui/lab";
import { TransitionProps } from "@mui/material/transitions";
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface IProps {
	open: boolean;
	handleForgotPasswordDialogOpen: () => void;
}

const erroDict: { [key: string]: string } = {
	'0': '',
	'1': 'Oops! Captcha missed the mark 🎯. Give it another shot!',
	'2': 'Oops! Our journey encountered a hiccup. 🌊 Please check again or try later.'
}



export const ForgotPassword: React.FC<IProps> = ({
	open,
	handleForgotPasswordDialogOpen,
}) => {

	const [passwordRequest, setPasswordRequest] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		captcha: ""
	});

	const [format, setFormat] = useState({
		email: false,
		password: false,
		confirmPassword: false,
		captcha: false
	});

	const [disableSubmit, setDisableSubmit] = useState<boolean>(true);

	const [disableVerify, setDisableVerify] = useState<boolean>(false);

	const [disableEmailInput, setEmailDisableInput] = useState<boolean>(false);

	const [error, setError] = useState<string>("0");

	const [submitLoading, setSubmitLoading] = useState<boolean>(false);

	const [verifyLoading, setVerifyLoading] = useState<boolean>(false);

	const handleInputOnChange = (event: ChangeEvent<HTMLInputElement>) =>
		setPasswordRequest({
			...passwordRequest,
			[event.target.name]: event.target.value,
		});

	const handleSubmit = () => {
		setDisableSubmit(true)
		setSubmitLoading(true)
		smartApi.forgotPassword(passwordRequest).then((results) => {
			console.log(results);

			if (results?.valid) {
				setDisableSubmit(true)
				setSubmitLoading(false)
				setPasswordRequest({
					email: "",
					password: "",
					confirmPassword: "",
					captcha: ""
				})
				setFormat({
					email: false,
					password: false,
					confirmPassword: false,
					captcha: false
				})
				handleForgotPasswordDialogOpen()
				document.cookie = "sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
		smartApi.verifyForgotPasswordEmail(passwordRequest?.email).then((results) => {
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
		if (password === "" || password !== passwordRequest.password) {
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
			validateEmail(passwordRequest.email) &&
			validatePassword(passwordRequest.password) &&
			validateConfirmPassword(passwordRequest.confirmPassword) &&
			validateCode(passwordRequest.captcha)
		) {
			handleSubmit();
		}
	};

	const emailFormValidator = () => {
		if (validateEmail(passwordRequest.email)) {
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

	return (
		<Dialog
			open={open}
			onClose={handleForgotPasswordDialogOpen}
			maxWidth="sm"
			fullWidth
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<Snackbar
				style={{ width: "50%" }}
				open={snackState.open}
				onClose={handleSnackClose}
				TransitionComponent={snackState.Transition}
				message="Email Sent"
				key={snackState.Transition.name}
			/>
			<DialogTitle id="alert-dialog-title">{"Let's Recover Your Password"}</DialogTitle>
			<Divider />
			<DialogContent>
				<Grid container xs={12}>
					<Grid item md={8}>
						<Box my={2} display="flex" alignItems="center">
							<EmailIcon color="primary" style={{ marginRight: 8 }} />
							<TextField
								disabled={disableEmailInput}
								label="Email"
								placeholder="Please enter your email..."
								variant="outlined"
								color="primary"
								fullWidth
								type="email"
								name="email"
								value={passwordRequest.email}
								onChange={handleInputOnChange}
								error={format.email}
								helperText={
									format.email
										? "Your Email is off on a tropical getaway! 🏝️ Please provide a valid email address so we can catch up."
										: ""
								}
							/>
						</Box>
					</Grid>
					<Grid item md={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<LoadingButton
							startIcon={<CheckCircleIcon />}
							loading={false}
							variant="outlined"
							onClick={emailFormValidator}
							disabled={disableVerify}
							loadingIndicator={verifyLoading}
						>
							<span>Verify</span>
						</LoadingButton>
					</Grid>
				</Grid>


				<Box my={2}>
					<TextField
						label="Verification Code"
						placeholder="Please enter the verification code you received in the email..."
						variant="outlined"
						color="primary"
						fullWidth
						type="captcha"
						name="captcha"
						value={passwordRequest.captcha}
						onChange={handleInputOnChange}
						error={format.captcha}
						helperText={
							format.captcha
								? "Oops! It seems our Verification Code is feeling a bit shy today! 🙈 Please enter a valid code to proceed."
								: ""
						}
					/>
				</Box>
				<Box my={2}>
					<TextField
						label="Password"
						placeholder="Please enter New password..."
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
								? "Oops! Your password needs a vacation from errors 🏖️. Please enter a valid one."
								: ""
						}
						disabled={disableSubmit}
					/>
				</Box>
				<Box my={2}>
					<TextField
						// change logic
						label="Confirm Password"
						placeholder="Please enter your password..."
						variant="outlined"
						color="primary"
						fullWidth
						type="confirmPassword"
						name="confirmPassword"
						value={passwordRequest.confirmPassword}
						onChange={handleInputOnChange}
						error={format.confirmPassword}
						helperText={
							format.confirmPassword
								? "Uh-oh! Your password wants a travel companion for confirmation. Let's make sure they're on the same journey! 🛂"
								: ""
						}
						disabled={disableSubmit}
					/>
				</Box>
				{error !== '0' && <Typography variant="subtitle1" color={'red'}>
					{erroDict[error.toString()]}
				</Typography>}
			</DialogContent>
			<DialogActions style={{ display: 'flex', justifyContent: 'space-evenly' }}>
				<CButton
					startIcon={<CancelIcon />}
					title="Cancel"
					style={{
						border: '1px solid #757de8', color: '#757de8', background: 'white'
					}}
					onClick={handleForgotPasswordDialogOpen} />

				<CButton
					title="REGISTER"
					onClick={formValidator}
					loading={submitLoading}
					style={{
						background: '#757de8', color: 'white'
					}}
					disabled={disableSubmit}
				/>
			</DialogActions>
		</Dialog>
	);
};
