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
	makeStyles,
} from "@mui/material";
import { Box, positions } from "@mui/system";
import { ChangeEvent, useState, useContext, useEffect } from "react";
import { CButton } from "../common/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';


const erroDict: { [key: string]: string } = {
	'0': '',
	'1': 'Oops! Your Email or password is not ready for the journey. 🌊 Please check and try again!',
	'2': 'Oops! Our journey encountered a hiccup. 🌊 Please check again or try later.'
}


export const VenueDetailsModal = () => {
	const [registerOpen, setRegisterOpen] = useState(false);
	const authContext = useContext(AuthContext);
	const [autoLogin, setAutoLogin] = useState(false);
	// const [loginRequest, setLoginRequest] = useState<ILoginRequest>({
	// 	email: "",
	// 	password: "",
	// });
	const [error, setError] = useState<string>("0")
	const [loading, setLoading] = useState(false)
	const [modalView, setModalView] = useState<number>(0)


	const navigate = useNavigate();

	const [format, setformat] = useState({
		email: false,
		password: false,
	});

	const [forgotPasswordOpen, setForgotPasswordOpen] = useState<boolean>(false)

	const formValidator = () => {
		// if (
		// 	validateEmail(loginRequest.email) &&
		// 	validatePassword(loginRequest.password)
		// ) {
		// 	handleSubmit();
		// }
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

	const handleInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		// setLoginRequest({
		// 	...loginRequest,
		// 	[event.target.name]: event.target.value,
		// });
	}
	const handleSubmit = () => {
		// setLoading(true)
		// smartApi.login(loginRequest)
		// 	.then((results) => {
		// 		console.log(results);

		// 		if (results?.valid && results?.token && results?.tokenExpirationTime) {
		// 			nagvigateToDashboard(results.token, results.tokenExpirationTime)
		// 		} else {
		// 			// ... handle the case when results?.valid is falsy ...
		// 			setError(results.errorType)
		// 			setLoading(false)
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 		setError('2')
		// 		setLoading(false)
		// 	});
	};

	function setCookie(
		name: string,
		value: string | null | undefined,
		expires: string
	) {
		document.cookie = `${name}=${value}; expires=${expires}; path=/`;
	}

	const nagvigateToDashboard = (token: string, tokenExpirationTime: string) => {
		// smartApi.dashboard(token)
		// 	.then((results) => {
		// 		console.log(results);

		// 		if (results?.valid) {
		// 			const d = new Date(tokenExpirationTime);
		// 			d.setTime(d.getTime());
		// 			let expires = d.toUTCString();

		// 			setCookie("token", results.token, expires);
		// 			authContext.authenticate(true, {
		// 				first_name: results.firstname,
		// 				surname: results.surname,
		// 				user_id: results.user_id,
		// 				email: results.email,
		// 			});
		// 			localStorage.setItem("user_id", results.user_id);
		// 			localStorage.setItem("email", results.email);
		// 			localStorage.setItem("first_name", results.firstname);
		// 			localStorage.setItem("surname", results.surname);
		// 			setError('0')
		// 			setLoading(false)
		// 			navigate("/dashboard");
		// 		} else {
		// 			// ... handle the case when results?.valid is falsy ...
		// 			setError(results.errorType)
		// 			setLoading(false)
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 		setError('2')
		// 		setLoading(false)
		// 	});
	}

	const handleRegisterDialogOpen = () => setRegisterOpen(!registerOpen);
	const handleForgotPasswordDialogOpen = () => setForgotPasswordOpen(!forgotPasswordOpen)



	return (
		<>
			<Paper
				elevation={0}
				style={{
					padding: '10px',
					position:'relative',
					display:'flex',
					backgroundColor:'transparent'
				}}

			>
				<Grid container xs = {3} style={{alignItems:'center', display:'flex', position:'relative', backgroundColor:'transparent'}}>
				<img
					src="https://media.istockphoto.com/id/528725265/photo/central-park-aerial-view-manhattan-new-york.jpg?s=2048x2048&w=is&k=20&c=D1ec8s1coWVXA9JoMRfxT-zj0AW6T6b1fDlqftWllkU="
					alt=""
					style={{ 
						width:'250px', 
						borderRadius: '15px', 
						aspectRatio: 1 / 1, 
						position:'absolute', 
						left:'100px', 
						backgroundColor:'transparent',
						
					}}
				/>
				</Grid>
				<Grid container xs = {9} style={{ height:'350px',  width:'100%', display:'flex',borderRadius:'20px'}}>
					<Grid item xs = {3} style={{ height:'350px', borderRadius:'20px'}}></Grid>
					<Grid item xs = {9} style={{height:'350px', padding:'10px',borderRadius:'20px', display:'flex',flexDirection:'column', alignItems:'center'}}>
						<Typography variant="h4" style={{color:'#757de8', width:'100%'}} align="left">Central Park</Typography>
						<div style={{width:'100%', height:'1px', margin:'10px 0', backgroundColor:'#E0E0E0'}}/>
						<Typography variant="subtitle2" style={{margin:'10px 0'}}>TAP NYC is a 100% gluten-free sandwich and açaí bowl shop located on the Upper West Side. The shop has a clean and modern aesthetic, with white walls and bright lighting. There is a large counter where customers can order, and a few small tables for seati</Typography>
						<div style={{width:'100%', marginBottom:'10px', display:'flex'}}>
							<StarsRoundedIcon/>
							<Typography variant="subtitle1" style={{marginLeft:'10px'}}>Ratings: </Typography>
							{new Array(4).fill(0).map((_, index) => <StarRateRoundedIcon sx={{color: '#FFC93A'}}/>)}
						</div>
						<div style={{width:'100%', marginBottom:'10px', display:'flex'}}>
							<AccessTimeFilledRoundedIcon/>
							<Typography variant="subtitle2" style={{marginLeft:'10px'}}>Timings: </Typography>
							<Typography variant="subtitle2">9:00 AM to 11:00 AM</Typography>
						</div>
						<div style={{width:'100%', marginBottom:'10px', display:'flex'}}>
							<Groups2RoundedIcon/>
							<Typography variant="subtitle2" style={{marginLeft:'10px'}}>Busyness: </Typography>
							<Typography variant="subtitle2">Moderate</Typography>
						</div>
					</Grid>
				</Grid>
			</Paper>
		</>
	);
};
