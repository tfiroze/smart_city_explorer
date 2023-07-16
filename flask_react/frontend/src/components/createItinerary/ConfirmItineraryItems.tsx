import React, { useState } from "react";
import IItinerary from "../../models/IItinerary";
import IVenueItem from "../../models/IVenueItem";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { styled } from "@mui/system";

const StyledPaper = styled(Paper)`
  width: 80%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  margin-top: 10px;
`;

const StyledButton = styled(Button)`
  margin-top: 16px;
  animation: wiggle 1s infinite;
  
  @keyframes wiggle {
    0% {
      transform: rotate(-2deg);
    }
    50% {
      transform: rotate(2deg);
    }
    100% {
      transform: rotate(-2deg);
    }
  }
`;

const StyledDisclaimer = styled(Typography)`
  font-size: 10px;
  transition: transform 0.3s ease-in-out;
  cursor: default;
  
  &:hover {
    transform: scale(1.2);
  }
`;

interface IProps {
  data: IItinerary;
  completed: (data: IItinerary) => void;
}

export const ConfirmItineraryItems: React.FC<IProps> = ({ data, completed }) => {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const handleFinish = () => {
    completed({
      ...data,
      comments: note,
      name: name,
    });
    alert("Congratulations! Your itinerary has been confirmed. Now get ready for an amazing adventure!");
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };

  return (
    <Grid container justifyContent="center" spacing={2}>
      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Confirm Itinerary
        </Typography>
        <Grid item xs={12}>
          <TextField label="Itinerary Name" fullWidth value={name} onChange={handleNameChange} />
        </Grid>
        <Grid item xs={12}>
          <StyledTextField
            id="filled-multiline-flexible"
            label="Notes (Optional)"
            multiline
            maxRows={4}
            variant="filled"
            fullWidth
            value={note}
            onChange={handleNoteChange}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledButton variant="contained" endIcon={<CheckCircleOutlineIcon />} onClick={handleFinish}>
            Finish Planning
          </StyledButton>
        </Grid>
        <StyledDisclaimer variant="body2" align="center" mt={2}>
          *Disclaimer: By clicking "Finish Planning," you agree to embark on this amazing adventure with a smile and a sense of humor. Bon voyage!
        </StyledDisclaimer>
      </StyledPaper>
    </Grid>
  );
};
