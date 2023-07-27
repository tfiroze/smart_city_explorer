import React, { useState, FC } from "react";
import NavBar from '../components/dashboard/Navbar';
import { Header } from "../components/dashboard/Header";
import {
  Button,
  Grid,
  Typography,
  Box,
  IconButton,
  Fade,
  Alert,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Paper,
} from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CreateItinerary } from "./CreateItinerary";
import {
  AddCircleOutline as AddIcon,
  History as HistoryIcon,
  ModeOfTravel as ModeOfTravelIcon,
  EditNote as EditNoteIcon,
} from "@mui/icons-material";
import IItinerary from "../models/IItinerary";
import ChoroplethMap from "./MapTest";
import Choropleth from "../components/map/Choropleth";
import Map from 'react-map-gl';
import HeatMap from "../components/Heatmap";



const MAPBOX_TOKEN = 'pk.eyJ1IjoidGVlZG9nIiwiYSI6ImNsa2xmb3A5ZTA0eGIzZXM4eHkybWZuZ24ifQ.Nbo3BvZojkIzyBaZznTqvQ';


const PaperItem: FC<{ item: IItinerary, isUpcoming: boolean, viewItem: () => void, markAsCompleted: () => void }> = ({ item, isUpcoming, viewItem, markAsCompleted }) => (
  <Paper sx={{ mb: 2, p: 2 }} elevation={3}>
    <Grid container>
      <Grid item xs={12}>
        <Alert icon={<ModeOfTravelIcon />} severity="info">
          {item.name}
        </Alert>
      </Grid>
      <Grid item xs={12}>
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
      <Grid item xs={12}>
        <Box display="flex" justifyContent="end">
          <Button variant="outlined" color="info" sx={{ m: 1 }} onClick={viewItem}>
            View
          </Button>
          {isUpcoming && (
            <Button variant="contained" color="primary" sx={{ m: 1 }} onClick={markAsCompleted}>
              Completed
            </Button>
          )}
          <Choropleth />
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

export const Dashboard = () => {
  const heatmapData = [
    [-122.4194, 37.7749], // [longitude, latitude]
    [-122.4195, 37.7750],
    // Add more data points as needed
  ];

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [openQuestionnaire, setOpenQuestionnaire] = useState(false);
  const [itineraryItems, setItineraryItems] = useState<IItinerary[]>([]);
  const [pastItems, setPastItineraryItems] = useState<IItinerary[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogItineraryItem, setDialogItineraryItems] = useState<IItinerary | null>(null);
  const handleCreateItinerary = () => setOpenQuestionnaire(!openQuestionnaire);
  // const [maxZone, setMaxZone] = useState(""); // uhm 

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
    <>
      <NavBar />
      <Dialog open={dialogOpen} maxWidth='xl' fullWidth>
        <DialogTitle>{dialogItineraryItem?.name}</DialogTitle>
        <DialogContent>
          <ChoroplethMap data={dialogItineraryItem} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
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
                            onClick={() => {
                              setDialogOpen(true)
                              setDialogItineraryItems(item)
                            }
                            }
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
                          <Choropleth />
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
      <HeatMap />
    </>);
};
