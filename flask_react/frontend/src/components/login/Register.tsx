import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	TextField,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import IRegisterRequest from "../../models/IRegisterRequest";
import { smartApi } from "../../utils/apiCalls";
import { CButton } from "../common/button";
import { LoadingButton } from "@mui/lab";

interface IProps {
	open: boolean;
	handleRegisterDialogOpen: () => void;
}

export const Register: React.FC<IProps> = ({
	open,
	handleRegisterDialogOpen,
}) => {

	const [registerRequest, setRegisterRequest] = useState<IRegisterRequest>({
		firstName: "",
		surname: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [format, setFormat] = useState({
		firstName: false,
		surname: false,
		email: false,
		password: false,
		confirmPassword: false,
	});

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleInputOnChange = (event: ChangeEvent<HTMLInputElement>) =>
		setRegisterRequest({
			...registerRequest,
			[event.target.name]: event.target.value,
		});

	const handleSubmit = () => {
		let results = smartApi.register(registerRequest, true);

		console.log(results)
		// if (results.valid) {
		// 	//valid register
		// } else {
		// 	setErrorMessage(results.errorMessage!);
		// }
	};

	const validateName = (name: string) => {
		if (name === "" || !/^[a-zA-Z\s'-]+$/.test(name)) {
			setFormat({
				...format,
				firstName: true,
			});
			return false;
		} else {
			setFormat({
				...format,
				firstName: false,
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

	const formValidator = () => {
		handleSubmit();
		// if (
		// 	validateName(registerRequest.firstName) &&
		// 	validateSurname(registerRequest.surname) &&
		// 	validateEmail(registerRequest.email) &&
		// 	validatePassword(registerRequest.password) &&
		// 	validateConfirmPassword(registerRequest.confirmPassword)
		// ) {
		// 	handleSubmit();
		// }
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
			<DialogTitle id="alert-dialog-title">{"Let's Create Your Free Account"}</DialogTitle>
			<Divider />
			<DialogContent>
				<Grid container spacing={3}>
					<Grid item md={6} xs={12} lg={6}>
						<Box my={2}>
							<TextField
								label="First Name"
								placeholder="Please enter your first name..."
								variant="outlined"
								color="primary"
								fullWidth
								type="text"
								name="firstName"
								value={registerRequest.firstName}
								onChange={handleInputOnChange}
								error={format.firstName}
								helperText={
									format.firstName
										? "Upgrade your first name for a travel adventure! 🌟"
										: ""
								}
							/>
						</Box>
					</Grid>
					<Grid item md={6} xs={12} lg={6}>
						<Box my={2}>
							<TextField
								label="Last Name"
								placeholder="Please enter your last name..."
								variant="outlined"
								color="primary"
								fullWidth
								type="text"
								name="surname"
								value={registerRequest.surname}
								onChange={handleInputOnChange}
								error={format.surname}
								helperText={
									format.surname
										? "Your surname is ready for a getaway! 🌊 Enter a valid one to set sail!"
										: ""
								}
							/>
						</Box>
					</Grid>
				</Grid>

				<Grid container xs={12}>
					<Grid item md={8}>
						<Box my={2}>
							<TextField
								label="Email"
								placeholder="Please enter your email..."
								variant="outlined"
								color="primary"
								fullWidth
								type="email"
								name="email"
								value={registerRequest.email}
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
					<Grid item md ={4} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
					<LoadingButton loading={false}  variant="outlined">
						<span>Verfiy</span>
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
						type="email"
						name="email"
						value={registerRequest.email}
						onChange={handleInputOnChange}
						error={format.email}
						helperText={
							format.email
								? "Oops! It seems our Verification Code is feeling a bit shy today! 🙈 Please enter a valid code to proceed."
								: ""
						}
					/>
				</Box>
				<Box my={2}>
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
						value={registerRequest.confirmPassword}
						onChange={handleInputOnChange}
						error={format.confirmPassword}
						helperText={
							format.confirmPassword
								? "Uh-oh! Your password wants a travel companion for confirmation. Let's make sure they're on the same journey! 🛂"
								: ""
						}
					/>
				</Box>
				{errorMessage != null && <Alert severity="error">{errorMessage}</Alert>}
			</DialogContent>
			<DialogActions>
				<CButton
					title="Cancel"
					style={{
						border: '1px solid #008080', color: '#008080', background: 'white'
					}}
					onClick={handleRegisterDialogOpen} />

				<CButton
					title="REGISTER"
					onClick={formValidator}
					style={{
						background: '#008080', color: 'white'
					}}
				/>
			</DialogActions>
		</Dialog>
	);
};
