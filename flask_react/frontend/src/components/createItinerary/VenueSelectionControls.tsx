import {
	Autocomplete,
	TextField,
	Alert,
	Button,
	Drawer,
	Grid,
	Paper,
	InputAdornment,
	Step,
	StepLabel,
	Stepper,
} from "@mui/material";
import React, { useState, ChangeEvent } from "react";
import { TimeAndBudgetSelection } from "./NewItemSteps/TimeAndBudgetSelection";
import { SelectVenue } from "./NewItemSteps/SelectVenue";
import { InviteFriends } from "./NewItemSteps/InviteFriends";
import { ConfirmNewItem } from "./NewItemSteps/ConfirmNewItem";
import IItinerary from "../../models/IItinerary";
const steps = ["Time Selection", "Venue Selection", "Invites", "Confirm"];

interface IProps {
	open: boolean;
	changeOpenState: () => void;
	addItem:(item:IItinerary) =>void;
}

export const VenueSelectionControls: React.FC<IProps> = ({
	open,
	changeOpenState,
	addItem
}) => {
	const [itinerary, setItinerary] = useState<IItinerary>({
		budget: 0,
		description: "",
		imgLink: "",
		invited: 0,
		timeFrom: "",
		timeTo: "",
		title: "",
		venueId: "",
		conflictsWithPrevouse: false,
		invitedParticipant: []
	});

	const [currentStep, setCurrentStep] = useState(0);

	const hanldeMoveNext = () => {
		setCurrentStep(currentStep + 1);
	};

	const hanldeUpdate = (data: IItinerary) => {
		setItinerary(data);
	};

	const handleConfirm = () => {
		addItem(itinerary)
	}

	const renderStep = () => {
		switch (currentStep) {
			case 0:
				return (
					<TimeAndBudgetSelection
						moveNext={hanldeMoveNext}
						newItemDetails={itinerary}
						updateNewItem={hanldeUpdate}
					/>
				);
			case 1:
				return (
					<SelectVenue
						moveNext={hanldeMoveNext}
						newItemDetails={itinerary}
						updateNewItem={hanldeUpdate}
					/>
				);
			case 2:
				return (
					<InviteFriends
						moveNext={hanldeMoveNext}
						newItemDetails={itinerary}
						updateNewItem={hanldeUpdate}
					/>
				);
			case 3:
				return (
					<ConfirmNewItem
					onConfirm={handleConfirm}
						moveNext={hanldeMoveNext}
						newItemDetails={itinerary}
						updateNewItem={hanldeUpdate}
					/>
				);
			default:
				return null;
		}
	};
	return (
		<Drawer anchor="right" open={open} onClose={changeOpenState}>
			<Grid container spacing={2} p={2}>
				<Grid item xs={12}>
					<Alert severity="info">Venue Planner Controls</Alert>
				</Grid>
				<Paper elevation={3} sx={{ width: "100%", p: 2, marginTop: "15px" }}>
					<Stepper activeStep={currentStep}>
						{steps.map((label, index) => {
							const labelProps: {
								optional?: React.ReactNode;
								error?: boolean;
							} = {};
							return (
								<Step key={label}>
									<StepLabel {...labelProps}>{label}</StepLabel>
								</Step>
							);
						})}
					</Stepper>
				</Paper>
			</Grid>
			{renderStep()}
		</Drawer>
	);
};
