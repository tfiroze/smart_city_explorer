import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  styled
} from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CreateItinerary } from "./CreateItinerary";
import { AddCircleOutline as AddIcon, History as HistoryIcon } from "@mui/icons-material";
import IItinerary from "../models/IItinerary";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ChoroplethMap from "./MapTest";
import Choropleth from "../components/map/Choropleth";
import { MapContainer, TileLayer, Popup, Marker, useMap } from 'react-leaflet';

import thingsTodoDummyData from "../temp/dummy_data/thingsTodo.json";



export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [itineraryItems, setItineraryItems] = useState<IItinerary[]>([]);
  const [pastItems, setPastItineraryItems] = useState<IItinerary[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogItineraryItem, setDialogItineraryItems] = useState<IItinerary | null>(null);

  const [firstTime, setFirstTime] = useState(false)

  const [thingsTodo, setThingsTodo] = useState<any[]>([]);

  const [tab, setTab] = useState(0)



  const markAsCompleted = (itemIndex: number) => {
    const updatedItems = itineraryItems.filter((_, index) => index !== itemIndex);
    const completedItem = itineraryItems[itemIndex];
    setPastItineraryItems([...pastItems, completedItem]);
    setItineraryItems(updatedItems);
  };

  useEffect(() => {
    firstTimeUser()
    setThingsTodo([...thingsTodoDummyData]);
  }, [])
  const firstTimeUser = () => {
    setFirstTime(true)
  }

  const handleCreateItinerary =()=>{
    navigate('/createItinerary')
  }

  return (
    <>
      {/* Questionnare Screen Start */}
      <Dialog open={dialogOpen} maxWidth='xl' fullWidth>
        <DialogTitle>{dialogItineraryItem?.name}</DialogTitle>
        <DialogContent>
          <ChoroplethMap data={dialogItineraryItem} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Questionair screen End  */}


      <Grid container style={{ backgroundColor: '#ffff' }}>
        <Grid container xs={5} style={{ padding: '15px' }}>
          <Grid item xs={12}>
            <Header />
          </Grid>
          <Grid item xs={12}>
            {firstTime && <>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                sx={{ mb: 4 }}
                style={{ marginBottom: 0 }}
              >
                Unleash the magic of Manhattan in just one day! Plan your perfect itinerary 🗽
              </Typography>
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
            </>}
          </Grid>
          {
            (itineraryItems?.length > 0 && pastItems?.length > 0) &&
          <>
            <Grid item xs={12} md={12} style={{ margin: "15px" }}>
            <Typography variant="h5" align="left" color="text.secondary">
            My Manhattan Itinerary!
            </Typography>
              <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '20%', padding: '10px', cursor: 'pointer', borderBottom: tab == 0 ? '2px solid #115b4c' : 'transparent' }} onClick={() => setTab(0)}>
                  Upcoming
                </div>
                <div style={{ width: '20%', padding: '10px', cursor: 'pointer', borderBottom: tab == 1 ? '2px solid #115b4c' : 'transparent' }} onClick={() => setTab(1)}>
                  Completed
                </div>
              </Grid>
              <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
                {thingsTodo.slice(0, 3).map((item, index) => {
                  return (
                    <Grid
                      style={{ cursor: "pointer", padding: '5px', width: '35%' }}
                      item
                      className="unselectable"
                    >
                      <Grid xs={12} >
                        <img
                          src="https://media.istockphoto.com/id/528725265/photo/central-park-aerial-view-manhattan-new-york.jpg?s=2048x2048&w=is&k=20&c=D1ec8s1coWVXA9JoMRfxT-zj0AW6T6b1fDlqftWllkU="
                          alt=""
                          style={{ width: '100%', borderRadius: '5px' }}
                        />
                      </Grid>
                      <Grid xs={12}>
                        <Typography variant="subtitle2">
                          {item.venue_name}
                        </Typography>
                      </Grid>

                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </>
          }
          <Grid item xs={12}>
            <Typography variant="h5" align="left" color="text.secondary">
              Explore Popular Destination!
            </Typography>
            <Grid direction="row" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
              {thingsTodo.slice(0, 3).map((item, index) => {
                return (
                  <Grid
                    style={{ cursor: "pointer", padding: '5px', width: '35%' }}
                    item
                    className="unselectable"
                  >
                    <Grid xs={12} >
                      <img
                        src="https://media.istockphoto.com/id/528725265/photo/central-park-aerial-view-manhattan-new-york.jpg?s=2048x2048&w=is&k=20&c=D1ec8s1coWVXA9JoMRfxT-zj0AW6T6b1fDlqftWllkU="
                        alt=""
                        style={{ width: '100%', borderRadius: '5px' }}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <Typography variant="subtitle2">
                        {item.venue_name}
                      </Typography>
                    </Grid>

                  </Grid>
                );
              })}
            </Grid>

          </Grid>
        </Grid>
        <Grid container xs={7} style={{ overflow: 'hidden' }}>
          <MapContainer
            style={{ height: "100vh", width: "100%", borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' }}
            zoom={13}
            center={[40.7831, -73.9712]}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </Grid>
      </Grid>
    </>
  );
};



