import {
  Box,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Drawer
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { Questionnaire } from "../../views/Questionnaire";

interface IProps {
	open: boolean;
   onClose: () => void;
}


export const CreateItinerary: React.FC<IProps> = ({ open,onClose }) => {
	return (
		<Drawer open={open}   onClose={onClose}      anchor='right'>
			<Questionnaire/>
		</Drawer>
	);
};
