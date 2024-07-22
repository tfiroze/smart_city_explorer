import {
    Grid,
    Typography,
    Paper,
    Checkbox,
    Divider,
    Alert,
    styled,
    useTheme,
    Dialog,
    Theme,
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
import makeStyles from "@mui/styles/makeStyles/makeStyles";
import { VenueDetailsModal } from "./VenueDetailsModal";
import { replaceUnderscoresWithSpaces, toTitleCase } from "../../utils/utility_func";
import { MessagePopups } from "../common/messagePopups";

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
type AttractionSelectionType = { [key: string]: string };
type AttractionSelectionTypeObj = { [key: string]: any };


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        "& .MuiPaper-root": {
            backgroundColor: "transparent",
            boxShadow: '0 0 0 rgba(0, 0, 0, 0.3)',
        }
    }
}));

interface IProps {
    attractionValue: any[];
    attractionName: string[];
    restaurantValue: any[];
    restaurantName: string[];
    getFare: (args: string[], args2: any) => void
    getBack:()=>void
}

export const PickRecommendation: React.FC<IProps> = ({ attractionValue, attractionName, restaurantName, restaurantValue, getFare, getBack }) => {
    const [attractionNameArr, setAttractionNameArr] = useState<string[]>([]);
    const [attractionValueArr, setAttractionValueArr] = useState<any[]>([]);

    const [restaurantNameArr, setRestaurantNameArr] = useState<string[]>([]);
    const [restaurantValueArr, setRestaurantValueArr] = useState<any[]>([]);


    const [openItienaryDetailsModal, setOpenItienaryDetailsModal] = useState<boolean>(false);
    const [modalDetails, setModalDetails] = useState({})

    const [attractionSelection, setAttractionSelection] = useState<AttractionSelectionType>({})
    const [restaurantSelection, setRestaurantSelection] = useState<AttractionSelectionType>({})

    const [attractionSelectionObject, setAttractionSelectionObject] = useState<AttractionSelectionTypeObj>({})
    const [restaurantSelectionObject, setRestaurantSelectionObject] = useState<AttractionSelectionTypeObj>({})

    const [oneButtonModal, setOneButtonModal] = useState<boolean>(false);
    const [oneButtonMessage, setOneButtonMessage] = useState<string>('');

    useEffect(() => {
        setAttractionValueArr(attractionValue);
        setAttractionNameArr(attractionName);
        setRestaurantNameArr(restaurantName)
        setRestaurantValueArr(restaurantValue)
    }, []);

    const handItienraryDetailsModal = (details: any) => {
        setModalDetails(details);
        setOpenItienaryDetailsModal(!openItienaryDetailsModal)
    }

    const handleCardSelection = (type: string, id: string, details: any) => {

        if (type.includes("RESTAURANT")) {
            setRestaurantSelection({
                ...restaurantSelection,
                [type]: id
            })
            setRestaurantSelectionObject({
                ...restaurantSelectionObject,
                [type]: details
            })
        } else {
            setAttractionSelection({
                ...attractionSelection,
                [type]: id
            })
            setAttractionSelectionObject({
                ...attractionSelectionObject,
                [type]: details
            })
        }

    }

    const handleSubmitSelection = () => {

        if (Object.keys(attractionSelection).length == 4 && Object.keys(restaurantSelection).length == 2) {
            
            const submissionArray = attractionNameArr.map(key => attractionSelection[key]);
            let restArr = restaurantNameArr.map(key => restaurantSelection[key]);

            submissionArray.splice(2, 0, restArr[0]);
            // Insert the second value of arrayB at the end of arrayA
            submissionArray.push(restArr[1]);
            let submissionObjArr = attractionNameArr.map(key => attractionSelectionObject[key]);
            let submissionRestObjArr = restaurantNameArr.map(key => restaurantSelectionObject[key]);

            submissionObjArr.splice(2, 0, submissionRestObjArr[0]);
            submissionObjArr.push(submissionRestObjArr[1]);

            getFare(submissionArray, submissionObjArr)
        } else {
            handleSelectionError('Please Select One Venue for Each Attraction')
        }



    }

    const currentTheme = useTheme();
    const classes = useStyles();

    const setErrorMessage = (message: string) => {
        setOneButtonMessage(message)
    }

    const handleSelectionError = (message: string) => {
        setErrorMessage(message)
        handleOneButtonPopup()
    }

    const handleOneButtonPopup = () => {
        setOneButtonModal(!oneButtonModal)
    }


    return (
        <>
            <Dialog
                open={openItienaryDetailsModal}
                onClose={handItienraryDetailsModal}
                maxWidth="md"
                fullWidth
                className={classes.root}
            >
                <VenueDetailsModal venue={modalDetails} />
            </Dialog>
            <Dialog
                open={oneButtonModal}
                onClose={handleOneButtonPopup}
                maxWidth="sm"
                fullWidth
            >
                <MessagePopups totalButtons={1} message={oneButtonMessage} buttonText={'OK'} onFirstClick={handleOneButtonPopup} />
            </Dialog>
            {attractionValueArr?.length > 0 && attractionValueArr.map((el: any, index: number) => (
                <Grid container style={{ marginTop: '20px', justifyContent: 'center' }}>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center">
                            {el.type_att}
                        </Typography>
                        <Typography variant="h6" align="center">
                            Time to Visit: {el.time}
                        </Typography>
                    </Grid>


                    {el?.venue?.slice(0, 3)?.map((item: any, index: number) => {
                        const isSelected =
                            Object.keys(attractionSelection).length !== 0 &&
                            attractionSelection[el.type_att] === item.venue_id;
                        return (
                            <VenueCard
                                venDetails={item}
                                detailsModalClick={handItienraryDetailsModal}
                                venType={el.type_att}
                                selectCard={handleCardSelection}
                                showSelect={true}
                                isSelected={isSelected}
                            />
                        );
                    })}

                </Grid>
            ))
            }

            {restaurantValueArr?.length > 0 && restaurantValueArr.map((el: any, index: number) => (
                <Grid container style={{ marginTop: '20px', justifyContent: 'center' }}>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center">
                            {toTitleCase(replaceUnderscoresWithSpaces(el.type_att))}
                        </Typography>
                        <Typography variant="h6" align="center">
                            Time to Visit: {el.time}
                        </Typography>
                    </Grid>


                    {el?.venue?.slice(0, 3)?.map((item: any, index: number) => {
                        const isSelected =
                            Object.keys(restaurantSelection).length !== 0 &&
                            restaurantSelection[el.type_att] === item.venue_id;
                        return (
                            <VenueCard
                                venDetails={item}
                                detailsModalClick={handItienraryDetailsModal}
                                venType={el.type_att}
                                selectCard={handleCardSelection}
                                showSelect={true}
                                isSelected={isSelected}
                            />
                        );
                    })}

                </Grid>
            ))
            }

            <Grid xs={3} style={{margin:'0 auto' ,justifyContent: 'space-around', display: 'flex'}}>
                
                <CButton
                    title="Back"
                    onClick={() => { getBack() }}
                    style={{
                        width: '40%',
                        background: '#757de8',
                        color: '#ffffff',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        fontWeight: 'bold',
                        margin: '20px 0px'
                    }}
                />
                <CButton
                    title="Next"
                    onClick={() => { handleSubmitSelection() }}
                    style={{
                        width: '40%',
                        background: '#757de8',
                        color: '#ffffff',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        fontWeight: 'bold',
                        margin: '20px 0px'
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