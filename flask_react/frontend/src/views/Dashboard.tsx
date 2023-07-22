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
  Alert,
  Divider,
} from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CreateItinerary } from "./CreateItinerary";
import { AddCircleOutline as AddIcon, History as HistoryIcon } from "@mui/icons-material";
import IItinerary from "../models/IItinerary";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import EditNoteIcon from "@mui/icons-material/EditNote";

export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [openQuestionnaire, setOpenQuestionnaire] = useState(false);
  const [itineraryItems, setItineraryItems] = useState<IItinerary[]>([]);
  const [pastItems, setPastItineraryItems] = useState<IItinerary[]>([]);

  const handleCreateItinerary = () => setOpenQuestionnaire(!openQuestionnaire);

  const addItem = (item: IItinerary) => {
    setItineraryItems([...itineraryItems, item]);
    handleCreateItinerary();
  };

  const markAsCompleted = (itemIndex: number) => {
    const updatedItems = itineraryItems.filter((_, index) => index !== itemIndex);
    const completedItem = itineraryItems[itemIndex];
    setPastItineraryItems([...pastItems, completedItem]);
    setItineraryItems(updatedItems);
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
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                color="text.primary"
              >
                Upcoming Trips...
              </Typography>

              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  onClick={handleCreateItinerary}
                  variant="contained"
                  color="secondary"
                  style={{ marginBottom: "10px" }}
                  startIcon={<AddIcon />}
                >
                  CREATE
                </Button>
              </Box>
              {itineraryItems.length === 0 ? (
                <Typography
                  variant="subtitle1"
                  align="center"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  You haven’t created anything yet.
                </Typography>
              ) : (
                itineraryItems.map((item, index) => (
                  <Paper
                    key={index}
                    style={{ marginBottom: "10px", padding: "10px" }}
                    elevation={3}
                  >
                    <Grid container>
                      <Grid item xs={12}>
                        <Alert icon={<ModeOfTravelIcon />} severity="info">
                          {item.name}
                        </Alert>
                      </Grid>
                      <Grid item xs={12} display="flex" alignContent="center">
                        <Typography textAlign="center" variant="h5">
                          Note <EditNoteIcon />
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          {item.comments}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} display="flex" justifyContent="end">
                        <Button
                          variant="outlined"
                          color="info"
                          style={{ margin: "5px" }}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ margin: "5px" }}
                          onClick={() => markAsCompleted(index)}
                        >
                          Completed
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                ))
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                color="text.primary"
              >
                Past Trips
              </Typography>

              <Box display="flex" justifyContent="center">
                <IconButton color="secondary">
                  <HistoryIcon />
                </IconButton>
              </Box>
              {pastItems.length === 0 ? (
                <Typography
                  variant="subtitle1"
                  align="center"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  No Past Trips Found!
                </Typography>
              ) : (
                pastItems.map((item, index) => (
                  <Paper
                    key={index}
                    style={{ marginBottom: "10px", padding: "10px" }}
                    elevation={3}
                  >
                    <Grid container>
                      <Grid item xs={12}>
                        <Alert icon={<ModeOfTravelIcon />} severity="info">
                          {item.name}
                        </Alert>
                      </Grid>
                      <Grid item xs={12} display="flex" alignContent="center">
                        <Typography textAlign="center" variant="h5">
                          Note <EditNoteIcon />
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          {item.comments}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} display="flex" justifyContent="end">
                        <Button
                          variant="outlined"
                          color="info"
                          style={{ margin: "5px" }}
                        >
                          View
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                ))
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
