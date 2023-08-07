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

interface Venue {
    name: string;
    image?: string;
  }
  
  interface IProps {
    venue: Venue;
    onClick?: ()=>void
  }
export const VenueDetailsModal: React.FC<IProps> = ({venue, onClick}) => {




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
