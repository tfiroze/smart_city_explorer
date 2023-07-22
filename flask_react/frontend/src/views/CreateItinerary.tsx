import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Paper,
  Typography,
  Divider,
  styled,
  Fab,
  Tooltip,
} from "@mui/material";
import VenueSelection from "../components/createItinerary/VenueSelection";
import { Questionnaire } from "../components/createItinerary/Questionnaire";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IVenueItem from "../models/IVenueItem";
import { ConfirmItineraryItems } from "../components/createItinerary/ConfirmItineraryItems";
import IItinerary from "../models/IItinerary";
import { PickRecommendation } from "../components/createItinerary/PickRecommendation";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const steps = [
  "Trip Information",
  "Pick Recommendation",
  "Edit Itinerary",
  "Confirm",
];

const StyledFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

interface IProps {
  handleCreateItinerary: () => void;
  addItem: (item: IItinerary) => void;
}

export const CreateItinerary: React.FC<IProps> = ({
  handleCreateItinerary,
  addItem,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [venueItems, setVenueItems] = useState<IVenueItem[]>([]);
  const [itinerary, setItinerary] = useState<IItinerary>({
    budget: 0,
    comments: "",
    date: "",
    endTime: "",
    startTime: "",
    name: "",
    plan: [],
  });

  const finelize = (data: IVenueItem[]) => {
    setVenueItems(data);
    setCurrentStep(currentStep + 1);
    setItinerary({ ...itinerary, plan: data });
  };

  const updateItinerary = (data: IItinerary) => {
    setItinerary(data);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Questionnaire updateItinerary={updateItinerary} currentItinerary={itinerary} />;
      case 1:
        return <PickRecommendation />;
      case 2:
        return <VenueSelection moveNext={finelize} />;
      case 3:
        return <ConfirmItineraryItems completed={addItem} data={itinerary} />;
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      handleCreateItinerary();
    }
  };
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };


  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper elevation={3}>
            <Stepper activeStep={currentStep} sx={{ mx: "auto" }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={6}>
              <Button
                color="secondary"
                aria-label="Back"
                onClick={handleBack}
                startIcon={<ArrowBackIosIcon />}
                variant="contained"
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent="end">
              <Button
                color="secondary"
                aria-label="Back"
                onClick={handleNext}
                endIcon={<ArrowForwardIosIcon />}
                variant="contained"
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {renderStep()}
        </Grid>
      </Grid>
    </>
  );
};
