import { Header } from "../components/dashboard/Header";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { ItineraryList } from "../components/dashboard/ItineraryList";
import { CreateItinerary } from "../components/dashboard/CreateItinerary";
import { useState } from "react";
import { TaxiMap } from "../components/createItinerary/TaxiMap";
import { useNavigate } from 'react-router-dom';


export const Dashboard = () => {
	const [open, setOpen] = useState(false);

	const setCreateDialogOpen = () => setOpen(!open);

	return (
		<div>
			<Header />
			<Grid container spacing={2} padding={1}>
				<Grid item md={10}>
					{/* <ItineraryList /> */}
					<Typography
						variant="h5"
						align="center"
						color="textSecondary"
						gutterBottom
					>
						Upcoming Trips...
					</Typography>
					<Typography
						variant="subtitle1"
						align="center"
						color="textSecondary"
						gutterBottom
						style={{ margin: "20px 0" }}
					>
						You haven’t created anything yet.
					</Typography>
					<Button
						onClick={setCreateDialogOpen}
						variant="contained"
						color="secondary"
						fullWidth
					>
						CREATE
					</Button>
				</Grid>
			</Grid>
			<Grid container spacing={2} padding={1}>
				<Grid item md={10}>
					{/* <ItineraryList /> */}
					<Typography
						variant="h5"
						align="center"
						color="textSecondary"
						gutterBottom
					>
						Past Trips
					</Typography>
					<Typography
						variant="subtitle1"
						align="center"
						color="textSecondary"
						gutterBottom
						style={{ margin: "20px 0" }}
					>
						No Past Trips Found!
					</Typography>
				</Grid>
			</Grid>

				<Grid container spacing={2} padding={1}>
				<Grid item md={10}>
					{/* <ItineraryList /> */}
					<Typography
						variant="h5"
						align="center"
						color="textSecondary"
						gutterBottom
					>
						Manhattan Heat Map
					</Typography>
					<TaxiMap selectedPlace={null}/>
				</Grid>

			</Grid>
		</div>
	);
};
