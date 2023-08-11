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
	Hidden,
} from "@mui/material";
import { Box, positions } from "@mui/system";
import { ChangeEvent, useState, useContext, useEffect } from "react";
import { CButton } from "../common/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";

interface Venue {
	busyness?: number;
	description?: string;
	image?: string;
	original_ven_id?: string;
	rating?: number;
	name?: string;
	opening_time?: number;
	closing_time?: number;
}

interface IProps {
	venue: Venue;
	onClick?: () => void;
}
export const VenueDetailsModal: React.FC<IProps> = ({ venue, onClick }) => {
	return (
		<>
			<Grid
				container
				style={{
					height: "350px",
					width: "100%",
					display: "flex",
					borderRadius: "20px",
				}}
			>
				<Grid item xs={0} md={3}>
					<Hidden xsDown>
						<img
							className="viewDtailsModal"
							src={venue.image}
							alt=""
							style={{
								aspectRatio: 1 / 1,
								height: "100%",
							}}
						/>
					</Hidden>
				</Grid>
				<Grid
					item
					xs={12}
					md={9}
					style={{
						padding: '10px',
						borderRadius: "20px"

					}}
				>
					<Typography
						variant="h4"
						style={{ color: "#757de8", width: "100%" }}
						align="left"
					>
						{venue.name}
					</Typography>
					<div
						style={{
							width: "100%",
							height: "1px",
							margin: "10px 0",
							backgroundColor: "#E0E0E0",
						}}
					/>
					<Typography variant="subtitle2" style={{ margin: "10px 0" }}>
						{venue.description}
					</Typography>
					<div style={{ width: "100%", marginBottom: "10px", display: "flex" }}>
						<StarsRoundedIcon />
						<Typography variant="subtitle1" style={{ marginLeft: "10px" }}>
							Ratings:{" "}
						</Typography>
						{venue.rating &&
							new Array(Math.floor(venue.rating))
								.fill(0)
								.map((_, index) => (
									<StarRateRoundedIcon sx={{ color: "#FFC93A" }} />
								))}
					</div>
					<div style={{ width: "100%", marginBottom: "10px", display: "flex" }}>
						<AccessTimeFilledRoundedIcon />
						<Typography variant="subtitle2" style={{ marginLeft: "10px" }}>
							Timings:{" "}
						</Typography>
						{venue.opening_time && venue.opening_time !== -1 ? (
							<Typography variant="subtitle2">
								{venue.opening_time}:00 to {venue.closing_time}:00
							</Typography>
						) : (
							"Closed"
						)}
					</div>
					{venue.busyness && (
						<div
							style={{ width: "100%", marginBottom: "10px", display: "flex" }}
						>
							<Groups2RoundedIcon />
							<Typography variant="subtitle2" style={{ marginLeft: "10px" }}>
								Busyness:{" "}
							</Typography>
							<Typography variant="subtitle2">
								{venue.busyness >= 40 && venue.busyness < 80
									? " Moderate"
									: venue.busyness >= 80
										? " High"
										: " Low"}
							</Typography>
						</div>
					)}
				</Grid>
			</Grid>
		</>
	);
};
