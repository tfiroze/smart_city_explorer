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
import React, { ChangeEvent, useState, useEffect } from "react";
import IRegisterRequest from "../../models/IRegisterRequest";
import { smartApi } from "../../utils/apiCalls";

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
		if (results.valid) {
			//valid register
		} else {
			setErrorMessage(results.errorMessage!);
		}
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
		if (
			validateName(registerRequest.firstName) &&
			validateSurname(registerRequest.surname) &&
			validateEmail(registerRequest.email) &&
			validatePassword(registerRequest.password) &&
			validateConfirmPassword(registerRequest.confirmPassword)
		) {
			handleSubmit();
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleRegisterDialogOpen}
			maxWidth="xl"
			fullWidth
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				Create your free account
			</DialogTitle>
			<Divider />
			<DialogContent>
				<Grid container spacing={2}>
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
										? "Hold on, your first name needs a vacation upgrade! Let's sprinkle some travel excitement into it."
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
										? "Surname getaway! Oops, that's not a valid one."
										: ""
								}
							/>
						</Box>
					</Grid>
				</Grid>

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
								? "Looks like your Email decided to take a vacation! Please enter a valid one."
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
								? "Oops! Your password needs a vacation from errors. Please enter a valid one."
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
								? "Uh-oh! Your password wants a travel companion for confirmation. Let's make sure they're on the same journey!"
								: ""
						}
					/>
				</Box>
				{errorMessage != null && <Alert severity="error">{errorMessage}</Alert>}
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" onClick={handleRegisterDialogOpen}>
					CANCEL
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={formValidator}
					autoFocus
				>
					REGISTER
				</Button>
			</DialogActions>
		</Dialog>
	);
};
