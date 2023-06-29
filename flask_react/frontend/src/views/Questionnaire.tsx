import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Container,
  styled,
} from "@mui/material";
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const venueTypes = [
  { id: 1, tag: "Tourist Attraction", venueType: "tourist_attraction" },
  { id: 2, tag: "Historical Landmark", venueType: "historical_landmark" },
  { id: 3, tag: "Scenic Spot", venueType: "scenic_spot" },
  // Add more venue types here
];

const QuestionnairePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
}));

const QuestionnaireTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const QuestionnaireButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

export const Questionnaire = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    setSelectedTags(value);
  };

  const filterVenuesByTags = () => {
    const selectedVenueTypes = venueTypes.filter((venue) =>
      selectedTags.includes(venue.tag)
    );
    // Use the selectedVenueTypes to filter the venues in your app
    console.log(selectedVenueTypes);
  };

  return (
    <Container maxWidth="sm">
      <QuestionnairePaper elevation={3}>
        <QuestionnaireTitle variant="h4" align="center">
          Plan a New Trip
        </QuestionnaireTitle>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            components={[
              'DesktopDatePicker',
              'TimePicker'
            ]}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <DemoItem label="Select Date">
                  <DesktopDatePicker defaultValue={dayjs()} />
                </DemoItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DemoItem label="Select Time">
                  <DesktopTimePicker defaultValue={dayjs()} />
                </DemoItem>
              </Grid>
              <Grid item xs={12}>
                <DemoItem label="Interests">
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={venueTypes.map((item) => item.tag)}
                    value={selectedTags}
                    onChange={handleTagChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select Categories"
                        placeholder="Tags"
                      />
                    )}
                  />
                </DemoItem>
              </Grid>
              <Grid item xs={12}>
                <Box textAlign="center">
                  <QuestionnaireButton
                    variant="contained"
                    color="primary"
                    onClick={filterVenuesByTags}
                  >
                    Generate Itinerary
                  </QuestionnaireButton>
                </Box>
              </Grid>
            </Grid>
          </DemoContainer>
        </LocalizationProvider>
      </QuestionnairePaper>
    </Container>
  );
};
