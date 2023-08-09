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
import { VenueSelectionControls } from "../components/createItinerary/VenueSelectionControls";
import { Header } from "../components/dashboard/Header";
import { smartApi } from "../utils/apiCalls";

const steps = [
  "Trip Information",
  "Select Recommendations",
  "Itinerary Overview",
  "Itinerary Confirmation",
];

const StyledFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

interface IProps {
  // handleCreateItinerary: () => void;
  // addItem: (item: IItinerary) => void;
}

export const CreateItinerary: React.FC<IProps> = ({
  // handleCreateItinerary,
  // addItem,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [venueItems, setVenueItems] = useState<IVenueItem[]>([]);
  const [dialogItineraryItem, setDialogItineraryItems] = useState<IItinerary | null>(null);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState<boolean>(false);
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

  const updateItinerary = () => {
    console.log(currentStep);
    // handleGetRecommendation(request)
    setCurrentStep(currentStep + 1);
  };

  const handleGetRecommendation = (request: object) =>{
    console.log(request);
    
    smartApi.getRecommendation(request)
    .then((results) => {
      console.log(results);

      // if (results?.valid) {
      //   const d = new Date(tokenExpirationTime);
      //   d.setTime(d.getTime());
      //   let expires = d.toUTCString();

      //   setCookie("token", results.token, expires);
      //   authContext.authenticate(true, {
      //     first_name: results.firstname,
      //     surname: results.surname,
      //     user_id: results.user_id,
      //     email: results.email,
      //   });
      //   localStorage.setItem("user_id", results.user_id);
      //   localStorage.setItem("email", results.email);
      //   localStorage.setItem("first_name", results.firstname);
      //   localStorage.setItem("surname", results.surname);
      //   setError('0')
      //   setLoading(false)
      //   navigate("/dashboard");
      // } else {
      //   // ... handle the case when results?.valid is falsy ...
      //   setError(results.errorType)
      //   setLoading(false)
      // }
    })
    .catch((error) => {
      console.log(error);
      // setError('2')
      // setLoading(false)
    });
  }



  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Questionnaire updateItinerary={updateItinerary} currentItinerary={itinerary} />;
      case 1:
        return <PickRecommendation updateItinerary={updateItinerary} currentItinerary={itinerary} />;
      case 2:
        return <VenueSelection updateItinerary={updateItinerary} currentItinerary={itinerary} />;
      case 3:
        return <ConfirmItineraryItems
          // completed={addItem} 
          data={itinerary}
        />;
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // handleCreateItinerary();
    }
  };
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };


  return (
    <Grid container style={{ backgroundColor: '#ffff' }}>
      <Grid item xs={12} style={{ width: '100%', height: '10vh', display: 'flex', alignItems: 'center' }}>
        <Header activeStep={currentStep} steps={steps} />
      </Grid>
      <Grid item xs={12} style={{ padding: '0px' }}>
        {renderStep()}
      </Grid>
    </Grid>
  );
};
