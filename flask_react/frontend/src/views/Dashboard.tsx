import React, { useState } from "react";
import { Header } from "../components/dashboard/Header";
import { Button, Grid, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TaxiMap } from "../components/createItinerary/TaxiMap";

export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateItinerary = () => {
    navigate("/questionnaire");
  };

  return (
    <div>
      <Header />
      <Box mt={4} />
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Upcoming Trips...
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              color="textSecondary"
              sx={{ mb: 4 }}
            >
              You haven’t created anything yet.
            </Typography>
            <Box display="flex" justifyContent="center">
              <Button
                onClick={handleCreateItinerary}
                variant="contained"
                color="secondary"
              >
                CREATE
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box mt={4} />
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Past Trips
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              color="textSecondary"
              sx={{ mb: 4 }}
            >
              No Past Trips Found!
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box mt={4} />
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Manhattan Heat Map
            </Typography>
            <TaxiMap selectedPlace={null} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
