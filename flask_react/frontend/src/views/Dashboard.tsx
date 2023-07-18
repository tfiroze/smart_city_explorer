import React, { useState } from "react";
import { Header } from "../components/dashboard/Header";
import {
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Fade,
} from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CreateItinerary } from "./CreateItinerary";
import { AddCircleOutline as AddIcon } from "@mui/icons-material";
import { History as HistoryIcon } from "@mui/icons-material";
import IItinerary from "../models/IItinerary";
import Map from "../components/map/Map.js"

export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [openQuestionnaire, setOpenQuestionnaire] = useState(false);
  const [itineraryItems, setItineraryItems] = useState<IItinerary[]>([]);

  const handleCreateItinerary = () => setOpenQuestionnaire(!openQuestionnaire);

  const addItem = (item: IItinerary) => {
    setItineraryItems([...itineraryItems, item]);
    handleCreateItinerary();
  };

  return (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Header />
      </Grid>
      <Grid item xs={12} md={12} style={{ margin: "15px" }}>
        {openQuestionnaire && (
          <Fade in={openQuestionnaire}>
            <Box my={2}>
              <CreateItinerary
                handleCreateItinerary={handleCreateItinerary}
                addItem={addItem}
              />
            </Box>
          </Fade>
        )}

        {!openQuestionnaire && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" align="center" gutterBottom color="text.primary">
                Upcoming Trips...
              </Typography>
              {itineraryItems.length === 0 ? (
                <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                  You haven’t created anything yet.
                </Typography>
              ) : (
                itineraryItems.map((item, index) => (
                  <Paper key={index} style={{ marginBottom: "10px", padding: "10px" }} elevation={3}>
                    <Typography variant="subtitle1">
                      Name: {item.name}<br />
                      Date: {item.date}<br />
                      Time From: {item.startTime}<br />
                      Time To: {item.endTime}<br />
                      Comments: {item.comments}<br />
                    </Typography>
                  </Paper>
                ))
              )}

              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  onClick={handleCreateItinerary}
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                >
                  CREATE
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h5" align="center" gutterBottom color="text.primary">
                  Past Trips
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                  No Past Trips Found!
                </Typography>
                <Box display="flex" justifyContent="center">
                  <IconButton color="primary">
                    <HistoryIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
