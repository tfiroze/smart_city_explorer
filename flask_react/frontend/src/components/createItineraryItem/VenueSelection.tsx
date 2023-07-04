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
	Stepper,
	Step,
	StepLabel,
	Divider,
	Box,
    Button,
    StepContent,
} from "@mui/material";
import dataSetA from "../../temp/thingstodo_data/json/thingstodo.json";
import { useRef, useState } from "react";
import { UseTaxi } from "./UseTaxi";

const steps = [
	{
	  label: 'Select Template',
	  description: ``,
	},
	{
	  label: 'Edit Itinerary',
	  description:
		'',
	},
	{
	  label: 'Invite ',
	  description: ``,
	},
	{
		label: 'Invite ',
		description: ``,
	  },
  ];

export const VenueSelection = () => {
	const [expanded, setExpanded] = useState<string>("none");
	const [items, setItems] = useState<string[]>([]);
	const [useTaxi, setUseTaxi] = useState(false);
	const [activeStep, setActiveStep] = React.useState(0);

	const handleNext = () => {
	  setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};
  
	const handleBack = () => {
	  setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};
  
	const handleReset = () => {
	  setActiveStep(0);
	};

	
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
			<Box sx={{ maxWidth: 400 }}>
			<Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
				<Divider />
			</Box>
		</div>
	);
};
