import {
    Grid,
    Typography,
    Divider,
    useTheme,
    Paper,
    styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import thingsTodoDummyData from "../../temp/dummy_data/thingsTodo.json";
import restaurantDummyData from "../../temp/dummy_data/restaurantData.json";
import { CButton } from "../common/button";
import IItinerary from "../../models/IItinerary";

const CardContainer = styled(Grid)(({ theme }) => ({
    cursor: "pointer",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    transition: 'transform .2s', // Hover transition
    '&:hover': {
        transform: 'scale(1.05)', // Scale effect on hover
    },
}));
const StyledCButton = styled(CButton)(({ theme }) => ({
    background: "#757de8",
    color: "#ffffff",
    borderRadius: "20px",
    fontWeight: "bold",
    [theme.breakpoints.down('sm')]: {
        width: "80%",
        padding: "5px 10px",
    },
    [theme.breakpoints.up('md')]: {
        width: "30%",
        padding: "10px 30px",
    }
}));


const ImageContainer = styled(Grid)(({ theme }) => ({
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 ratio
    height: 0,
    overflow: 'hidden',
    '& img': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    }
}));

const ResponsiveGrid = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    }
}));

const StyledVenueName = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.pxToRem(18),
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
}));

interface ActivityItemProps {
    item: any;
    index: number;
    selectItem: (index: number) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ item, index, selectItem }) => {
    const currentTheme = useTheme();

    return (
        <Grid
            style={{
                cursor: "pointer",
                padding: "20px",
                borderRadius: "15px",
                margin: "10px",
                backgroundColor: currentTheme.palette.secondary.main,
            }}
            item
            xs={12}
            md={3}
            onClick={() => selectItem(index)}
        >
            <StyledVenueName noWrap>{item.venue_name}</StyledVenueName>
            <Grid xs={12} item>
                <img
                    src="https://media.istockphoto.com/id/528725265/photo/central-park-aerial-view-manhattan-new-york.jpg?s=2048x2048&w=is&k=20&c=D1ec8s1coWVXA9JoMRfxT-zj0AW6T6b1fDlqftWllkU="
                    alt=""
                    style={{ width: "100%", borderRadius: "5px" }}
                />
            </Grid>
            <Typography
                variant="subtitle2"
                sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                }}
            >
                {item.description}
            </Typography>
            <Divider sx={{ margin: "10px 0" }} />
            <Grid
                container
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: currentTheme.palette.secondary.main,
                }}
            >
                <Typography>
                    Rating: <span>{item.rating}</span>
                </Typography>

                <Typography>
                    Busyness: <span>{item.busyness}</span>
                </Typography>
            </Grid>
            <Divider sx={{ margin: "10px 0" }} />
            <Grid
                container
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: currentTheme.palette.secondary.main,
                }}
            >

                <Grid container justifyContent="space-between" alignItems="center">
                    <StyledCButton title="Select" onClick={() => { }} />
                    <StyledCButton title="View" onClick={() => { }} />
                </Grid>

            </Grid>
        </Grid>
    );
};

interface IProps {
    updateItinerary: () => void;
    currentItinerary: IItinerary;
}

export const PickRecommendation: React.FC<IProps> = ({ updateItinerary, currentItinerary }) => {
    const [thingsTodo, setThingsTodo] = useState<any[]>([]);
    const [resturantTodo, setResturantTodo] = useState<any[]>([]);

    useEffect(() => {
        setThingsTodo([...thingsTodoDummyData]);
        setResturantTodo([...restaurantDummyData]);
    }, []);

    const selectThingsTodo = (index: number) => {
        let tempData = thingsTodo;
        tempData[index].selected = !tempData[index].selected;
        setThingsTodo([...tempData]);
    };

    const selectResturantTodo = (index: number) => {
        let tempData = resturantTodo;
        tempData[index].selected = !tempData[index].selected;
        setResturantTodo([...tempData]);
    };

    return (
        <>
            <Grid container style={{ marginTop: "20px", justifyContent: "center" }}>
                <Grid item xs={12}>
                    <Typography variant="h6" align="center">
                        Things To Do
                    </Typography>
                </Grid>
                {thingsTodo.slice(0, 3).map((item, index) => (
                    <ActivityItem key={index} item={item} index={index} selectItem={selectThingsTodo} />
                ))}
            </Grid>
            <Grid container style={{ marginTop: "20px", justifyContent: "center" }}>
                <Grid item xs={12}>
                    <Typography variant="h6" align="center">
                        Restaurants
                    </Typography>
                </Grid>
                {resturantTodo.slice(0, 3).map((item, index) => (
                    <ActivityItem key={index} item={item} index={index} selectItem={selectResturantTodo} />
                ))}
            </Grid>
            <Grid xs={12} style={{ justifyContent: "center", display: "flex" }}>
                <CButton
                    title="Next"
                    onClick={updateItinerary}
                    style={{
                        width: "30%",
                        background: "#757de8",
                        color: "#ffffff",
                        borderRadius: "20px",
                        padding: "10px 30px",
                        fontWeight: "bold",
                        margin: "20px 0px",
                    }}
                />
            </Grid>
        </>
    );
};
