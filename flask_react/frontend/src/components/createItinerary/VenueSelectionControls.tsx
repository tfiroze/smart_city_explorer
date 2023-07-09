import { Autocomplete, TextField, Alert, Button, Drawer, Grid, Paper, InputAdornment, Slider, Typography } from '@mui/material';
import React, { useState, ChangeEvent } from 'react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DatePicker, TimePicker } from '@mui/lab';
import { AddCircleOutline as AddIcon, ArrowForward as ArrowIcon, CreditScore as CreditScoreIcon } from '@mui/icons-material';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs from 'dayjs';

const data = [
	{
		timeFrom: "08:00",
		timeTo: "09:40",
		imgLink:
			"https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=695&q=80",
		title: "Times Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},
  {
		timeFrom: "13:45",
		timeTo: "15:00",
		imgLink:
			"https://images.unsplash.com/photo-1563818785891-5e953f985e29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=655&q=80",
		title: "The High Line",
		description:
			"The High Line is an elevated linear park built on a historic freight rail line. It offers a unique and scenic walkway with gardens, art installations, and stunning views of Manhattan's West Side.",
		venueId: "1357911",
		invited: 12,
		budget: 60.7,
	},
	{
		timeFrom: "10:00",
		timeTo: "11:40",
		imgLink:
			"https://images.unsplash.com/photo-1512872942423-e9877d94e902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
		title: "Central Park",
		description:
			"Central Park is an urban park in the middle of Manhattan. It is one of the most famous parks in the world and offers a wide range of recreational activities and attractions, including lakes, meadows, walking paths, and iconic landmarks.",
		venueId: "9876543",
		invited: 15,
		budget: 80.2,
	},
	{
		timeFrom: "12:00",
		timeTo: "13:30",
		imgLink:
			"https://images.unsplash.com/photo-1555109307-f7d9da25c244?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
		title: "Empire State Building",
		description:
			"The Empire State Building is a world-famous skyscraper located in Midtown Manhattan. It offers breathtaking views of the city from its observation decks and is a popular tourist attraction.",
		venueId: "246810",
		invited: 25,
		budget: 150.9,
	},


  {
		timeFrom: "22:00",
		timeTo: "22:40",
		imgLink:
			"https://images.unsplash.com/photo-1501503125584-bb1da5f56d48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
		title: "Grand Central Terminal",
		description:
			"Grand Central Terminal is a historic train station located in Midtown Manhattan. It is renowned for its stunning Beaux-Arts architecture, intricate details, and vibrant main concourse.",
		venueId: "2236067",
		invited: 24,
		budget: 135.2,
	},
	{
		timeFrom: "16:15",
		timeTo: "17:40",
		imgLink:
			"https://images.unsplash.com/photo-1590700928582-5389e4ded3cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
		title: "The Metropolitan Museum of Art",
		description:
			"The Metropolitan Museum of Art, often referred to as the Met, is one of the world's largest and most prestigious art museums. It houses an extensive collection spanning thousands of years and various cultures.",
		venueId: "271828",
		invited: 30,
		budget: 200.0,
	},
	{
		timeFrom: "18:00",
		timeTo: "19:40",
		imgLink:
			"https://images.unsplash.com/photo-1503572327579-b5c6afe5c5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=742&q=80",
		title: "Statue of Liberty",
		description:
			"The Statue of Liberty is a colossal neoclassical sculpture located on Liberty Island in New York Harbor. It is a symbol of freedom and democracy and has become one of the most iconic landmarks in the United States.",
		venueId: "1414213",
		invited: 22,
		budget: 120.5,
	},
	{
		timeFrom: "20:00",
		timeTo: "21:40",
		imgLink:
			"https://images.unsplash.com/photo-1602089266537-57cb22e5235b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=689&q=80",
		title: "Rockefeller Center",
		description:
			"Rockefeller Center is a complex of commercial buildings located in Midtown Manhattan. It is famous for its Art Deco architecture, ice skating rink, and the iconic Christmas tree during the holiday season.",
		venueId: "1123581",
		invited: 17,
		budget: 95.7,
	},

	{
		timeFrom: "23:00",
		timeTo: "00:00",
		imgLink:
			"https://images.unsplash.com/photo-1625358775317-a4f33370c520?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1155&q=80",
		title: "The Museum of Modern Art",
		description:
			"The Museum of Modern Art, also known as MoMA, is a renowned art museum located in Midtown Manhattan. It showcases a vast collection of modern and contemporary artworks from around the world.",
		venueId: "987654",
		invited: 16,
		budget: 75.8,
	},
  {
		timeFrom: "15:15",
		timeTo: "16:00",
		imgLink: 
			"https://images.unsplash.com/photo-1599854171059-d91f0fee45cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1610&q=80",
		title: "Brooklyn Bridge",
		description:
			"The Brooklyn Bridge is a famous landmark that connects Manhattan to Brooklyn. It is a suspension bridge with pedestrian walkways, offering stunning views of the New York City skyline and the East River.",
		venueId: "3141592",
		invited: 18,
		budget: 90.3,
	}
];

export const VenueSelectionControls = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const currentTime = new Date();
  const [date, setDate] = useState<Date | null>(currentTime);
  const [startTime, setStartTime] = useState<Date | null>(currentTime); // jaja sal moet verander na tye yarra yarra
  const [endTime, setEndTime] = useState<Date | null>(currentTime);
  const [note, setNote] = useState('');
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  // const [budgetRange, setBudgetRange] = useState<number[]>([0, 100]);
  const [minBudget, setMinBudget] = useState<number | ''>('');
  const [maxBudget, setMaxBudget] = useState<number | ''>('');

  const changeDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDateChange = (value: Date | null) => { // wil die link aan die dag van die trip
    setDate(value);
  };

  const handleStartTimeChange = (value: Date | null) => {
    setStartTime(value);
  };

  const handleEndTimeChange = (value: Date | null) => {
    setEndTime(value);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    setSelectedTitle(value);
  };

  const handleExpandClick = () => {
    setExpanded(true);
  };
  const handleMinBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const minBudgetValue = Math.max(value, Math.min(...data.map((item) => item.budget)));
    setMinBudget(minBudgetValue || '');
  };

  const handleMaxBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const maxBudgetValue = Math.min(value, Math.max(...data.map((item) => item.budget)));
    setMaxBudget(maxBudgetValue || '');
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Perform form submission logic here
    console.log('Form submitted:', date, startTime, endTime, note, selectedTitle, minBudget, maxBudget);
  };

  

  

  

  return (
    <>
      <Drawer anchor="right" open={open} onClose={changeDrawerOpen} PaperProps={{ style: { width: 300 } }}>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12}>
            <Alert severity="info">Venue Planner Controls</Alert>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={handleFormSubmit}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={handleDateChange}
                  renderInput={(props: any) => <TextField {...props} variant="outlined" />}
                />
              </LocalizationProvider>
            </form>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="flex-start" alignItems="center">
              <Grid item>
                <TextField
                  label="Start Time"
                  value={startTime ? dayjs(startTime).format('HH:mm') : ''}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item>
                <ArrowIcon />
              </Grid>
              <Grid item>
                <TextField
                  label="End Time"
                  value={endTime ? dayjs(endTime).format('HH:mm') : ''}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item>
                <CreditScoreIcon />
              </Grid>
              <Grid item>
                <TextField
                  label="Min Budget"
                  value={minBudget}
                  onChange={handleMinBudgetChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item>-</Grid>
              <Grid item>
                <TextField
                  label="Max Budget"
                  value={maxBudget}
                  onChange={handleMaxBudgetChange}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={data.map((item) => item.title)}
              getOptionLabel={(option) => option}
              value={selectedTitle}
              onChange={handleTitleChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Venue"
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // Disable autocomplete to prevent browser suggestions
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Enter notes"
              value={note}
              onChange={handleNoteChange}
              variant="outlined"
              fullWidth
              multiline={expanded} // Set multiline based on expanded state
              rows={expanded ? 4 : 1} // Set the number of rows based on expanded state
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AddIcon onClick={handleExpandClick} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              Add Item
            </Button>
          </Grid>
        </Grid>
      </Drawer>
      <Paper>
        <Grid container spacing={2} justifyContent="center" alignItems="center" p={2}>
          <Grid item xs={12}>
            <Alert severity="info">Venue Planner Controls</Alert>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button onClick={changeDrawerOpen} variant="contained">
              Add New Item
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="contained" color="secondary">
              Batch Edit Times
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};