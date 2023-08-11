// @ts-nocheck
import React, { useContext, useEffect, useRef, useState } from "react";
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
  useTheme,
  Theme,
} from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CreateItinerary } from "./CreateItinerary";
import { AddCircleOutline as AddIcon, History as HistoryIcon } from "@mui/icons-material";
import IItinerary from "../models/IItinerary";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ChoroplethMap from "./MapTest";
import Choropleth from "../components/map/Choropleth";
import { MapContainer, TileLayer, Popup, Marker, useMap, GeoJSON } from 'react-leaflet';
import thingsTodoDummyData from "../temp/dummy_data/thingsTodo.json";
import manhattanDarkImage from '../resources/images/manhattan_dark.jpg';
import grass from '../resources/images/grass.jpg'
import { toTitleCase } from "../utils/utility_func";
// import Profile from "../components/profile/Profile"
import { ProfileDrawer } from "../components/navigation/ProfileDrawer";
import { smartApi } from "../utils/apiCalls";
import { AuthContext } from "../utils/AuthContext";
import { Loader } from "../components/common/loader";
import { ErrorPage } from "./ErrorPage";
import { SmallCards } from "../components/dashboard/SmallCards";
import { VenueDetailsModal } from "../components/createItinerary/VenueDetailsModal";
import makeStyles from "@mui/styles/makeStyles/makeStyles";
import { TripNotFound } from "../components/common/tripNotFound";
import geoData from "../resources/Manhattan_Taxi_Zones.json"
import L, { divIcon } from "leaflet";


import { GeoJSON as LeafletGeoJSON } from "leaflet";
import dayjs from "dayjs";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& .MuiPaper-root": {
      backgroundColor: "transparent",
      boxShadow: '0 0 0 rgba(0, 0, 0, 0.3)',
    }
  }
}));
interface PopularPlaces {
  busyness: number,
  description: string,
  image: string,
  name: string,
  original_ven_id: string,
  rating: number
}

interface Geometry {
  type: string;
  coordinates: number[][][][];
}

interface Properties {
  shape_area: string;
  objectid: string;
  shape_leng: string;
  location_id: number;
  zone: string;
  borough: string;
}

interface Feature {
  type: string;
  properties: Properties;
  geometry: Geometry;
}

interface GeoJSONData {
  type: string;
  features: Feature[];
}



