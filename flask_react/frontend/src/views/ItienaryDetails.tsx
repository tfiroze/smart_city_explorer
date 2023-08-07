import React, { useContext, useEffect, useState } from "react";
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
  useTheme,
  AvatarGroup,
  Avatar,
  Theme
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
import manhattanDarkImage from '../resources/images/manhattan_dark.jpg';
import { toTitleCase } from "../utils/utility_func";
import { VenueCard } from "../components/common/venueCard";
import { Login } from "./Login";
import { FriendsModal } from "../components/dashboard/Friends";
import { VenueDetailsModal } from "../components/createItinerary/VenueDetailsModal";
import makeStyles from "@mui/styles/makeStyles/makeStyles";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
	  "& .MuiPaper-root": {
		backgroundColor: "transparent",
    boxShadow: '0 0 0 rgba(0, 0, 0, 0.3)',
	  }
	}
  }));

export const ItineraryDetails = () => {

  const [openFriendsModal, setOpenFriendsModal] = useState<boolean>(false);
  const [openItienaryDetailsModal, setOpenItienaryDetailsModal] = useState<boolean>(false);


  const classes = useStyles();

  useEffect(() => {

  }, [])


  const handleCreateItinerary = () => {
    navigate('/createItinerary')
  }

  const handleFriendsModal = () => setOpenFriendsModal(!openFriendsModal)
  const handItienraryDetailsModal = () => {
    console.log('Called Details');
    setOpenItienaryDetailsModal(!openItienaryDetailsModal)
  }


  const currentTheme = useTheme();
  const navigate = useNavigate();

  return (
    <>
      <Dialog
        open={openFriendsModal}
        onClose={handleFriendsModal}
        maxWidth="sm"
        fullWidth
      >
        <FriendsModal />
      </Dialog>

      <Dialog
        open={openItienaryDetailsModal}
        onClose={handItienraryDetailsModal}
        maxWidth="md"
        fullWidth
        className={classes.root}
      >
        {/* <VenueDetailsModal /> */}
      </Dialog>
      <Grid container style={{ backgroundColor: '#ffff', height: '100vh' }}>
        <Grid container xs={12} style={{ height: '10vh', }}>
          <Header />
        </Grid>
        <Grid container xs={12} style={{ position: 'relative', height: '90vh', }}>
          <Grid container xs={12} style={{ width: '100%', height: '100%', zIndex: 10, background: 'transparent' }}>
            <Grid item xs={5} style={{ background: 'transparent', alignItems: 'center', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
              <div style={{ width: '80%', padding: '10px', textAlign: 'center', background: 'white', borderRadius: '15px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div>MY TRIP MANHATTAN</div>
                <div>
                  <AvatarGroup max={4} onClick={() => handleFriendsModal()}>
                    <Avatar>M</Avatar>
                    <Avatar>A</Avatar>
                    <Avatar>N</Avatar>
                    <Avatar>I</Avatar>
                    <Avatar>S</Avatar>
                  </AvatarGroup>
                </div>
              </div>
              <Grid item xs={8} style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', background: 'transparent' }}>
                <span style={{ width: '30px', height: '30px', borderRadius: '30px', background: 'black', margin: '1px' }}></span>
                <VenueCard detailsModalClick={handItienraryDetailsModal} />
                <span style={{ width: '30px', height: '30px', borderRadius: '10px', background: 'black', margin: '1px' }}></span>
              </Grid>
            </Grid>
          </Grid>

          <Grid xs={12} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}>
            <MapContainer
              style={{ height: "100%", width: "100%" }}
              zoom={12}
              center={[40.782790, -74.055090]}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};



{/* <Grid container xs={6} style={{ padding: '15px', overflow:'scroll', height:'100%' }}>
          
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
                  <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin:'10px 0px' }}>
                    <div style={{
                      width: '20%',
                      padding: '8px',
                      cursor: 'pointer',
                      backgroundColor: tab == 0 ? '#757de8' : 'transparent',
                      border: tab == 0? '2px solid transparent' : '2px solid #757de8',
                      marginRight:'20px',
                      textAlign:'center',
                      borderRadius:'20px',
                      color: tab == 0 ? '#ffff': '#757de8'
                    }}
                      onClick={() => setTab(0)}>
                      Upcoming
                    </div>
                    <div style={{
                      width: '20%',
                      padding: '8px',
                      cursor: 'pointer',
                      backgroundColor: tab == 1 ? '#757de8' : 'transparent',
                      border: tab == 1? '2px solid transparent' : '2px solid #757de8',
                      textAlign:'center',
                      borderRadius:'20px',
                      color: tab == 1 ? '#ffff': '#757de8'
                    }}
                      onClick={() => setTab(1)}>
                      Completed
                    </div>
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
                  {thingsTodo.slice(0, 3).map((item, index) => {
                  return (
                    <Grid
                      style={{ cursor: "pointer", padding: '15px', width: '35%', backgroundColor:currentTheme?.palette?.secondary?.main, marginRight:'5px', borderRadius:'10px' }}
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
                Explore Popular Destination
              </Typography>
              <Grid direction="row" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
                {thingsTodo.slice(0, 3).map((item, index) => {
                  return (
                    <Grid
                      style={{ cursor: "pointer", padding: '15px', width: '35%', backgroundColor:currentTheme?.palette?.secondary?.main, marginRight:'5px', borderRadius:'10px' }}
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
        </Grid> */}