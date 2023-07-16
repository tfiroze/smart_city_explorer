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

export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [openQuestionnaire, setopenQuestionnaire] = useState(false);
  const [itineraryItems, setItineraryItems] = useState<IItinerary[]>([]);
  const handleCreateItinerary = () => setopenQuestionnaire(!openQuestionnaire);
  console.log(itineraryItems)
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
          <>
            <CreateItinerary
              handleCreateItinerary={handleCreateItinerary}
              addItem={addItem}
            />
          </>
        )}

        {!openQuestionnaire && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                color="text.primary"
              >
                Upcoming Trips...
              </Typography>
              {itineraryItems.length == 0 ? (
                <Typography
                  variant="subtitle1"
                  align="center"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  You haven’t created anything yet.
                </Typography>
              ) : (
                itineraryItems.map((item) => {
                  return (
                    <Paper style={{ marginBottom: '10px' }}>
                      name:{item.name}<br />
                      date:{item.date}<br />
                      timeFrom:{item.startTime}<br />
                      endFrom:{item.endTime}<br />
                      comments:{item.comments}<br />
                    </Paper>);
                })
              )}

              <Box display="flex" justifyContent="center">
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
            <Box mt={4} />
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, elevation: 5 }}>
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  color="text.primary"
                >
                  Past Trips
                </Typography>
                <Typography
                  variant="subtitle1"
                  align="center"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
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
    </Grid >
  );
};