export const Dashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [upcomingTrips, setUpcomingTrips] = useState<IItinerary[]>([]);
  const [pastTrips, setPastTrips] = useState<IItinerary[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState<boolean>(false);
  const [dialogItineraryItem, setDialogItineraryItems] = useState<IItinerary | null>(null);
  const [popularPlacesArr, setPopularPlacesArr] = useState<Array<PopularPlaces>>([])
  const [openItienaryDetailsModal, setOpenItienaryDetailsModal] = useState<boolean>(false);
  const [venueDetails, setVenueDetails] = useState({})

  const [firstTime, setFirstTime] = useState(false)

  const [thingsTodo, setThingsTodo] = useState<any[]>([]);

  const [tab, setTab] = useState(0)

  const [loader, setLoader] = useState<boolean>(false)
  const [error, setError] = useState<string>("0")

  const currentTheme = useTheme();



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

  const getTripInfo = () => {
    setLoader(true)
    if (userInfo?.user_id) {
      smartApi.allTrips(userInfo.user_id)
        .then((results) => {
          console.log(results);
          setLoader(false)
          if (results?.valid) {
            setPastTrips([...results.completedTrips])
            setUpcomingTrips([...results.upcomingTrips])
            getPopularPlaces()

            if ((results.upcomingTrips.length > 0) && (results.completedTrips.length <= 0)) {
              setTab(1)
            } else if ((results.upcomingTrips.length <= 0) && (results.completedTrips.length > 0)) {
              setTab(0)
            } else {
              setTab(1)
            }
          } else {
            // ... handle the case when results?.valid is falsy ...
            setError(results.errorType)

          }
        })
        .catch((error) => {
          console.log(error);
          setError('2')
          setLoader(false)
        });
    }
  }

  const getPopularPlaces = () => {

    smartApi.popularPlaces()
      .then((results) => {
        setLoader(false)
        if (results?.valid && results?.places) {
          setPopularPlacesArr([...results.places])
        } else {
          // ... handle the case when results?.valid is falsy ...
          setError(results.errorType)
        }
      })
      .catch((error) => {
        console.log(error);
        setError('2')
        setLoader(false)
      });

  }

  useEffect(() => { getTripInfo() }, [])
  const handItienraryDetailsModal = () => {
    setOpenItienaryDetailsModal(!openItienaryDetailsModal)
  }

  const setVenueFullInfo = (venue: object) => {
    setVenueDetails({ ...venue })
    handItienraryDetailsModal()
  }

  const classes = useStyles();

  function getFillColorForZoneGroup(zoneGroup: string) {
    switch (zoneGroup) {
      case "Upper Manhattan":
        return "#0087E5";
      case "Lower Manhattan":
        return "#0089CF";
      case "Upper West Side":
        return "#68FBD0";
      case "Upper East Side":
        return "#008181";
      case "Chelsea/Greenwhich market":
        return "#FEFEDF";
      case "Midtown Manhattan":
        return "#BAB7EF";
      // Add more cases for other zone groups here
      default:
        return "#ABA9BB"; // Default color if no match is found
    }
  }

  let venue_zone_grouping = {
    "Upper Manhattan": [128, 127, 243, 120, 244, 116, 42, 152, 41, 74, 75],
    "Upper West Side": [166, 24, 151, 43, 238, 239, 143, 142],
    "Upper East Side": [236, 263, 262, 237, 141, 140],
    "Chelsea/Greenwhich market": [
      246,
      68,
      186,
      90,
      100,
      234,
      158,
      249,
      113,
      249
    ],
    "Lower Manhattan": [
      107,
      224,
      114,
      211,
      144,
      148,
      232,
      231,
      45,
      13,
      261,
      209,
      87,
      88,
      12
    ],
    "Midtown Manhattan": [
      50,
      48,
      230,
      163,
      161,
      162,
      229,
      233,
      164,
      170,
      137,
      224,
      107,
      234
    ]
  };

  const handleDetailsNavigation =(id: number)=>{
    smartApi.getItienaryDetails(userInfo.user_id)
        .then((results) => {
          console.log(results);
          setLoader(false)
          if (results?.valid) {
            setPastTrips([...results.completedTrips])
            setUpcomingTrips([...results.upcomingTrips])
            getPopularPlaces()

            if ((results.upcomingTrips.length > 0) && (results.completedTrips.length <= 0)) {
              setTab(1)
            } else if ((results.upcomingTrips.length <= 0) && (results.completedTrips.length > 0)) {
              setTab(0)
            } else {
              setTab(1)
            }
          } else {
            // ... handle the case when results?.valid is falsy ...
            setError(results.errorType)

          }
        })
        .catch((error) => {
          console.log(error);
          setError('2')
          setLoader(false)
        });
    navigate('/ItineraryDetails', { state: { id: id} })
  }


  return (
    <>
      {loader && true ? <Loader /> :
        error !== '0' ? <ErrorPage /> :
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

            <Dialog
              open={openItienaryDetailsModal}
              onClose={handItienraryDetailsModal}
              maxWidth="md"
              fullWidth
              className={classes.root}
            >
              <VenueDetailsModal venue={venueDetails} />
            </Dialog>

            <Grid container style={{ backgroundColor: '#ffff', height: '100vh' }}>
              <Grid container xs={6} style={{ padding: '15px', overflow: 'scroll', height: '100%' }}>
                <div style={{ width: '100%', height: '10%' }}>
                  <Header />
                </div>
                <Grid xs={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '100%' }}>
                  <Grid item xs={12} style={{
                    backgroundPosition: 'center', // Center the background image
                    backgroundSize: 'cover', // Ensure the image covers the entire container
                    backgroundRepeat: 'no-repeat', // Prevent image repetition
                    backgroundImage: `url(${manhattanDarkImage})`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    padding: '30px',
                    width: '100%',
                    height: '30vh'
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
                    (upcomingTrips?.length >= 0 || pastTrips?.length >= 0) &&
                    <>
                      <Grid item xs={12} md={12} style={{ margin: "15px 0px" }}>
                        <Typography variant="h6" align="left">
                          My Manhattan Itinerary
                        </Typography>
                        {(upcomingTrips?.length == 0 && pastTrips?.length == 0) ?
                          <>
                            <TripNotFound />

                          </>
                          : <>
                            <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '10px 0px' }}>
                              {upcomingTrips?.length > 0 && <div style={{
                                width: '20%',
                                padding: '8px',
                                cursor: 'pointer',
                                backgroundColor: tab == 1 ? '#757de8' : 'transparent',
                                border: tab == 1 ? '2px solid transparent' : '2px solid #757de8',
                                marginRight: '20px',
                                textAlign: 'center',
                                borderRadius: '20px',
                                color: tab == 1 ? '#ffff' : '#757de8'
                              }}
                                onClick={() => setTab(1)}>
                                Upcoming
                              </div>}
                              {pastTrips?.length > 0 && <div style={{
                                width: '20%',
                                padding: '8px',
                                cursor: 'pointer',
                                backgroundColor: tab == 0 ? '#757de8' : 'transparent',
                                border: tab == 0 ? '2px solid transparent' : '2px solid #757de8',
                                textAlign: 'center',
                                borderRadius: '20px',
                                color: tab == 0 ? '#ffff' : '#757de8'
                              }}
                                onClick={() => setTab(0)}>
                                Completed
                              </div>}
                            </Grid>
                            <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
                              {(pastTrips?.length > 0 && tab == 0) && pastTrips.slice(0, 3).map((item, index) => <>
                                <Grid
                                  style={{
                                    cursor: "pointer",
                                    padding: '15px',
                                    width: '35%',
                                    backgroundColor: currentTheme?.palette?.secondary?.main,
                                    marginRight: '5px',
                                    borderRadius: '10px',
                                    backgroundPosition: 'center', // Center the background image
                                    backgroundSize: 'cover', // Ensure the image covers the entire container
                                    backgroundRepeat: 'no-repeat', // Prevent image repetition
                                    backgroundImage: `url(${grass})`,
                                  }}
                                  item
                                  className="unselectable"
                                  onClick={() => onClick && onClick()}
                                >
                                  <Grid xs={12} style={{ backgroundColor: 'transparent' }}>
                                    <Typography variant="subtitle2" fontWeight={600} align="center" style={{ backgroundColor: 'transparent', color: 'black' }}>
                                      {toTitleCase(item.trip_name)}
                                    </Typography>
                                    <Typography variant="subtitle2" fontWeight={600} align="center" style={{ backgroundColor: 'transparent', color: 'black' }}>
                                      {dayjs(item.trip_date).format("YYYY-MM-DD")}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </>
                              )}
                              {(upcomingTrips?.length > 0 && tab == 1) && upcomingTrips.slice(0, 3).map((item:any, index:number) =>
                                <>
                                  <Grid
                                    key={item.trip_id}
                                    style={{
                                      cursor: "pointer",
                                      padding: '15px',
                                      width: '35%',
                                      backgroundColor: currentTheme?.palette?.secondary?.main,
                                      marginRight: '5px',
                                      borderRadius: '10px',
                                      backgroundPosition: 'top', // Center the background image
                                      backgroundSize: 'cover', // Ensure the image covers the entire container
                                      backgroundRepeat: 'no-repeat', // Prevent image repetition
                                      backgroundImage: `url(${grass})`,
                                    }}
                                    item
                                    className="unselectable"
                                    onClick={() => handleDetailsNavigation(item.trip_id)}
                                  >
                                    <Grid xs={12} style={{ backgroundColor: 'transparent' }}>
                                      <Typography variant="subtitle2" fontWeight={600} align="center" style={{ backgroundColor: 'transparent', color: 'black' }}>
                                        {toTitleCase(item.trip_name)}
                                      </Typography>
                                      <Typography variant="subtitle2" fontWeight={600} align="center" style={{ backgroundColor: 'transparent', color: 'black' }}>
                                        {dayjs(item.trip_date).format("YYYY-MM-DD")}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </>}
                      </Grid>
                    </>
                  }
                  {(popularPlacesArr && popularPlacesArr.length > 0) && <div style={{ width: '100%', padding: '10px 0px' }}>
                    <Typography variant="h6" align="left">
                      Explore Popular Destinations
                    </Typography>
                    <Grid direction="row" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
                      {popularPlacesArr.slice(0, 3).map((item, index) => <SmallCards venue={item} onClick={() => { setVenueFullInfo(item) }} />)}
                    </Grid>

                  </div>}
                </Grid>
              </Grid>
              <Grid container xs={6} style={{position:'relative'}}>
                <MapContainer
                  style={{ height: "100vh", width: "100%", borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' }}
                  zoom={12}
                  center={[40.7831, -73.9712]}
                  maxBoundsViscosity={1.0}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  dragging={false}
                  touchZoom={false}
                  doubleClickZoom={false}
                  boxZoom={false}
                  keyboard={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <GeoJSON
                    data={geoData}
                    onEachFeature={(feature, layer) => {
                      const zoneNumber = feature.properties.location_id;
                      for (const [zoneGroup, zoneNumbers] of Object.entries(
                        venue_zone_grouping
                      )) {
                        if (zoneNumbers.includes(zoneNumber)) {
                          // Assign a specific color based on the zone group
                          const popupContent = `<div>${zoneGroup}</div>`;

                          // Bind the popup content to the layer
                          layer.bindPopup(popupContent);
                        }
                      }
                      // Create a popup content using the zoneNumber or other properties you want to display
                    }}
                    style={(feature) => {
                      const zoneNumber = feature.properties.location_id; // Assuming someProperty holds the zone number
                      let fillColor = "#ABA9BB"; // Default color

                      // Loop through the zone_grouping object and check if the zone number is in any of the specified zones
                      for (const [zoneGroup, zoneNumbers] of Object.entries(
                        venue_zone_grouping
                      )) {
                        if (zoneNumbers.includes(zoneNumber)) {
                          // Assign a specific color based on the zone group
                          fillColor = getFillColorForZoneGroup(zoneGroup);
                          break; // Stop checking once a match is found
                        }
                      }
                      return {
                        fillColor,
                        color: "black",
                        weight: 0.8,
                        dashArray: "5, 5",
                        fillOpacity: 0.7
                      };
                    }}
                  />
                  
                </MapContainer>
                
              </Grid>
            </Grid>

          </>}


    </>
  );
};



