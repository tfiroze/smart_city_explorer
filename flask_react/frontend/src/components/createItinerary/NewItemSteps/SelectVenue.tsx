import React, { useState } from "react";
import venueData from "../../../temp/dummy_data/venueData.json";
import { Autocomplete, Box, Button, Chip, Grid, TextField } from "@mui/material";
import Itinerary from "../../../models/IItinerary";

interface IProps {
	moveNext: () => void;
}

enum busynesLevel {
	low = "low",
	moderate = "moderate",
	high = "high",
}

const getColor = (level: busynesLevel) => {
	switch (level) {
		case busynesLevel.low:
			return "success";
		case busynesLevel.moderate:
			return "warning";
		case busynesLevel.high:
			return "error";
	}
};

export const SelectVenue: React.FC<IProps> = ({ moveNext }) => {
	const [selectedItem, setSelectedItem] = useState<string | null>();
	const [selectedCords, setSelectedCords] = useState<{lng:number,lat:number}>({ lat: 40.7758125, lng: -73.9748125 });
	const [cordsSetted, setCordsSetted] = useState(false);
	
	const setCords = (data:{lng:number,lat:number})=> {
		setSelectedCords(data)
		setCordsSetted(true)
	}
	let selectData = [
		...[
			{
				timeFrom: "",
				timeTo: "",
				imgLink: "",
				title: "",
				description: "",
				venueId: "HEADINGS",
				invited: 0,
				budget: 0,
				weatherCode: 0,
				busyness: "",
				rating: 0,
				lon:0,
				lat:0
			},
		],
		...venueData,
	];

	return (
		<div>
			<Autocomplete
				id="weather-select-demo"
				options={selectData}
				autoHighlight
				//@ts-ignore
				onChange={(e,v)=>{setCords({lng:v?.lon,lat:v?.lat})}}
				getOptionLabel={(option) => option.title}
				getOptionDisabled={(option) => option.venueId === "HEADINGS"}
				renderOption={(props, option) => (
					<Box
						component="li"
						sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
						{...props}
					>
						<Grid container>
							{option.venueId === "HEADINGS" ? (
								<>
									<Grid
										item
										xs={2}
										justifyContent="center"
										justifyItems="center"
										display="flex"
									>
										<strong>Busyness</strong>
									</Grid>
									<Grid
										item
										xs={1}
										justifyContent="center"
										justifyItems="center"
										display="flex"
									>
										<strong>Weather</strong>
									</Grid>
									<Grid
										item
										xs={2}
										justifyContent="center"
										justifyItems="center"
										display="flex"
									>
										<strong>Taxi Start</strong>
									</Grid>
									<Grid
										item
										xs={2}
										justifyContent="center"
										justifyItems="center"
										display="flex"
									>
										<strong>Taxi End</strong>
									</Grid>
									<Grid item xs={5}>
										<strong>Venue</strong>
									</Grid>
								</>
							) : (
								<>
									<Grid
										item
										xs={2}
										justifyContent="center"
										justifyItems="center"
										display="flex"
									>
										<Chip
											label={option.busyness}
											variant="outlined"
											color={getColor(option.busyness as busynesLevel)}
											style={{ width: "100%" }}
										/>
									</Grid>
									<Grid
										item
										xs={1}
										justifyContent="center"
										justifyItems="center"
										display="flex"
									>
										<img
											loading="lazy"
											width="20"
											src={`https://www.meteosource.com/static/img/ico/weather/${option.weatherCode.toString()}.svg`}
											alt=""
										/>
									</Grid>
									<Grid
										item
										xs={2}
										justifyContent="center"
										justifyItems="center"
										display="flex"
									>
										1
									</Grid>
									<Grid
										item
										xs={2}
										justifyContent="center"
										justifyItems="center"
										display="flex"
									>
										5
									</Grid>
									<Grid item xs={5}>
										{option.title}
									</Grid>
								</>
							)}
						</Grid>
					</Box>
				)}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Choose a venue"
						inputProps={{
							...params.inputProps,
							autoComplete: "off",
						}}
					/>
				)}
			/>
			<Button variant='contained' style={{marginTop:'5px'}} onClick={moveNext}>Next</Button>
		</div>
	);
};
