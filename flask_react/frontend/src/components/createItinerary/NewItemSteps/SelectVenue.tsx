import React, { useState } from "react";
import venueData from "../../../temp/dummy_data/venueData.json";
import {
	Autocomplete,
	Box,
	Button,
	Chip,
	Grid,
	TextField,
} from "@mui/material";
import { busynessLevel, getColor } from "../../../models/busynessLevel";
import IVenueItem from "../../../models/IVenueItem";

interface IProps {
	moveNext: () => void;
	newItemDetails: IVenueItem;
	updateNewItem: (item: IVenueItem) => void;
}

export const SelectVenue: React.FC<IProps> = ({
	moveNext,
	newItemDetails,
	updateNewItem,
}) => {
	const [selectedItem, setSelectedItem] = useState<string | null>();

	const setVenue = (data: IVenueItem) => {
		let temp = newItemDetails;
		temp.imgLink = data.imgLink;
		temp.title = data.title;
		temp.description = data.description;
		temp.venueId = data.venueId;
		temp.weatherCode = data.weatherCode;
		temp.busyness = data.busyness;
		updateNewItem(temp);
	};

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
				lon: 0,
				lat: 0,
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
				onChange={(e, v) => {
					//@ts-ignore
					setVenue(v);
				}}
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
											color={getColor(option.busyness as busynessLevel)}
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
			<Button
				variant="contained"
				style={{ marginTop: "5px" }}
				onClick={moveNext}
			>
				Next
			</Button>
		</div>
	);
};
