import React, { useState } from "react";
import { Header } from "../components/dashboard/Header";
import {
	Button,
	Grid,
	Paper,
	Typography,
	Box,
	IconButton,
} from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import { TaxiMap } from "../components/createItinerary/TaxiMap";
import { CreateItinerary } from "./CreateItinerary";

export const Dashboard = () => {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const [openQuestionaire, setopenQuestionaire] = useState(false);
	const handleCreateItinerary = () => setopenQuestionaire(!openQuestionaire);

	return (
		<>
			<Header />
			{openQuestionaire && (
				<>
	
					<CreateItinerary handleCreateItinerary={handleCreateItinerary}/>
				</>
			)}
			{!openQuestionaire && (
				<>
					<Grid container spacing={2} justifyContent="center">
						<Grid item xs={12} md={6}>
							<Paper variant="outlined" sx={{ p: 2 }}>
								<Typography variant="h5" align="center" gutterBottom>
									Upcoming Trips...
								</Typography>
								<Typography
									variant="subtitle1"
									align="center"
									color="textSecondary"
									sx={{ mb: 4 }}
								>
									You haven’t created anything yet.
								</Typography>
								<Box display="flex" justifyContent="center">
									<Button
										onClick={handleCreateItinerary}
										variant="contained"
										color="secondary"
									>
										CREATE
									</Button>
								</Box>
							</Paper>
						</Grid>
					</Grid>
					<Box mt={4} />
					<Grid container spacing={2} justifyContent="center">
						<Grid item xs={12} md={6}>
							<Paper variant="outlined" sx={{ p: 2 }}>
								<Typography variant="h5" align="center" gutterBottom>
									Past Trips
								</Typography>
								<Typography
									variant="subtitle1"
									align="center"
									color="textSecondary"
									sx={{ mb: 4 }}
								>
									No Past Trips Found!
								</Typography>
							</Paper>
						</Grid>
					</Grid>
					<Box mt={4} />
					<Grid container spacing={2} justifyContent="center">
						<Grid item xs={12} md={6}>
							<Paper variant="outlined" sx={{ p: 2 }}>
								<Typography variant="h5" align="center" gutterBottom>
									Manhattan Heat Map
								</Typography>
								<TaxiMap selectedPlace={null} />
							</Paper>
						</Grid>
					</Grid>
				</>
			)}
		</>
	);
};
