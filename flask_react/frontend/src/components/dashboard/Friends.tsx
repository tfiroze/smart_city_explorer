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
	Avatar,
} from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, useState, useContext, useEffect } from "react";
import { CButton } from "../common/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";


const erroDict: { [key: string]: string } = {
	'0': '',
	'1': 'Oops! Your Email or password is not ready for the journey. 🌊 Please check and try again!',
	'2': 'Oops! Our journey encountered a hiccup. 🌊 Please check again or try later.'
}
interface IProps {
	onSubmit: (arg: string) => void
	loading: boolean,
	isError: boolean,
	errorMessage: string
}

export const FriendsModal: React.FC<IProps> = ({
	onSubmit,
	loading = false,
	isError = false,
	errorMessage,
}) => {
	const [error, setError] = useState<string>("0")
	const [modalView, setModalView] = useState<number>(0)
	const [emailID, setEmailID] = useState<string>("")


	const navigate = useNavigate();

	const [format, setformat] = useState({
		email: false,
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



	const handleInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEmailID(event.target.value);
	}

	const handleModalView = () => setModalView(modalView == 0 ? 1 : 0)

	const handleSubmit = () => {
		if (validateEmail(emailID)) {
			onSubmit(emailID)
		}
	}


	return (
		<>
			<Paper
				elevation={0}
				style={{
					background: '#f7f7f7',

				}}
			>
				<Grid container style={{ padding: '20px' }}>
					<Typography variant="h5" align="center" style={{ width: '100%' }}>Friends List</Typography>
					{modalView == 0 ?
						<Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: "10px" }}>
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
									placeholder="Please Enter Friends Email..."
									variant="outlined"
									color="primary"
									fullWidth
									type="emailID"
									name="emailID"
									value={emailID}
									onChange={handleInputOnChange}
									error={format.email}
									helperText={
										format.email
											? "Your Email is off on a tropical getaway! 🏝️ Please provide a valid email address so we can catch up."
											: ""
									}
								/>
							</Box>
							{isError && <Typography variant="subtitle1" color={'red'}>
								{errorMessage}
							</Typography>}
							<Box mt={3}>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6}>
										<CButton
											title="Add Friend"
											loading={loading}
											onClick={() => { handleSubmit() }}
											style={{
												background: '#757de8', color: 'white'
											}}
										/>
									</Grid>
								</Grid>
							</Box>
						</Grid> :
						<Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: "10px" }}>
							<Grid xs={12} style={{ padding: '2px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
								<div style={{ padding: '5px', border: '2px solid #757de8', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
									<Avatar>A</Avatar>
									<span style={{ margin: '0px 10px' }}>anish@gmail.com</span>
								</div>
							</Grid>
						</Grid>
					}
					<span style={{ cursor: 'pointer' }} onClick={handleModalView}><Typography>{modalView == 1 ? 'Add Friends' : 'View Friends'}</Typography></span>
				</Grid>
			</Paper>
		</>
	);
};
