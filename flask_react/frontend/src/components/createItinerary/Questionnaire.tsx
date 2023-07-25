import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DesktopDatePicker, DesktopTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import StarIcon from "@mui/icons-material/Star";
import IItinerary from "../../models/IItinerary";
import zoneData from "../../temp/zone_Grouping.json";
import L from "leaflet";

const venueTypes = [
  {
    id: 1,
    tag: "Tourist Attraction",
    venueType: "tourist_attraction",
    venueTypes: ["Brooklyn Bridge", "Empire State Building"],
  },
  {
    id: 2,
    tag: "Historical Landmark",
    venueType: "historical_landmark",
    venueTypes: ["Empire State Building", "Central Park"],
  },
  {
    id: 3,
    tag: "Scenic Spot",
    venueType: "scenic_spot",
    venueTypes: ["Cherry Hill", "Strawberry field"],
  },
];

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-purple.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const QuestionnaireTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const QuestionnaireButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

interface IProps {
  updateItinerary: (data: IItinerary) => void;
  currentItinerary: IItinerary;
}

export const Questionnaire: React.FC<IProps> = ({ updateItinerary, currentItinerary }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [starsSelected, setStarsSelected] = useState<number>(0.0);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [selectedSubCategoryTags, setSelectedSubCategoryTags] = useState<string[]>([]);
  const [hovering, setHovering] = useState(false);
  const [budget, setBudget] = useState(0);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [groupedVenues, setGroupedVenues] = useState({});
  const [mapItems, setMapItems] = useState<any[]>([]);



  const changeTime = (time: Dayjs | null, type: "start" | "end" | "date") => {
    let date = "";
    let temp = currentItinerary;
    switch (type) {
      case "date":
        date = `${time?.year()} ${time?.month()} ${time?.day()}`;
        setDate(date);
        temp.date = date;
        break;
      case "start":
        date = `${time?.hour()} ${time?.minute()}`;
        setStartTime(date);
        temp.startTime = date;

        break;
      case "end":
        date = `${time?.hour()} ${time?.minute()}`;
        setEndTime(date);
        temp.endTime = date;

        break;
    }
    updateItinerary(temp)
  };

  const handleStarsSelectionChange = (event: React.ChangeEvent<any>) => {
    setStarsSelected(event.target.value);
  };

  const handleTagChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    let listOptions: string[] = [];
    let listSubSelectionOptions: string[] = [];
    venueTypes.forEach((item) => {
      if (value.indexOf(item.tag) > -1) {
        item.venueTypes.forEach((vt) => {
          if (listOptions.indexOf(vt) < 0) {
            listOptions.push(vt);
          }
        });
      }

    });

    setSubCategory([...listOptions]);
    if (listOptions.length > 0) {
      selectedSubCategoryTags.forEach((item) => {
        if (listOptions.indexOf(item) > -1) {
          listSubSelectionOptions.push(item);
        }
      });
    }

    setSelectedSubCategoryTags([...listSubSelectionOptions]);
    let tempCordLst: any[] = []
    zoneData.forEach(item => {
      if (value.indexOf(item.venue_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')) != -1) {
        tempCordLst.push(item)

      }
    });
    setMapItems([...tempCordLst])
    setSelectedTags(value);
  };

  const handleSubTagChange = (
    event: React.ChangeEvent<{}>,
    value: string[]
  ) => {
    setSelectedSubCategoryTags(value);
  };

  const filterVenuesByTags = () => {
    const selectedVenueTypes = venueTypes.filter((venue) =>
      selectedTags.includes(venue.tag)
    );
  };

  const interests = zoneData.filter((item) =>
    !item.venue_mod_type.includes('restaurants')
  ).map((item) =>
    item.venue_mod_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  );

  const restaurants = zoneData.filter((item) =>
    item.venue_mod_type.includes('restaurants')
  ).map((item) =>
    item.venue_mod_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  );

  // Group data
  const groupedOptions = [
    {
      title: 'Select Food Choice',
      options: Array.from(new Set(restaurants)),
    },
    {
      title: 'Interests',
      options: Array.from(new Set(interests)),
    },
  ];




  return (
    <>
      <Container maxWidth="sm">
        <Paper>
          <QuestionnaireTitle variant="h4" align="center">
            Trip Information
          </QuestionnaireTitle>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DesktopDatePicker", "TimePicker"]}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <DemoItem label="Select Date">
                    <DesktopDatePicker
                      onChange={(value) => changeTime(value, "date")}
                      defaultValue={dayjs()}
                    />
                  </DemoItem>
                </Grid>
                <Grid item xs={12}>
                  <DemoItem label="Interests">
                    <Autocomplete
                      multiple
                      id="tags-standard"
                      options={Array.from(new Set(zoneData.map((item) => (
                        item.venue_mod_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
                      ))))}
                      value={selectedTags}
                      onChange={handleTagChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Select Categories"
                          placeholder="Tags"
                        />
                      )}
                    />


                  </DemoItem>
                </Grid>
              </Grid>
            </DemoContainer>
          </LocalizationProvider>
        </Paper>
      </Container>
      <MapContainer
        style={{ height: "100vh", width: "100%" }}
        zoom={13}
        center={[40.7831, -73.9712]}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapItems?.map((item) => {
          let icon;
          switch (item.zone_group) {
            case "Upper West Side":
              icon = redIcon;
              break;
            case "Midtown Manhattan":
              icon = greenIcon;
              break;
            case "Upper East Side":
              icon = blueIcon;
              break;
            case "Chelsea/Greenwhich market":
              icon = yellowIcon;
              break;
            case "Upper Manhattan":
              icon = orangeIcon;
              break;
            default:
              icon = purpleIcon;
          }
          return (
            //@ts-ignore
            <Marker position={[item.latitude, item.longitude]} icon={icon} riseOnHover>
              <Popup>
                <Grid container display='flex' spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      {item.name}
                    </Typography>
                  </Grid>
                </Grid>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};
