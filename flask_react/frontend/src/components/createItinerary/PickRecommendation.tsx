import {
    Grid,
    Typography,
    Paper,
    Checkbox,
    Divider,
    Alert,
    styled,
    useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import thingsTodoDummyData from "../../temp/dummy_data/thingsTodo.json";
import shoppingDummyData from "../../temp/dummy_data/shoppingData.json";
import restaurantDummyData from "../../temp/dummy_data/restaurantData.json";
import { MapContainer, TileLayer, Popup, useMap, Marker } from "react-leaflet";
import { Map, LatLngLiteral, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { CButton } from "../common/button";
import IItinerary from "../../models/IItinerary";
import { VenueCard } from "../common/venueCard";

function MapUpdater() {
    const map = useMap();

    useEffect(() => {
        map.invalidateSize();
    }, [map]);

    return null;
}

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.spacing(2),
}));

const StyledHeading = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
}));

const StyledVenueName = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.pxToRem(18),
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
}));

interface IProps {
    currentItinerary: IItinerary;
    attractionName: string[];
    attractionValue: any[];
  }

export const PickRecommendation : React.FC<IProps> = ({  currentItinerary, attractionName, attractionValue }) => {
    const [attractionNameArr, setAttractionNameArr] = useState<string[]>([]);
    const [attractionValueArr, setAttractionValueArr] = useState<any[]>([]);

    useEffect(() => {
        setAttractionNameArr(attractionName)
        setAttractionValueArr(attractionValue);
    }, []);

    // const selectThingsTodo = (index: number) => {
    //     let tempData = thingsTodo;
    //     tempData[index].selected = !tempData[index].selected;
    //     setThingsTodo([...tempData]);
    // };

    // const selectShoppingTodo = (index: number) => {
    //     let tempData = shoppingTodo;
    //     tempData[index].selected = !tempData[index].selected;
    //     setShoppingTodo([...tempData]);
    // };

    // const selectResturantTodo = (index: number) => {
    //     let tempData = resturantTodo;
    //     tempData[index].selected = !tempData[index].selected;
    //     setResturantTodo([...tempData]);
    // };


    const currentTheme = useTheme();

    return (
        <>
            { attractionNameArr?.length>0 && attractionNameArr?.slice(0,3).map((el, index)=>(
                <Grid container style={{ marginTop: '20px', justifyContent: 'center' }}>
                <Grid item xs={12}>
                    <Typography variant="h6" align="center">
                        {el}
                    </Typography>
                </Grid>

                
                {attractionValueArr[index]?.slice(0, 3)?.map((item:any, index:number) => {
                    return (
                        <VenueCard venDetails = {item}/>
                    );
                })}
                
            </Grid>
            ))
            
            
            }

            <Grid xs={12} style={{justifyContent: 'center', display: 'flex' }}>
                <CButton
                    title="Next"
                    onClick={()=>{}}
                    style={{
                        width: '30%',
                        background: '#757de8',
                        color: '#ffffff',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        fontWeight: 'bold',
                        margin:'20px 0px'
                    }}
                />
            </Grid>
        </>
    );
};


{/* <Grid
style={{ cursor: "pointer", padding: '20px', borderRadius: '15px', margin: '10px', backgroundColor: currentTheme.palette.secondary.main }}
item
xs={12}
md={3}
onClick={() => {}}
// className="unselectable"
>
<StyledVenueName noWrap>{item}</StyledVenueName>
<Grid xs={12} item >
    <img
        src="https://media.istockphoto.com/id/528725265/photo/central-park-aerial-view-manhattan-new-york.jpg?s=2048x2048&w=is&k=20&c=D1ec8s1coWVXA9JoMRfxT-zj0AW6T6b1fDlqftWllkU="
        alt=""
        style={{ width: '100%', borderRadius: '5px' }}

    />
</Grid>
<Typography variant="subtitle2" sx={{
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '3',
    WebkitBoxOrient: 'vertical',
}}>
    Venue 1 is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.
</Typography>
<Divider sx={{ margin: '10px 0' }} />
<Grid container style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: currentTheme.palette.secondary.main }}>
    <Typography>
        Rating: <span>4</span>
    </Typography>

    <Typography>
        Busyness: <span>Moderate</span>
    </Typography>
</Grid>
<Divider sx={{ margin: '10px 0' }} />
<Grid container style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: currentTheme.palette.secondary.main }}>
    <CButton
        title="Select"
        onClick={() => { }}
        style={{
            width: '30%',
            background: '#757de8',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '10px 20px',
            fontWeight: 'bold',
        }}
    />
    <CButton
        title="View"
        onClick={() => { }}
        style={{
            width: '30%',
            background: '#757de8',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '10px 30px',
            fontWeight: 'bold',
        }}
    />
</Grid>

</Grid> */}