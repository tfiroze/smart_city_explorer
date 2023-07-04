import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	IconButton,
	DialogContentText,
	Button,
	DialogActions,
	Step,
	StepLabel,
	Stepper,
	Typography,
	Drawer,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { Questionnaire } from "../../views/Questionnaire";
import { VenueSelection } from "../createItineraryItem/VenueSelection";

interface IProps {
	open: boolean;
	onClose: () => void;
}

export const CreateItinerary: React.FC<IProps> = ({ open, onClose }) => {
	const [dialogOpen, setDialogOpen] = React.useState(false);

	const handleClickOpen = () => {
		setDialogOpen(true);
	};

	const handleClose = () => {
		setDialogOpen(false);
	};

	return (
		<>
			<Drawer open={open} onClose={onClose} anchor="right">
				<Questionnaire handleNextStep={handleClickOpen} />
			</Drawer>
			<Dialog
				fullScreen={false}
				fullWidth={true}
				open={dialogOpen}
				aria-labelledby="responsive-dialog-title"
			>
				<DialogTitle id="responsive-dialog-title">
					Select Itinary Template
				</DialogTitle>
				<DialogContent>
					<VenueSelection />
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleClose}>
						Disagree
					</Button>
					<Button onClick={handleClose} autoFocus>
						Agree
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
