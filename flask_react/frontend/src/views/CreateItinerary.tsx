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
} from "@mui/material";
import VenueSelection from "../components/createItinerary/VenueSelection";
import { Questionnaire } from "../components/createItinerary/Questionnaire";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { styled } from "@mui/system";
import IVenueItem from "../models/IVenueItem";
import { ConfirmItineraryItems } from "../components/createItinerary/ConfirmItineraryItems";
import IItinerary from "../models/IItinerary";

const steps = ["Trip Information", "Edit Itinerary", "Confirm"];

const CancelButton = styled(Button)`
  @media (max-width: 600px) {
    width: 100%;
    margin-top: 16px;
  }
`;

const SmallCancelButton = styled(CancelButton)`
  padding: 6px;
  font-size: 14px;
`;

interface IProps {
  handleCreateItinerary: () => void;
  addItem: (item: IItinerary) => void;
}

export const CreateItinerary: React.FC<IProps> = ({ handleCreateItinerary, addItem }) => {
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
    plan: []
  });

  const finelize = (data: IVenueItem[]) => {
    setVenueItems(data)
    setCurrentStep(currentStep + 1)
    setItinerary({ ...itinerary, plan: data })
  }

  const moveNextStep = (data: IItinerary) => {
    setItinerary(data)
    setCurrentStep(currentStep + 1);
  }


  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Questionnaire showVenues={moveNextStep} />;
      case 1:
        return <VenueSelection moveNext={finelize} />;
      case 2:
        return <ConfirmItineraryItems completed={addItem} data={itinerary} />;
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={1}>
        <Box m={1}>
          <SmallCancelButton
            startIcon={<ArrowBackIosIcon />}
            onClick={handleCreateItinerary}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </SmallCancelButton>
        </Box>
      </Grid>

      <Grid item xs={10} md={10}>
        <Paper elevation={3} sx={{ width: "100%", p: 2 }}>
          <Stepper activeStep={currentStep} sx={{ mx: "auto" }}>
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
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        {renderStep()}
      </Grid>
    </Grid>
  );
};
