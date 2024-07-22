import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {
  Dialog
} from "@mui/material";
import "leaflet/dist/leaflet.css";
import {
  Grid,
  Typography,
  Container,
  useTheme,
} from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import {
  DateCalendar,
} from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import L from "leaflet";

import { CButton } from "../common/button";
import { toTitleCase } from "../../utils/utility_func";
import zoneCords from "../../temp/zone_Grouping.json";
import tagMapping from "../../temp/tag_mapping";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";
import { MessagePopups } from "../common/messagePopups";
import { ErrorPage } from "../../views/ErrorPage";


const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const purpleIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});



let todayDate = new Date();

// Create a new Date object for tomorrow
let tomorrowDate = new Date(todayDate);
tomorrowDate.setDate(todayDate.getDate() + 1);

interface IProps {
  updateItinerary: (arg: object) => void;
  tags: string[];
  subCategory: string[];
  zoneGroup: string[];
  updateTags: (arg: string[]) => void;
  updateCusine: (arg: string[]) => void;
  updateZones: (arg: string[]) => void;
  selectedTags: string[]
  selectedSubCategoryTags: string[]
  selectedZones: string[]
}


export const Questionnaire: React.FC<IProps> = ({
  updateItinerary,
  tags,
  subCategory,
  zoneGroup,
  updateTags,
  updateCusine,
  updateZones,
  selectedTags,
  selectedSubCategoryTags,
  selectedZones
}) => {
  // const [tags, setTags] = useState<string[]>([]);
  // const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // const [subCategory, setSubCategory] = useState<string[]>([]);
  // const [selectedSubCategoryTags, setSelectedSubCategoryTags] = useState<string[]>([]);

  const [zoneGroupItems, setZoneGroupItems] = useState<any>([]);
  // const [zoneGroup, setZoneGroup] = useState<string[]>([]);
  // const [selectedZones, setSelectedZones] = useState<string[]>([])

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().add(1, 'day'));
  const [dateString, setDateString] = useState<string>(dayjs().add(1, 'day').format('YYYY-MM-DD'))

  const [selectedZoneItemToHiglight, setSelectedZoneItemToHiglight] = useState<string>("");

  const [oneButtonModal, setOneButtonModal] = useState<boolean>(false);
  const [oneButtonMessage, setOneButtonMessage] = useState<string>('');
  const [twoButtonModal, setTwoButtonModal] = useState<boolean>(false);

  const currentTheme = useTheme();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = getCookieValue("token");
  //   // token && questionnaire(token);
  //   console.log("Called the Question Page")
  // }, []);

  const handleChange =
    (panel: string) => {
      onZOneGroupClick(panel);
      setSelectedZoneItemToHiglight("");
    };

  // function getCookieValue(cookieName: string) {
  //   const cookies = document.cookie.split(";");
  //   for (const cookie of cookies) {
  //     const [name, value] = cookie.trim().split("=");
  //     if (name === cookieName) {
  //       return decodeURIComponent(value);
  //     }
  //   }
  //   return null; // Cookie not found
  // }

  // function questionnaire(token: string) {
  //   setIsLoading(true)
  //   setLoader(true)
  //   smartApi
  //     .getQuestionnaire(token)
  //     .then((results) => {
  //       setIsLoading(false)
  //       setLoader(false)
  //       if (results?.valid && results?.attraction_type && results?.cusine_type) {
  //         console.log(results)
  //         // setTags([...results.attraction_type]);
  //         // setZoneGroup([...results.zone_group]);
  //         // setSubCategory([...results?.cusine_type])
  //       } else {
  //         // ... handle the case when results?.valid is falsy ...
  //         setError(results.errorType)
  //       }
  //     })
  //     .catch((error) => {
  //       setError('2')
  //       setIsLoading(false)
  //     });
  // }


  const dateUpdate = (dateObject: Dayjs | null) => {

    if (dateObject) {
      setSelectedDate(dateObject)
      setDateString(dateObject.format('YYYY-MM-DD'))
    }
  };

  const toggleTags = (item: string) => {
    let tagArray = [...selectedTags];
    let index = tagArray.indexOf(item);
    if (index == -1) {
      if (tagArray.length == 4) {
        handleSelectionError('A maximum of four venue types can be chosen.')
      } else {
        tagArray.push(item);
      }
    } else {
      tagArray.splice(index, 1);
    }
    updateTags(tagArray);
  };

  const toggleCusine = (item: string) => {
    let tagArray = [...selectedSubCategoryTags];
    let index = tagArray.indexOf(item);
    if (index == -1) {
      if (tagArray.length == 2) {
        handleSelectionError('A maximum of two cusine types can be chosen.')
      } else {
        tagArray.push(item);
      }
    } else {
      tagArray.splice(index, 1);
    }
    updateCusine(tagArray);
  };



  const onZOneGroupClick = (item: string) => {
    let zoneArray = [...selectedZones];
    let index = zoneArray.indexOf(item);
    if (index == -1) {
      if (zoneArray.length == 2) {
        handleSelectionError('A maximum of two Zones can be chosen.')
      } else {
        zoneArray.push(item);
      }
    } else {
      zoneArray.splice(index, 1);
    }
    updateZones(zoneArray);
    const zoneGroupItems = zoneArray.flatMap((el) => zoneCords.filter((x) => x.zone_group === el));
    setZoneGroupItems([...zoneGroupItems]);
  };

  const handleGoBack = () => {
    handleTwoSelectionError('Are you sure you want to exit!')
  };

  const setErrorMessage = (message: string) => {
    setOneButtonMessage(message)
  }

  const handleOneButtonPopup = () => {
    setOneButtonModal(!oneButtonModal)
  }

  const handleSelectionError = (message: string) => {
    setErrorMessage(message)
    handleOneButtonPopup()
  }

  const handleTwoButtonPopup = () => {
    setTwoButtonModal(!twoButtonModal)
  }

  const handleTwoSelectionError = (message: string) => {
    setErrorMessage(message)
    handleTwoButtonPopup()
  }

  const handleExit = () => {
    navigate(-1)
  }

  const finishTripQuestionnaire = () => {
    if (selectedTags.length < 1) {
      handleSelectionError("Please Select atleast 1 Venue Tag")
    } else if (selectedSubCategoryTags.length < 2) {
      handleSelectionError("Please Select at least 2 Cusine Tags");
    } else if (selectedZones.length < 2) {
      handleSelectionError("Please Select at least 2 Zones");
    } else {
      submitOptions();
    }
  };

  function replaceSpacesWithUnderscores(inputString: string) {
    return inputString.replace(/ /g, '_');
  }

  function replaceUnderscoresWithSpaces(inputString: string) {
    return inputString.replace(/_/g, ' ');
  }


  const submitOptions = () => {
    let zoneGroupArr = [...selectedZones]
    let attractionsArr = [...selectedTags]
    let cusineArr = [...selectedSubCategoryTags]
    const request = {
      date: dateString,
      zoneGroup: zoneGroupArr.map(replaceSpacesWithUnderscores),
      attractions: attractionsArr.map(replaceSpacesWithUnderscores),
      restaurants: cusineArr.map(replaceSpacesWithUnderscores)
    }
    updateItinerary(request)
  }


  return (
    <>
      {
        <>
          <Dialog
            open={oneButtonModal}
            onClose={handleOneButtonPopup}
            maxWidth="sm"
            fullWidth
          >
            <MessagePopups totalButtons={1} message={oneButtonMessage} buttonText={'OK'} onFirstClick={handleOneButtonPopup} />
          </Dialog>
          <Dialog
            open={twoButtonModal}
            onClose={handleTwoButtonPopup}
            maxWidth="sm"
            fullWidth
          >
            <MessagePopups totalButtons={2} message={oneButtonMessage} buttonText={'OK'} onFirstClick={handleExit} onSecondClick={handleTwoButtonPopup} />
          </Dialog>

          <Grid container>
            <Grid
              item
              xs={6}
              style={{ overflow: "scroll", height: "90vh", padding: "10px" }}
            >
              <Container>
                <Grid
                  container
                  xs={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "10px 0px",
                  }}
                >
                  <span
                    onClick={() => { handleGoBack() }}
                    style={{ cursor: 'pointer', padding: '5px', border: '2px solid #757de8', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ArrowBackIosNewIcon sx={{ color: '#757de8' }} />
                  </span>
                  <Typography variant="h5" align="center" width={"80%"}>
                    Create Itinerary
                  </Typography>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateCalendar", "DateCalendar"]}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12}>
                        <DemoItem>
                          <Typography variant="h6" align="left">
                            Select Date
                          </Typography>
                          <DateCalendar
                            value={selectedDate}
                            onChange={(newValue) => dateUpdate(newValue)}
                            sx={{
                              backgroundColor: currentTheme.palette.secondary.main,
                              borderRadius: "15px",
                            }}
                            disablePast
                          />
                        </DemoItem>
                      </Grid>
                    </Grid>
                  </DemoContainer>
                </LocalizationProvider>

                <div style={{ width: "100%", marginTop: "20px" }}>
                  <Typography variant="h6" align="left">
                    Select Attraction Type
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    style={{ margin: "15px 0px", display: "flex", flexWrap: "wrap" }}
                  >
                    {tags?.map((el, ind) => (
                      <span
                        onClick={() => toggleTags(el)}
                        style={{
                          padding: "10px",
                          border: "2px solid",
                          borderColor: "#757de8",
                          marginRight: "15px",
                          marginBottom: "10px",
                          borderRadius: "25px",
                          cursor: "pointer",
                          backgroundColor:
                            selectedTags.indexOf(el) !== -1
                              ? "#757de8"
                              : "transparent",
                          color: selectedTags.indexOf(el) !== -1 ? "#fff" : "#757de8",
                        }}
                      >
                        {el}
                      </span>
                    ))}
                  </Grid>
                </div>
                <div style={{ width: "100%", marginTop: "20px" }}>
                  <Typography variant="h6" align="left">
                    Select Cuisine Type
                  </Typography>
                  <Grid item xs={12} style={{ margin: '15px 0px', display: 'flex', flexWrap: 'wrap' }}>
                    {subCategory?.map((el, ind) => (
                      <span
                        onClick={() => toggleCusine(el)}
                        style={{
                          padding: '10px',
                          border: '2px solid',
                          borderColor: '#757de8',
                          marginRight: '15px',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          marginBottom: '10px',
                          backgroundColor: selectedSubCategoryTags.indexOf(el) !== -1 ? '#757de8' : 'transparent',
                          color: selectedSubCategoryTags.indexOf(el) !== -1 ? '#fff' : '#757de8'
                        }}>
                        {el}
                      </span>
                    ))}
                  </Grid>
                </div>
                <div style={{ width: "100%", marginTop: "20px" }}>
                  <Typography variant="h6" align="left">
                    Select Zone Group
                  </Typography>
                  <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {zoneGroup?.map((item, index) =>
                      item !== "" &&
                      <Grid
                        style={{
                          cursor: "pointer",
                          padding: '15px',
                          width: '30%',
                          backgroundColor: currentTheme?.palette?.secondary?.main,
                          marginRight: '5px',
                          borderRadius: '10px',
                          marginBottom: '10px',

                        }}
                        item
                        className="unselectable"
                      >
                        <Grid xs={12}>
                          <Typography variant="subtitle2" align="center" fontWeight={600} style={{ background: currentTheme.palette.secondary.main, marginBottom: '10px' }}>
                            {toTitleCase(item)}
                          </Typography>
                        </Grid>
                        <Grid xs={12} style={{ display: 'flex', justifyContent: 'center', background: currentTheme.palette.secondary.main }}>
                          <CButton
                            title="Select"
                            onClick={() => handleChange(item)}
                            style={{
                              width: '45%',
                              background: 'transparent',
                              borderRadius: '20px',
                              padding: '10px',
                              fontWeight: 'bold',
                              height: '30px',
                              fontSize: '10px',
                              border: '1px solid #757de8',
                              backgroundColor:
                                selectedZones.indexOf(item) !== -1
                                  ? "#757de8"
                                  : "transparent",
                              color: selectedZones.indexOf(item) !== -1 ? "#fff" : "#757de8",
                            }}
                          />
                        </Grid>
                      </Grid>

                    )}
                  </Grid>
                </div>

                <div
                  style={{ width: "100%", justifyContent: "center", display: "flex" }}
                >
                  <CButton
                    title="Next"
                    onClick={() => finishTripQuestionnaire()}
                    style={{
                      width: "50%",
                      background: "#757de8",
                      color: "#ffffff",
                      borderRadius: "20px",
                      padding: "10px 30px",
                      fontWeight: "bold",
                    }}
                  />
                </div>
              </Container>
            </Grid>
            <Grid item xs={6}>
              <MapContainer
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
                boxZoom={false}
                dragging={false}
                style={{
                  height: "100%",
                  width: "100%",
                  borderTopLeftRadius: "30px",
                  borderBottomLeftRadius: "30px",
                }}
                className="markercluster-map"
                zoom={12}
                center={[40.7831, -73.9712]}
              >
                <TileLayer url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png" />

                {/* <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  /> */}
                {/* <MarkerClusterGroup> */}
                {zoneGroupItems
                  .filter((x: any) => {
                    let valid = false;
                    for (let [key, value] of Object.entries(tagMapping)) {
                      if (key == x.venue_type && selectedTags.includes(value))
                        valid = true;
                    }
                    return valid;
                  })
                  .map((item: any) => {
                    return (

                      <Marker
                        icon={
                          item.name === selectedZoneItemToHiglight
                            ? greenIcon
                            : purpleIcon
                        }
                        position={[item.latitude, item.longitude]}
                      >
                        <Popup>
                          {item.name} <br /> <strong>Rating:</strong>{item.rating}
                        </Popup>
                      </Marker>


                    );
                  })}
                {/* </MarkerClusterGroup> */}
              </MapContainer>
            </Grid>
          </Grid >

        </>}
    </>
  );
};
