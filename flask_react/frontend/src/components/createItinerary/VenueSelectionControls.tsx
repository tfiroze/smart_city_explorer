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
	styled,
} from "@mui/material";
import React, { useState, ChangeEvent } from "react";
import { SelectVenue } from "./NewItemSteps/SelectVenue";
import { InviteFriends } from "./NewItemSteps/InviteFriends";
import { ConfirmNewItem } from "./NewItemSteps/ConfirmNewItem";
import IVenueItem from "../../models/IVenueItem";
import { TimeSelection } from "./NewItemSteps/TimeSelection";
// import IItinerary from "../../models/IItinerary";
const steps = ["Time Selection", "Venue Selection", "Invites", "Confirm"];

const StyledDrawer = styled(Drawer)(({ theme }) => ({
	"& .MuiDrawer-paper": {
		width: "100%",
		maxWidth: "400px",
		[theme.breakpoints.up("sm")]: {
			maxWidth: "600px",
		},
		[theme.breakpoints.up("md")]: {
			maxWidth: "800px",
		},
	},
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
	width: "100%",
	padding: theme.spacing(2),
	marginTop: theme.spacing(3),
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
	marginTop: theme.spacing(2),
}));

interface IProps {
	open: boolean;
	changeOpenState: () => void;
	addItem: (item: IVenueItem) => void;

	// updateItinerary: (data: IItinerary) => void;
	// currentItinerary: IItinerary;

}

export const VenueSelectionControls: React.FC<IProps> = ({
	open,
	changeOpenState,
	addItem,
}) => {
	const [itinerary, setItinerary] = useState<IVenueItem>({
		budget: 0,
		description: "",
		imgLink: "",
		invited: 0,
		timeFrom: "",
		timeTo: "",
		title: "",
		venueId: "",
		// conflictsWithPrevious: false,
		invitedParticipant: [],
		duration: 0,
		taxiFare: 0,
	});

	const [currentStep, setCurrentStep] = useState(0);

	const hanldeMoveNext = () => {
		setCurrentStep(currentStep + 1);
	};

	const hanldeUpdate = (data: IVenueItem) => {
		setItinerary(data);
	};

	const handleConfirm = () => {
		addItem(itinerary);
	};

	const renderStep = () => {
		switch (currentStep) {
			case 0:
				return (
					<TimeSelection
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
		<StyledDrawer anchor="right" open={open} onClose={changeOpenState}>
			<Grid container spacing={2} p={2}>
				<Grid item xs={12}>
					<Alert severity="info">Venue Planner Controls</Alert>
				</Grid>
				<StyledPaper elevation={3}>
					<StyledStepper activeStep={currentStep}>
						{steps.map((label, index) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</StyledStepper>
				</StyledPaper>
			</Grid>
			{renderStep()}
		</StyledDrawer>
	);
};
