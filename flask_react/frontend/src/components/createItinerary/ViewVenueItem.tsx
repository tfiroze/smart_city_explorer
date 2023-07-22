import React, { useEffect } from "react";
import { Icon } from 'leaflet';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import AvatarGroup from "@mui/material/AvatarGroup";
import IVenueItem from "../../models/IVenueItem";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Grid,
	Typography,
	DialogActions,
	Button,
	Chip,
	Avatar,
	CardMedia,
	Stack,
	Box,
} from "@mui/material";
import { busynessLevel, getColor, getBusynessDescription } from "../../models/busynessLevel";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import makeStyles from '@mui/styles/makeStyles';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { MapContainer, TileLayer, Popup, useMap, Marker } from 'react-leaflet';
import { Map, LatLngLiteral, LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

function MapUpdater() {
	const map = useMap();

	useEffect(() => {
		map.invalidateSize();
	}, [map]);

	return null;
}
let DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const useStyles = makeStyles({
	dialogTitle: {
		backgroundColor: "#008080",
		color: "#fff",
		textAlign: 'center',
	},
	closeButton: {
		color: "#fff",
	},
	mapContainer: {
		height: "200px",
		width: "100%",
		borderRadius: "4px",
		overflow: "hidden",
		boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
		transition: 'box-shadow 0.3s ease-in-out',
		'&:hover': {
			boxShadow: '0 2px 16px rgba(0, 0, 0, 0.1)',
		}
	},
	chip: {
		animation: '$bounce 2s infinite',
	},
	weatherIcon: {
		width: "35px",
		height: "40px",
		marginLeft: "2px",
		animation: 'spin 2s linear infinite'
	},

	introvertIcon: {
		marginLeft: '10px',
		color: '#6c757d', // grey color
	},
	'@keyframes spin': {
		'0%': { transform: 'rotate(0deg)' },
		'100%': { transform: 'rotate(360deg)' },
	},
	'@keyframes bounce': {
		'0%, 100%': {
			transform: 'scale(1)',
			opacity: 1,
		},
		'50%': {
			transform: 'scale(1.05)',
			opacity: 0.5,
		}
	}
});
const choroplethStyle = {
	fillColor: "#ff0000",
	weight: 2,
	opacity: 1,
	color: "#ffffff",
	dashArray: "3",
	fillOpacity: 0.7,
};

interface IProps {
	item: IVenueItem;
	open: boolean;
	close: () => void;
}

export const ViewVenueItem: React.FC<IProps> = ({ item, open, close }) => {
	const classes = useStyles();
	const position: LatLngLiteral = {
		lat: item.lat !== undefined ? item.lat : 0,
		lng: item.lon !== undefined ? item.lon : 0,
	};

	const greenIcon = new Icon({
		iconUrl: '/resources/images/low.svg',
		iconSize: [25, 41]
	});

	const yellowIcon = new Icon({
		iconUrl: '/resources/images/moderate.svg',
		iconSize: [25, 41]
	});

	const redIcon = new Icon({
		iconUrl: '/resources/high.svg',
		iconSize: [25, 41]
	});

	return (
		<Dialog open={open} fullWidth maxWidth="sm">
			<DialogTitle className={classes.dialogTitle}>
				<Typography variant="h6" component="div">
					{item.title}
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Box sx={{ position: "relative", paddingBottom: "56.25%" }}>
							<CardMedia
								component="img"
								alt="Venue Image"
								image={item.imgLink}
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
									objectFit: "cover",
									borderRadius: "4px",
								}}
							/>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body2">{item.description}</Typography>
					</Grid>
					<Grid item xs={6}>
						<Stack direction="row" spacing={1} alignItems="center">
							<Chip
								className={classes.chip}
								label={getBusynessDescription(item.busyness || busynessLevel.low)}
								variant="outlined"
								color={getColor(item.busyness)}
							/>

							{item.busyness === busynessLevel.low && <InsertEmoticonIcon className={classes.introvertIcon} />}
							<img
								className={classes.weatherIcon}
								loading="lazy"
								src={`https://www.meteosource.com/static/img/ico/weather/${item.weatherCode!.toString()}.svg`}
								alt=""
							/>
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<Stack direction="row" spacing={1} alignItems="center">
							<EventIcon color="primary" />
							<Typography variant="body2">{item.timeFrom}</Typography>
							<Typography variant="body2"> - </Typography>
							<AccessTimeIcon color="primary" />
							<Typography variant="body2">{item.timeTo}</Typography>
						</Stack>
					</Grid>

					<Grid item xs={12}>
						<AvatarGroup max={3}>
							{item.invitedParticipant != undefined &&
								item.invitedParticipant?.map((person, index) => (
									<Avatar
										key={index}
										alt={person}
										src={`https://randomuser.me/api/portraits/lego/${index}.jpg`}
										sx={{ width: 32, height: 32 }}
									/>
								))}
						</AvatarGroup>
					</Grid>
					<Grid item xs={12}>
						<div className={classes.mapContainer}>
							<MapContainer
								center={position}
								zoom={12}
								scrollWheelZoom={false}
								style={{ height: "100%", width: "100%" }} // icon={item.busyness === 'low' ? greenIcon : (item.busyness === 'moderate' ? yellowIcon : redIcon)}
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>
								{item.lat !== undefined && item.lon !== undefined && (
									<Marker position={position}>
										<Popup>
											<strong>Directions:</strong><br />
											<span>Lat: {item.lat}, Lon: {item.lon}</span><br />
											<a href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
										</Popup>
									</Marker>
								)}
								<MapUpdater />
							</MapContainer>
						</div>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button startIcon={<DeleteIcon />} color="error">
					Delete
				</Button>
				<Button
					variant="contained"
					onClick={close}
					startIcon={<CloseIcon />}
					sx={{ backgroundColor: "#008080", color: "#fff" }}
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};