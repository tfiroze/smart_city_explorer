import { Button, Grid, Paper, TextField } from "@mui/material";
import React, { useState } from "react";

import {

	TimePicker,
} from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import IVenueItem from "../../../models/IVenueItem";

interface IProps {
	moveNext: () => void;
	newItemDetails: IVenueItem;
	updateNewItem: (item: IVenueItem) => void;
}

export const TimeSelection: React.FC<IProps> = ({
	moveNext,
	newItemDetails,
	updateNewItem,
}) => {
	const currentTime = new Date();
	const [startTime, setStartTime] = React.useState<any>(dayjs(currentTime));
	const [endTime, setEndTime] = React.useState<any>(dayjs(currentTime));

	const onChangeStartTime = (time: any) => {
		setStartTime(time);
		let temp = newItemDetails;
		temp.timeFrom = dayjs(time).format("HH:mm");
		updateNewItem(temp);
	};

	const onChangeEndTime = (time: any) => {
		setEndTime(time);
		let temp = newItemDetails;
		temp.timeTo = dayjs(time).format("HH:mm");
		updateNewItem(temp);
	};

	return (
		<Paper elevation={3} sx={{ p: 2 }}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DemoContainer components={["TimePicker", "TimePicker"]}>
					<TimePicker
						label="Start Time"
						value={startTime}
						onChange={(newValue) => onChangeStartTime(newValue)}
					/>
					<TimePicker
						label="End Time"
						value={endTime}
						onChange={(newValue) => onChangeEndTime(newValue)}
					/>
				</DemoContainer>
			</LocalizationProvider>
			<Button
				variant="contained"
				onClick={moveNext}
				color="secondary"
				sx={{ mt: 2 }}
			>
				Next
			</Button>
		</Paper>
	);
};
