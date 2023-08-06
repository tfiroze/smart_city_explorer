import React, { useState, useEffect } from "react";
// import data from '../../temp/Manhattan_Taxi_Zones.geojson';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  CircleMarker,
  Tooltip,
  AttributionControl,
  Circle,
  CircleProps,
  CircleMarkerProps,

} from "react-leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  LinearProgress
} from "@mui/material";
import { Card, CardContent, CardMedia, CardActions } from "@mui/material";
// import MarkerClusterGroup from "../map/MarkerClusterGroup";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Container,
  styled,
  InputLabel,
  Rating,
  useTheme,
  Accordion,
  AccordionSummary,
  ListItem,
  List,
  Divider,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import {
  DateCalendar,
  DesktopDatePicker,
  DesktopTimePicker,
  StaticDatePicker,
} from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import StarIcon from "@mui/icons-material/Star";
import IItinerary from "../../models/IItinerary";
import zoneData from "../../temp/zone_Grouping.json";
import L from "leaflet";
import { DatePicker } from "@mui/lab";
import thingsTodoDummyData from "../../temp/dummy_data/thingsTodo.json";
import { CButton } from "../common/button";
import { toTitleCase } from "../../utils/utility_func";
import { smartApi } from "../../utils/apiCalls";
import zoneCords from "../../temp/zone_Grouping.json";
import tagMapping from "../../temp/tag_mapping";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const iconPerson = new L.Icon({
  iconUrl: "https://media.giphy.com/media/daxA5okS3H9gkpKpjR/giphy.gif",
  iconRetinaUrl: "https://media.giphy.com/media/f3dRSiajsz8DLmt0KS/giphy.gif",
  iconSize: new L.Point(60, 75),
  className: "leaflet-div-icon",
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "marker-cluster-custom",
    iconSize: L.point(40, 40, true),
  });
};

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 15,
  boxShadow: theme.shadows[1],
  margin: theme.spacing(2),
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
}));

const StyledCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: "56.25%", // 16:9
});

const QuestionnaireTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const QuestionnaireButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

let todayDate = new Date();

// Create a new Date object for tomorrow
let tomorrowDate = new Date(todayDate);
tomorrowDate.setDate(todayDate.getDate() + 1);

interface IProps {
  updateItinerary: () => void;
  currentItinerary: IItinerary;
}


