import { Button, Grid, Paper, Typography } from "@mui/material";
import React from "react";

export const Itinerary = () => {
	return (
		<Paper style={{ marginBottom: "5px", padding: "5px" }}>
			<Grid container>
					<Grid item md={9}>
						<Typography>Place holder</Typography>
					</Grid>
					<Grid item md={3} >
						<Button style={{float:'right'}} variant="contained">View</Button>
					</Grid>
			</Grid>
		</Paper>
	);
};
