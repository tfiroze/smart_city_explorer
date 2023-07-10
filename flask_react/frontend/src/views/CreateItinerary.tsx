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
import { VenueSelection } from "../components/createItinerary/VenueSelection";
import { Questionnaire } from "../components/createItinerary/Questionnaire";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { styled } from "@mui/system";

const steps = ["Trip Information", "Edit Itinerary", "Confirm"];

const CancelButton = styled(Button)`
  @media (max-width: 600px) {
    width: 100%;
    margin-top: 16px;
  }
`;

interface IProps {
  handleCreateItinerary: () => void;
}

export const CreateItinerary: React.FC<IProps> = ({ handleCreateItinerary }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const moveNextStep = () => setCurrentStep(currentStep + 1);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Questionnaire showVenues={moveNextStep} />;
      case 1:
        return <VenueSelection />;
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={1}>
        <Box m={1}>
          <CancelButton
            startIcon={<ArrowBackIosIcon />}
            onClick={handleCreateItinerary}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </CancelButton>
        </Box>
      </Grid>

      <Grid item xs={10} md={10}>
        <Paper elevation={3} sx={{ width: "100%", p: 2 }}>
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

      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        {renderStep()}
      </Grid>
    </Grid>
  );
};