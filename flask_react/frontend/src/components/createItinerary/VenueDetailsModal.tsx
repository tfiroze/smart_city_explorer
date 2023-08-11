import React from 'react';
import * as isMobile from 'ismobilejs';
import { AccountCircle } from "@mui/icons-material";
import { Grid, Paper, Typography, Avatar } from "@mui/material";
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => ({
	paperStyle: {
		padding: '10px',
		backgroundColor: 'transparent',
		display: 'flex',
		flexWrap: 'wrap',
	},
	divider: {
		width: '100%',
		height: '1px',
		margin: '10px 0',
		backgroundColor: '#E0E0E0',
	},
}));
interface Venue {
	busyness?: number,
	description?: string
	image?: string,
	original_ven_id?: string,
	rating?: number,
	name?: string,
	opening_time?: number;
	closing_time?: number;
	venue_name?: string
}

interface IProps {
	venue: Venue;
	onClick?: () => void
}
export const VenueDetailsModal: React.FC<IProps> = ({ venue, onClick }) => {
	return (
		<>
			<Paper elevation={0} style={{ padding: '10px', position: 'relative', display: 'flex', backgroundColor: 'transparent' }}>
				<Grid container xs={3} style={{ alignItems: 'center', display: 'flex', position: 'relative', backgroundColor: 'transparent' }}>

					<img
						src={venue.image}
						alt=""
						style={{
							width: '250px',
							borderRadius: '15px',
							aspectRatio: 1 / 1,
							position: 'absolute',
							left: '100px',
							backgroundColor: 'transparent',
						}}
					/>



				</Grid>
				<Grid container xs={9} style={{ height: '350px', width: '100%', display: 'flex', borderRadius: '20px' }}>
					<Grid item xs={3} style={{ height: '350px', borderRadius: '20px' }}></Grid>
					<Grid item xs={9} style={{ height: '350px', padding: '10px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
						<Typography variant="h4" style={{ color: '#757de8', width: '100%' }} align="left">
							{venue?.name ? venue?.name : venue?.venue_name ? venue?.venue_name : ''}
						</Typography>
						<div style={{ width: '100%', height: '1px', margin: '10px 0', backgroundColor: '#E0E0E0' }} />
						<Typography variant="subtitle2" style={{ margin: '10px 0' }}>
							{venue.description}
						</Typography>
						<div style={{ width: '100%', marginBottom: '10px', display: 'flex' }}>
							<StarsRoundedIcon />
							<Typography variant="subtitle1" style={{ marginLeft: '10px' }}>Ratings: </Typography>
							{venue.rating && new Array(Math.floor(venue.rating)).fill(0).map((_, index) => <StarRateRoundedIcon key={index} sx={{ color: '#FFC93A' }} />)}

						</div>
						{venue.opening_time && <div style={{ width: '100%', marginBottom: '10px', display: 'flex' }}>
							<AccessTimeFilledRoundedIcon />
							<Typography variant="subtitle2" style={{ marginLeft: '10px' }}>Time to Visit: </Typography>
							{(venue.opening_time && venue.opening_time !== -1) ?
								<Typography variant="subtitle2">{venue.opening_time}:00  to {venue.closing_time}:00</Typography> : 'Closed'}
						</div>}
						{venue.busyness && <div style={{ width: '100%', marginBottom: '10px', display: 'flex' }}>
							<Groups2RoundedIcon />
							<Typography variant="subtitle2" style={{ marginLeft: '10px' }}>Busyness: </Typography>
							<Typography variant="subtitle2">{(venue.busyness >= 40 && venue.busyness < 80) ? ' Moderate' : (venue.busyness >= 80) ? ' High' : ' Low'}</Typography>
						</div>}
					</Grid>
				</Grid>
			</Paper>
		</>
	);
};
