import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// Representing Venue type data from BestTime.app yarra yarra
const venueTypes = [
  { id: 1, tag: "Restaurant", venueType: "restaurant" },
  { id: 2, tag: "Cafe", venueType: "cafe" },
  { id: 3, tag: "Bar", venueType: "bar" },
  // More venue types to be linked to data instead of adding manually
];

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
    <Paper
      style={{
        overflow: "scroll",
        maxHeight: "100vh",
        padding: "20px",
      }}
      elevation={3}
    >
      <Grid container style={{ position: "relative" }}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            align="center"
            color="textSecondary"
            gutterBottom
            style={{ marginBottom: "20px" }}
          >
            Plan a New Trip
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={[
                'DesktopDatePicker',
                'TimePicker'
              ]}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <DemoItem label="Select Date">
                    <DesktopDatePicker defaultValue={dayjs()} />
                  </DemoItem>
                </Grid>
                <Grid item xs={12} md={6}>
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={filterVenuesByTags}
                    >
                      Generate Itinerary
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Paper>
  );
};
