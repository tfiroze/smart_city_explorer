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
import IRegisterRequest from "../../../models/IRegisterRequest";
import { smartApi } from "../../../utils/apiCalls";

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
	});

	const [errorMessage, setErrorMessage] = useState<string|null>(null)

	const handleInputOnChange = (event: ChangeEvent<HTMLInputElement>) =>
		setRegisterRequest({
			...registerRequest,
			[event.target.name]: event.target.value,
		});

		const handleSubmit = () =>{
			let results = smartApi.register(registerRequest,true);
			if(results.valid){
				//valid register

			}else{
				setErrorMessage(results.errorMessage!)
			}

		}

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
						type="password"
						value={registerRequest.password}
						onChange={handleInputOnChange}
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
					onClick={handleSubmit}
					autoFocus
				>
					REGISTER
				</Button>
			</DialogActions>
		</Dialog>
	);
};
