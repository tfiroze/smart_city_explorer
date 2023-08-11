import React, { useEffect } from "react";
import { Typography, Tooltip, useTheme } from "@mui/material";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { isMobile } from "react-device-detect";
import {
  Button,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  SpeedDial,
  SpeedDialAction,
  makeStyles,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";
import { Theme, keyframes } from "@emotion/react";
import { styled } from "@mui/system";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import MoneyIcon from "@mui/icons-material/Money";
import AccessAlarmsSharpIcon from "@mui/icons-material/AccessAlarmsSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import CreateSharpIcon from "@mui/icons-material/CreateSharp";
import ScheduleIcon from "@mui/icons-material/Schedule";
import venueData from "../../temp/dummy_data/venueData.json";
import { ViewVenueItem } from "./ViewVenueItem";
import IVenueItem from "../../models/IVenueItem";
import { VenueSelectionControls } from "./VenueSelectionControls";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import PaymentIcon from "@mui/icons-material/Payment";
import IItinerary from "../../models/IItinerary";
import { CButton } from "../common/button";
import { VenueSelectionMobile } from "./VenueSelectionMobile";
const slideInAnimation = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const StyledDivider = styled(Divider)`
	background-color: #008080;
	margin: 24px 0;
	height: 2px;
	animation: ${keyframes`
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  `} 0.5s ease-in-out;
`;

const StyledScheduleIcon = styled(ScheduleIcon)`
	color: #008080;
	margin-right: 4px;
	margin-top: 4px;
	animation: ${slideInAnimation} 0.5s ease-in-out;
`;

const StyledLocationOnIcon = styled(LocationOnIcon)`
	color: #757de8;
	margin-right: 2px;
	animation: ${slideInAnimation} 0.5s ease-in-out;
	position: relative;
	top: 2px;
  
`;

const StyledPeopleIcon = styled(PeopleIcon)`
	color: #008080;
	margin-right: 4px;
	animation: ${slideInAnimation} 0.5s ease-in-out;
`;

const StyledLocalTaxiIcon = styled(LocalTaxiIcon)`
color: #FB9403;
  &:hover {
    transform: scale(1.1);
    color: #FFD854;
  }
`;

const StyledPaymentIcon = styled(PaymentIcon)`
  &:hover {
    transform: scale(1.1);
    color: #32c75f;
  }
`;

const CenteredCardActions = styled(CardActions)`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 8px;
`;

const StyledTimeWrapper = styled("div")`
	display: flex;
	align-items: center;
	gap: 4px;
	margin-top: 12px;
`;

const StyledTimelineWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 16px;
`;

const StyledTimeLabel = styled(Typography)`
	color: #008080;
	margin-right: 4px;
	font-weight: 600;
	display: flex;
	align-items: center;
`;

const StyledTime = styled(Typography)`
	font-weight: 600;
`;

const DividerWrapper = styled("div")`
	height: 2px;
	position: relative;
	background-color: #008080;
	overflow: hidden;
	margin: 12px 0;
`;

const AnimatedDivider = styled("div")`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	background-color: #fff;
	transform: translateX(-100%);
	animation: ${slideInAnimation} 0.5s ease-in-out forwards;
`;

const StyledArrowForwardIcon = styled(ArrowForwardIcon)`
	color: #008080;
	vertical-align: middle;
	margin: 0 8px;
`;

const StyledDurationTypography = styled(Typography)`
  display: flex;
  align-items: center;
  // color: #FFD854;
`;

const StyledTaxiFareTypography = styled(Typography)`
  display: flex;
  align-items: center;
  // color: #32c75f;
`;


//#endregion

interface IProps {
  updateItinerary: () => void;
  currentItinerary: IItinerary;
}

export const VenueSelection: React.FC<IProps> = ({ updateItinerary, currentItinerary }) => {
  const [introvertMode, setIntrovertMode] = React.useState(false);
  const [itinerary, setItinerary] = React.useState<IVenueItem[]>([]);
  const [controlsOpen, setControlsOpen] = React.useState(false);
  const [viewVenue, setViewVenue] = React.useState(false);
  const [viewVenueItem, setViewVenueItem] = React.useState<IVenueItem | null>(
    null
  );
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);

  useEffect(() => {
    const response = [...(venueData as IVenueItem[])];
    const sortedData = sortData(response.slice(0, 3));
    const identifiedConflicts = identifyConflicts(sortedData);
    let temp = currentItinerary;
    temp.plan = identifiedConflicts
    // updateItinerary(temp)
    setItinerary(identifiedConflicts);
  }, []);

  const addItinerary = (data: IVenueItem) => {
    const isTimeRangeValid =
      convertTimeToMinutes(data.timeFrom) <= convertTimeToMinutes(data.timeTo);
    if (!isTimeRangeValid) {
      // Display an error message or handle invalid time range
      console.error("Invalid time range");
      setErrorDialogOpen(true);
      return;
    }

    let items = [...itinerary, data];
    if (controlsOpen) {
      handleControlsToggle();
    }
    setItinerary(items);
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  const identifyConflicts = (data: IVenueItem[]) => {
    return data;
  };

  const sortData = (data: IVenueItem[]) =>
    data.sort((itemA, itemB) => {
      const timeA = convertTimeToMinutes(itemA.timeFrom);
      const timeB = convertTimeToMinutes(itemB.timeFrom);
      if (timeA === timeB) {
        const timeToA = convertTimeToMinutes(itemA.timeTo);
        const timeToB = convertTimeToMinutes(itemB.timeTo);
        return timeToA - timeToB;
      }
      return timeA - timeB;
    });

  const convertTimeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":");
    let totalMinutes = parseInt(hours) * 60 + parseInt(minutes);

    // Check if the time is past midnight (e.g., 23:00 to 00:00)
    if (totalMinutes < 360) {
      totalMinutes += 1440; // Add 24 hours (1440 minutes)
    }

    return totalMinutes;
  };

  const closeViewItem = () => setViewVenue(false);

  const handleControlsToggle = () => {
    setControlsOpen((prevOpen) => !prevOpen);
  };

  const handleIntrovertModeToggle = () => {
    setIntrovertMode((prevMode) => !prevMode);
  };

  const currentTheme = useTheme();

  return (
    <Grid container justifyContent="center" style={{ position: 'relative' }}>
      {viewVenueItem && (
        <ViewVenueItem
          close={closeViewItem}
          item={viewVenueItem}
          open={viewVenue}
        />
      )}
      <VenueSelectionControls
        addItem={addItinerary}
        changeOpenState={handleControlsToggle}
        open={controlsOpen}
      />
      <Dialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Invalid Time Range"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please enter a valid time range.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12} style={{ overflowY: "scroll" }}>
        {isMobile ? <VenueSelectionMobile items={itinerary} /> :
          (<Timeline position="alternate-reverse">
            {itinerary.map((item, index) => (
              <>
                <TimelineItem key={index} >
                  <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                  >
                    Time To Visit: Between 9am to 11am
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot sx={{ backgroundColor: currentTheme.palette.secondary.main }}>
                      <StyledLocationOnIcon />
                    </TimelineDot>
                    {<TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent style={{ display: 'flex', justifyContent: 'center' }}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: '50%',
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        padding: '15px',
                        borderRadius: '10px',
                        backgroundColor: currentTheme.palette.secondary.main
                      }}
                    >
                      <Typography variant="h6" align="left">
                        {item.title}
                      </Typography>
                      <CardMedia
                        component="img"
                        alt="times square"
                        image={item.imgLink}
                        sx={{
                          height: 200,
                          aspectRatio: 16 / 9,
                          objectFit: "cover",
                          borderTopLeftRadius: "4px",
                          borderRadius: '10px',
                          marginBottom: '10px'
                        }}
                      />
                      <Typography variant="subtitle2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: '3',
                          WebkitBoxOrient: 'vertical',

                        }}
                        align="left"
                      >
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
                      <Grid container style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: currentTheme.palette.secondary.main }}>
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
                    </Card>
                  </TimelineContent>
                </TimelineItem>
                <div style={{ width: '100%', flexDirection: 'row', display: 'flex' }}>
                  <div style={{ width: '48%' }}>
                    <Typography variant="h6" align="right">
                      Estimated Fare
                    </Typography>
                    <Typography align="right">40 Dollars</Typography>

                  </div>
                  <div style={{ width: '4%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', padding: '10px', borderRadius: '50%', backgroundColor: currentTheme.palette.secondary.main, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <LocalTaxiIcon sx={{ color: ' #757de8' }} />
                    </div>
                  </div>
                  <div style={{ width: '48%' }}>
                    <Typography variant="h6" component="span">
                      Drive For
                    </Typography>
                    <Typography>30 minutes</Typography>
                  </div>

                </div>
              </>
            ))}
          </Timeline>)}
      </Grid>
      <CButton
        title="Confirm"
        onClick={() => { updateItinerary() }}
        style={{
          width: '30%',
          background: '#757de8',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '10px 30px',
          fontWeight: 'bold',
          margin: '20px 0px'
        }}
      />
    </Grid>
  );
};

export default VenueSelection;
