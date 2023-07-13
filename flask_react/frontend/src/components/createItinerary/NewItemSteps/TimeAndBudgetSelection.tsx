import { Button, Grid, Paper, TextField } from "@mui/material";
import React, { useState } from "react";
import {
	AddCircleOutline as AddIcon,
	ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { DesktopDatePicker, DesktopTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface IProps {
	moveNext: () => void;
}

export const TimeAndBudgetSelection: React.FC<IProps> = ({ moveNext }) => {
	const currentTime = new Date();
	const [date, setDate] = useState<Date | null>(currentTime);

	return (
		<Paper elevation={3} sx={{ p: 2 }}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							label="Date"
							type="date"
							value={date ? dayjs(date).format("YYYY-MM-DD") : ""}
							onChange={(e) => setDate(dayjs(e.target.value).toDate())}
							variant="outlined"
							fullWidth
							InputLabelProps={{ shrink: true }}
						/>
					</Grid>
					<Grid item xs={6}>
						<DesktopTimePicker
							label="Start Time"
							defaultValue={dayjs()}
							// value={startTime}
							// onChange={setStartTime}
						/>
					</Grid>
					<Grid item xs={6} container alignItems="flex-end" justifyContent="flex-start">
						<ArrowIcon sx={{ mt: 1 }} />
						<Grid item xs={5}>
							<DesktopTimePicker
								defaultValue={dayjs()}
								label="End Time"
								// value={endTime}
								// onChange={setEndTime}
							/>
						</Grid>
					</Grid>
				</Grid>
			</LocalizationProvider>
			<Button variant="contained" onClick={moveNext} color="secondary" sx={{ mt: 2 }}>
				Next
			</Button>
		</Paper>
	);
};
