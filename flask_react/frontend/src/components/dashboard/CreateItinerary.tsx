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
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { VenueSelection } from "../createItinerary/VenueSelection";

interface IProps {
	open: boolean;
  // onClose: () => void;
}
const steps = ['Select Venue', 'Invite Friends','Leave a Note','Confirmation'];



export const CreateItinerary: React.FC<IProps> = ({ open }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const renderStep = () =>{
    switch(currentStep){
      case 0:return <VenueSelection/>
    }
  }

	return (
		<Dialog open={open} >
			<DialogTitle>
				<Grid
					container
					display="flex"
					justifyContent="center"
					alignItems="center"
				>
					<Grid item md={11}>
						Create Itinerary
					</Grid>
					{/* TODO - look at close */}
					<Grid item md={1}>
						<IconButton aria-label="close" color="primary">
							<CloseIcon />
						</IconButton>
					</Grid>
				</Grid>
			</DialogTitle>
			<Divider />
			<DialogContent>
      <Box sx={{ width: '100%' }}>
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
      <br/>
      {
        renderStep()
      }
    </Box>
			</DialogContent>
		</Dialog>
	);
};
