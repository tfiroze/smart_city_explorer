import React, { useContext, useEffect, useState } from "react";
import { Header } from "../components/dashboard/Header";
import { Button, Grid, Paper } from "@mui/material";
import { ItineraryList } from "../components/dashboard/ItineraryList";

export const Dashboard = () => {
	return (
		<div>
			<Header />
			<Grid container spacing={2} padding={1}>
				<Grid item md={10}>
					<ItineraryList />
				</Grid>
				<Grid item md={2}>
					<Grid container spacing={2} padding={1}>
						<Grid item md={12}>
							<Paper style={{ padding: "5px" }}>
								<Button variant="contained" fullWidth>
									CREATE
								</Button>
							</Paper>
						</Grid>
					</Grid>
					<Grid item md={12}>
						<Paper style={{ padding: "5px" }}>
							<img
								src="https://media.suthlbr.com/images/tabs/300/9532-1-1584655877.jpg"
								width="100%"
								height="100%"
							/>
						</Paper>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};
