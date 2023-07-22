import React, { useEffect } from "react";
import { Typography, Tooltip } from "@mui/material";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

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
//#region styled crap

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
	color: #008080;
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

//#endregion

interface IProps {
  moveNext: (data: IVenueItem[]) => void;
}

export const VenueSelection: React.FC<IProps> = ({ moveNext }) => {
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

  return (
    <Grid container justifyContent="center">
      {viewVenueItem && (
        <ViewVenueItem
          close={closeViewItem}
          item={viewVenueItem}
          open={viewVenue}
        />
      )}
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
      <Grid item xs={12} style={{ maxHeight: "70vh", overflowY: "scroll" }}>

        <Timeline position="alternate-reverse">
          {itinerary.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent>
                <Grid container>
                  <StyledTimeWrapper>
                    <StyledTimeLabel variant="subtitle2" color="textSecondary">
                      From
                    </StyledTimeLabel>
                    <StyledTime variant="subtitle2">{item.timeFrom}</StyledTime>
                    <ArrowForwardIcon sx={{ color: "#008080" }} />
                    <StyledTimeLabel variant="subtitle2" color="textSecondary">
                      To
                    </StyledTimeLabel>
                    <StyledTime variant="subtitle2">{item.timeTo}</StyledTime>
                  </StyledTimeWrapper>
                </Grid>
                <Grid container>
                  <Grid item xs={12}>
                    <div
                      style={{
                        justifyContent: "left",
                        display: "flex",
                        alignContent: "center",
                      }}
                    >
                      <LocalTaxiIcon style={{ marginRight: '5px' }} />
                      15 minutes
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div
                      style={{
                        justifyContent: "left",
                        display: "flex",
                        alignContent: "center",
                      }}
                    >
                      <PaymentIcon style={{ marginRight: '5px' }} /> $22.23
                    </div>
                  </Grid>
                </Grid>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary" variant="outlined">
                  <StyledLocationOnIcon />
                </TimelineDot>
                {index !== itinerary.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: 400,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {item.title}
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component="img"
                    alt="times square"
                    image={item.imgLink}
                    sx={{
                      height: 200,
                      objectFit: "cover",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                    }}
                  />
                  <CardContent sx={{ textAlign: "justify" }}>
                    <Typography variant="body2" color="textSecondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardContent>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <StyledPeopleIcon />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2" component="span">
                          <strong>Invited: </strong>
                        </Typography>
                        <Typography variant="body2" component="span">
                          {item.invitedParticipant?.length
                            ? item.invitedParticipant?.length
                            : 0}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <StyledScheduleIcon />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2" component="span">
                          <strong> Busyness: </strong>
                        </Typography>
                        {item.busyness === "high" ? (
                          <Tooltip title="Wow, that's brave! Are you sure you want to be around that many people?">
                            <Typography variant="body2" component="span">
                              {item.busyness}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" component="span">
                            {item.busyness}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CenteredCardActions>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setViewVenueItem(item);
                        setViewVenue(true);
                      }}
                    >
                      View
                    </Button>
                  </CenteredCardActions>
                </Card>
                <StyledDivider />
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Grid>
      <SpeedDial
        ariaLabel="Still Blind"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<CreateSharpIcon />}
      >
        <SpeedDialAction
          key="Add New Booking"
          // tooltipOpen
          icon={<AddSharpIcon />}
          tooltipTitle="Add New Booking"
          onClick={handleControlsToggle}
        />
        <SpeedDialAction
          // tooltipOpen
          key="Batch Edit Time"
          icon={<AccessAlarmsSharpIcon />}
          tooltipTitle="Batch Edit Time"
        />
        <SpeedDialAction
          key="Toggle Introvert Mode"
          icon={
            introvertMode ? (
              <SentimentVeryDissatisfiedIcon />
            ) : (
              <SentimentVerySatisfiedIcon />
            )
          }
          tooltipTitle={
            introvertMode ? "Introvert Mode: ON" : "Introvert Mode: OFF"
          }
          onClick={handleIntrovertModeToggle}
        />
      </SpeedDial>
      <VenueSelectionControls
        addItem={addItinerary}
        changeOpenState={handleControlsToggle}
        open={controlsOpen}
      />
    </Grid>
  );
};

export default VenueSelection;
