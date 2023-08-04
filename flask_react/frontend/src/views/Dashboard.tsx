import React, { useContext, useEffect, useState } from "react";
import AttractionsIcon from '@mui/icons-material/Attractions';
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
  styled,
  useTheme
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
import Slider from "../components/navigation/SliderNav"
import thingsTodoDummyData from "../temp/dummy_data/thingsTodo.json";
import manhattanDarkImage from '../resources/images/manhattan_dark.jpg';
import { toTitleCase } from "../utils/utility_func";
import Profile from "../components/profile/Profile"
import { ProfileDrawer } from "../components/navigation/ProfileDrawer";


export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [itineraryItems, setItineraryItems] = useState<IItinerary[]>([]);
  const [pastItems, setPastItineraryItems] = useState<IItinerary[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState<boolean>(false);
  const [dialogItineraryItem, setDialogItineraryItems] = useState<IItinerary | null>(null);

  const [firstTime, setFirstTime] = useState(false)

  const [thingsTodo, setThingsTodo] = useState<any[]>([]);

  const [tab, setTab] = useState(0)

  const currentTheme = useTheme();
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

  const handleCreateItinerary = () => {
    navigate('/createItinerary')
  }

  const handleClose = () => {
    setProfileDrawerOpen(false)
  }

  const handleProfileOpen = () => {
    setProfileDrawerOpen(true)
  }


  return (
    <>

      <ProfileDrawer open={profileDrawerOpen} handleClose={handleClose} />
      <Dialog open={dialogOpen} maxWidth='xl' fullWidth>
        <DialogTitle>{dialogItineraryItem?.name}</DialogTitle>
        <DialogContent>
          <ChoroplethMap data={dialogItineraryItem} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Grid container style={{ backgroundColor: '#ffff', height: '100vh' }}>
        <Grid container xs={6} style={{ padding: '15px', overflow: 'scroll', height: '100%' }}>
          <div style={{ width: '100%', height: '10%', marginBottom: '10px' }}>
            <Header />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '100%' }}>
            <Grid item xs={12} style={{
              backgroundPosition: 'center', // Center the background image
              backgroundSize: 'cover', // Ensure the image covers the entire container
              backgroundRepeat: 'no-repeat', // Prevent image repetition
              backgroundImage: `url(${manhattanDarkImage})`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: '10px',
              padding: '30px'
            }}>
              {firstTime && <>
                <Typography
                  variant="h5"
                  align="center"
                  color="#ffffff"
                  sx={{ mb: 4 }}
                  style={{ marginBottom: 0 }}
                >
                  Unleash the magic of <span style={{ color: "#FFC93A" }}>Manhattan</span> in just one day!
                </Typography>
                <Typography
                  variant="h6"
                  align="center"
                  color="#ffffff"
                  sx={{ mb: 4 }}
                  style={{ marginBottom: 0 }}
                >
                  Plan your perfect itinerary 🗽
                </Typography>
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    onClick={handleCreateItinerary}
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                  >
                    CREATE
                  </Button>
                </Box>
              </>}
            </Grid>

            {
              (itineraryItems?.length >= 0 && pastItems?.length >= 0) &&
              <>
                <Grid item xs={12} md={12} style={{ margin: "15px 0px" }}>
                  <Typography variant="h6" align="left">
                    My Manhattan Itinerary
                  </Typography>
                  <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '10px 0px' }}>
                    <div style={{
                      width: '20%',
                      padding: '8px',
                      cursor: 'pointer',
                      backgroundColor: tab == 0 ? '#757de8' : 'transparent',
                      border: tab == 0 ? '2px solid transparent' : '2px solid #757de8',
                      marginRight: '20px',
                      textAlign: 'center',
                      borderRadius: '20px',
                      color: tab == 0 ? '#ffff' : '#757de8'
                    }}
                      onClick={() => setTab(0)}>
                      Upcoming
                    </div>
                    <div style={{
                      width: '20%',
                      padding: '8px',
                      cursor: 'pointer',
                      backgroundColor: tab == 1 ? '#757de8' : 'transparent',
                      border: tab == 1 ? '2px solid transparent' : '2px solid #757de8',
                      textAlign: 'center',
                      borderRadius: '20px',
                      color: tab == 1 ? '#ffff' : '#757de8'
                    }}
                      onClick={() => setTab(1)}>
                      Completed
                    </div>
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
                    {thingsTodo.slice(0, 3).map((item, index) => {
                      return (
                        <Grid
                          style={{ cursor: "pointer", padding: '15px', width: '35%', backgroundColor: currentTheme?.palette?.secondary?.main, marginRight: '5px', borderRadius: '10px' }}
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
                            <Typography variant="subtitle2" fontWeight={600}>
                              {toTitleCase(item.venue_name)}
                            </Typography>
                          </Grid>

                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              </>
            }
            <div style={{ width: '100%' }}>
              <Typography variant="h6" align="left">
                Explore Popular Destinations
              </Typography>
              <Grid direction="row" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
                {thingsTodo.slice(0, 3).map((item, index) => {
                  return (
                    <Grid
                      style={{ cursor: "pointer", padding: '15px', width: '35%', backgroundColor: currentTheme?.palette?.secondary?.main, marginRight: '5px', borderRadius: '10px' }}
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
                        <Typography variant="subtitle2" fontWeight={600}>
                          {toTitleCase(item.venue_name)}
                        </Typography>
                      </Grid>

                    </Grid>
                  );
                })}
              </Grid>

            </div>
          </div>
        </Grid>
        <Grid container xs={6}>
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



