import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Autocomplete,
	TextField,
	Switch,
	FormControlLabel,
} from "@mui/material";
import dataSetA from "../../temp/thingstodo_data/json/thingstodo.json";
import { useState } from "react";
import { UseTaxi } from "./UseTaxi";

export const VenueSelection = () => {
	const [expanded, setExpanded] = useState<string>("none");
	const [items, setItems] = useState<string[]>([]);
	const [useTaxi, setUseTaxi] = useState(false);

	const handleChange = (panel: string) => () => {
		setExpanded(panel);
	};

	const getData = () => {
		let data: string[] = [];
		dataSetA.venues.forEach((item) => {
			data.push(item.venue_name);
		});
		setItems([...data]);
	};

	React.useEffect(() => {
		getData();
	}, []);

	const ChangeUseTaxi = () => setUseTaxi(!useTaxi);

	return (
		<div>
			<Typography variant="subtitle1">Select Location</Typography>
			<Accordion
				expanded={expanded === "RecommendVenuePanel"}
				onChange={handleChange("RecommendVenuePanel")}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography>Recommend Venue</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>Fo shizzle mah nizzle ( ͡° ͜ʖ ͡°)</Typography>
				</AccordionDetails>
			</Accordion>
			<Accordion
				expanded={expanded === "SelectVenuePanel"}
				onChange={handleChange("SelectVenuePanel")}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel2a-content"
					id="panel2a-header"
				>
					<Typography>Select Specific Venue</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Autocomplete
						disablePortal
						id="combo-box-demo"
						options={items}
						style={{ marginBottom: "15px" }}
						renderInput={(params) => <TextField {...params} label="Venue" />}
					/>
					<input type="datetime-local" style={{ marginBottom: "15px" }} />
				</AccordionDetails>
			</Accordion>
			<br />
			<FormControlLabel
				control={<Switch checked={useTaxi} onChange={ChangeUseTaxi} />}
				label="Need Taxi?"
        labelPlacement="start"
			/>
			{useTaxi && <UseTaxi />}
		</div>
	);
};
