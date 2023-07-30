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
import { DateCalendar, DesktopDatePicker, DesktopTimePicker, StaticDatePicker } from "@mui/x-date-pickers";
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

export const Questionnaire: React.FC<IProps> = ({ updateItinerary, currentItinerary }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSubCategoryTags, setSelectedSubCategoryTags] = useState<string[]>([]);
  const [mapItems, setMapItems] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState<Object>(dayjs().add(1, 'day'))


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

  const dateUpdate = (dateObject: object|null)=>{
    setSelectedDate(dateObject?dateObject:dayjs().add(1, 'day'))
  }

  const toggleTags = (item: string)=>{
    let tagArray = [...selectedTags]
    let index = tagArray.indexOf(item)
    if (index == -1){
      tagArray.push(item)
    }else{
      tagArray.splice(index, 1)
    }
    setSelectedTags(tagArray)
  }


  const toggleCusine = (item: string)=>{
    let tagArray = [...selectedSubCategoryTags]
    let index = tagArray.indexOf(item)
    if (index == -1){
      tagArray.push(item)
    }else{
      tagArray.splice(index, 1)
    }
    setSelectedSubCategoryTags(tagArray)
  }


  const finishTripQuestionnaire = ()=>{
    if (selectedTags.length < 3){
      alert('Please Select Atleast 3 tags!')
    }else if (selectedSubCategoryTags.length < 2){
      alert('Please Select Atleast 2 tags')
    }else if (Object.keys(selectedDate).length === 0){
      alert('Please Select a Date')
    }else{
      // Call the Api
      updateItinerary()
    }
  }

  return (
    <>
      <Grid container style={{ padding: '0px' }}>
        <Grid container xs={5} style={{ overflow: 'scroll', height: '92vh' }}>
          <Container maxWidth="sm">
          <Grid container xs = {12} style={{display:'flex',alignItems:'center', margin: '10px 0px'}}>
            <div style={{width: '50px', height:'50px', background:'red', borderRadius: '50px', marginRight:'10px'}}></div>
          <Typography variant="h5" align="left" color="text.secondary">
              Create Itienrary
            </Typography>
          </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateCalendar', 'DateCalendar']}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <DemoItem>
                    <Typography variant="h5" align="left" color="text.secondary">
                    Date
                  </Typography>
                      <DateCalendar 
                      value={selectedDate}
                      onChange={(newValue) => dateUpdate(newValue)} 
                      />
                    </DemoItem>
                  </Grid>
                </Grid>
              </DemoContainer>

            </LocalizationProvider>
            <Typography variant="h5" align="left" color="text.secondary">
              Attraction Type
            </Typography>
            <Grid item xs={12} style={{ margin: '15px 0px', display:'flex', flexWrap:'wrap'}}>
              {venueTypes?.map((el,ind)=>(
                  <span 
                  onClick={()=>toggleTags(el.tag)}
                  style={selectedTags.indexOf(el.tag) !== -1 ? {padding:'10px', border:'2px solid red', marginRight:'15px', borderRadius:'10px', cursor:'pointer'}:
                  {padding:'10px', borderColor:'green', border:'2px solid', marginRight:'15px', borderRadius:'10px', cursor:'pointer'}
                  }>
                    {el.tag}
                  </span>
              ))}
            </Grid>
            <Typography variant="h5" align="left" color="text.secondary">
              Cusine Type
            </Typography>
            <Grid item xs={12} style={{ margin: '15px 0px' }}>
            {venueTypes?.map((el,ind)=>(
                  <span 
                  onClick={()=>toggleCusine(el.tag)}
                  style={selectedSubCategoryTags.indexOf(el.tag) !== -1 ? {padding:'10px', border:'2px solid red', marginRight:'15px', borderRadius:'10px', cursor:'pointer'}:
                  {padding:'10px', borderColor:'green', border:'2px solid', marginRight:'15px', borderRadius:'10px', cursor:'pointer'}
                  }>
                    {el.tag}
                  </span>
              ))}
            </Grid>
            <Typography variant="h5" align="left" color="text.secondary">
              Zone Group
            </Typography>
            <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {thingsTodoDummyData.slice(0, 5).map((item, index) => {
                return (
                  <Grid
                    style={{ cursor: "pointer", padding: '5px', width: '30%' }}
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
            <CButton
              title="Next"
              onClick={()=>finishTripQuestionnaire()}
              style={{
                width:'100%',
                background: '#FFFFFF',
                color: '#008080',
                borderRadius: '20px',
                padding: '10px 30px',
                fontWeight: 'bold',
                transition: '0.3s',
                '&:hover': {
                  background: '#008080',
                  color: '#FFFFFF'
                }
              }}
            />
          </Container>
        </Grid>
        <Grid container xs={7}>
          <MapContainer
            style={{ height: "92vh", width: "100%" }}
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
        </Grid>
      </Grid>
    </>
  );
};