export const Questionnaire: React.FC<IProps> = ({
  updateItinerary,
  currentItinerary,
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [selectedSubCategoryTags, setSelectedSubCategoryTags] = useState<
    string[]
  >([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [zoneGroupItems, setZoneGroupItems] = useState<any>([]);
  const [zoneGroup, setZoneGroup] = useState<string[]>([]);
  const [mapItems, setMapItems] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Object>(
    dayjs().add(1, "day")
  );
  const [expanded, setExpanded] = React.useState<string | false>("panel1");
  const restaurants = zoneCords.filter((item) =>
    item.venue_type.toLowerCase().includes("restaurant")
  );
  const Attractions = zoneCords.filter(
    (item) => !item.venue_type.toLowerCase().includes("restaurant")
  );
  const [isLoading, setIsLoading] = useState(true)
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
      onZOneGroupClick(panel);
      setSelectedZoneItemToHiglight("");
    };

  const [selectedZoneItemToHiglight, setSelectedZoneItemToHiglight] =
    useState<string>("");
  useEffect(() => {
    const token = getCookieValue("token");
    token && questionnaire(token);
  }, []);

  function getCookieValue(cookieName: string) {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === cookieName) {
        return decodeURIComponent(value);
      }
    }
    return null; // Cookie not found
  }

  function questionnaire(token: string) {
    setIsLoading(true)
    smartApi
      .getQuestionnaire(token)
      .then((results) => {
        console.log(results);
        setIsLoading(false)
        if (results?.valid) {
          let restaurantTags = [];
          let attractionTags = [];
          setTags([...results.attraction_type]);
          setZoneGroup([...results.zone_group]);
          // setSelectedSubCategoryTags
          for (let item of results.attraction_type) {
            if (item.toLowerCase().includes("restaurant")) {
              restaurantTags.push(item);
            } else {
              attractionTags.push(item);
            }
          }

          // Use the separated arrays
          setTags([...attractionTags]);
          // setRestaurantTags([...restaurantTags]);
          console.log("ZONE GROUPS", results.zone_group);
          setZoneGroup([...results.zone_group]);
        } else {
          // ... handle the case when results?.valid is falsy ...
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false)
      });
  }

  const handleSubTagChange = (
    event: React.ChangeEvent<{}>,
    value: string[]
  ) => {
    setSelectedSubCategoryTags(value);
  };

  const dateUpdate = (dateObject: object | null) => {
    setSelectedDate(dateObject ? dateObject : dayjs().add(1, "day"));
  };

  const toggleTags = (item: string) => {
    let tagArray = [...selectedTags];
    let index = tagArray.indexOf(item);
    if (index == -1) {
      tagArray.push(item);
    } else {
      tagArray.splice(index, 1);
    }
    setSelectedTags(tagArray);
  };

  const toggleCusine = (item: string) => {
    let tagArray = [...selectedSubCategoryTags];
    let index = tagArray.indexOf(item);
    if (index == -1) {
      tagArray.push(item);
    } else {
      tagArray.splice(index, 1);
    }
    setSelectedSubCategoryTags(tagArray);
  };

  const finishTripQuestionnaire = () => {
    if (selectedTags.length < 3) {
      alert("Please Select at least 3 tags");
    } else if (selectedSubCategoryTags.length < 2) {
      alert("Please Select at least 2 tags");
    } else if (Object.keys(selectedDate).length === 0) {
      alert("Please Select a Date");
    } else {
      // Call the Api
      updateItinerary();
    }
  };

  const onZOneGroupClick = (item: string) => {
    let zoneGroupItems = zoneCords.filter((x) => x.zone_group === item);
    setZoneGroupItems([...zoneGroupItems]);
  };

  const currentTheme = useTheme();

  return (
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
                    />
                  </DemoItem>
                </Grid>
              </Grid>
            </DemoContainer>
          </LocalizationProvider>
          <div>
            {isLoading && <LinearProgress color="success" />}
          </div>
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
            <Grid
              item
              xs={12}
              style={{ margin: "15px 0px", display: "flex", flexWrap: "wrap" }}
            ></Grid>
          </div>
          <div style={{ width: "100%", marginTop: "20px" }}>
            <Typography variant="h6" align="left">
              Select Zone Group
            </Typography>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
              >
                {zoneGroup?.map((item, index) => {
                  let zoneGroupItems = zoneCords
                    .filter((x) => {
                      let valid = false;
                      for (let [key, value] of Object.entries(tagMapping)) {
                        if (key == x.venue_type && selectedTags.includes(value))
                          valid = true;
                      }
                      return valid;
                    })
                    .filter((x) => x.zone_group === item);
                  return (
                    <Accordion
                      expanded={expanded === item}
                      onChange={handleChange(item)}
                      style={{ marginBottom: "10px", width: '100%' }}
                    >
                      <AccordionSummary
                        aria-controls="panel1d-content"
                        id="panel1d-header"
                        expandIcon={<ExpandMoreIcon />}
                      >
                        <Typography>
                          <FormControlLabel
                            value={item}
                            control={<Radio />}
                            label=""
                          />
                          {item}
                        </Typography>
                      </AccordionSummary>
                      <List style={{ cursor: "pointer" }}>
                        {zoneGroupItems.map((grp, index) => {
                          return (
                            <>
                              <ListItem
                                key={grp.name + index}
                                style={{
                                  backgroundColor:
                                    grp.name === selectedZoneItemToHiglight
                                      ? "#b8c0ff"
                                      : "",
                                }}
                                onClick={() =>
                                  setSelectedZoneItemToHiglight(grp.name)
                                }
                              >
                                {grp.name}
                              </ListItem>
                              <Divider />
                            </>
                          );
                        })}
                      </List>
                    </Accordion>
                  );
                })}
              </RadioGroup>
            </FormControl>
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
          style={{
            height: "90%",
            width: "90%",
            borderTopLeftRadius: "30px",
            borderBottomLeftRadius: "30px",
          }}
          className="markercluster-map"
          zoom={13}
          center={[40.7831, -73.9712]}
        >
          <TileLayer url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png" />
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
  );
};
