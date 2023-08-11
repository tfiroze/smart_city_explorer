import React, { useEffect, useState } from "react";
import { Typography, Tooltip, useTheme } from "@mui/material";
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
import { VenueCard } from "../common/venueCard";
import { VenueDetailsModal } from "./VenueDetailsModal";
import makeStyles from "@mui/styles/makeStyles/makeStyles";

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


const StyledLocationOnIcon = styled(LocationOnIcon)`
	color: #757de8;
	margin-right: 2px;
	animation: ${slideInAnimation} 0.5s ease-in-out;
	position: relative;
	top: 2px;
  
`;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& .MuiPaper-root": {
      backgroundColor: "transparent",
      boxShadow: '0 0 0 rgba(0, 0, 0, 0.3)',
    }
  }
}));

//#endregion

interface IProps {
  fareArr: string[];
  duration: string[];
  venues:any;
  venids: string[];
  finalize: ()=>void
}

export const VenueSelection: React.FC<IProps> = ({ fareArr,duration, venids, venues,finalize  }) => {
  const [introvertMode, setIntrovertMode] = React.useState(false);
  const [itinerary, setItinerary] = React.useState<IVenueItem[]>([]);
  const [controlsOpen, setControlsOpen] = React.useState(false);
  const [viewVenue, setViewVenue] = React.useState(false);
  const [viewVenueItem, setViewVenueItem] = React.useState<IVenueItem | null>(
    null
  );
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
  const [venueIndex, setVenueIndex] = useState(0);
  const [openItienaryDetailsModal, setOpenItienaryDetailsModal] = useState<boolean>(false);

  // const [showVenueInfo, setShowVenueInfo] = useState()

  useEffect(() => {

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

  const handItienraryDetailsModal = () => {
    setOpenItienaryDetailsModal(!openItienaryDetailsModal)
  }
  const classes = useStyles();

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

      <Dialog
        open={openItienaryDetailsModal}
        onClose={handItienraryDetailsModal}
        maxWidth="md"
        fullWidth
        className={classes.root}
      >
        <VenueDetailsModal venue={venues[venueIndex]} onClick={handItienraryDetailsModal} />
      </Dialog>
      <Grid item xs={12} style={{ overflowY: "scroll" }}>
        <Timeline position="alternate-reverse">
          {venues.map((item:any, index:number) => (
            <>
              <TimelineItem key={index} >
                <TimelineOppositeContent
                  sx={{ m: 'auto 0' }}
                  align="right"
                  variant="body2"
                  color="text.secondary"
                >
                  Time To Visit: {index == 0 ? '9:00 Am To 11 Am' : index == 1 ? '11 Am to 1 Pm' : index == 2 ? '1 Pm to 3 Pm' : index == 3 ? '3 Pm to 5 Pm' : index == 4? '5 Pm to 7 Pm' : '7 Pm to 9 Pm'}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot sx={{ backgroundColor: currentTheme.palette.secondary.main }}>
                    <StyledLocationOnIcon />
                  </TimelineDot>
                  {<TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent style={{ display: 'flex', justifyContent: 'center' }}>
                  <VenueCard showButtons={false} setWidth={6} detailsModalClick={handItienraryDetailsModal} showSelect={false} isSelected={false} venDetails={item}/>
                </TimelineContent>
              </TimelineItem>
              {index !== (venues.length-1) && <div style={{ width: '100%', flexDirection: 'row', display: 'flex' }}>
                {(fareArr && fareArr.length > 0) && <div style={{ width: '48%' }}>
                  <Typography variant="subtitle1" align="right">
                    Estimated Fare
                  </Typography>
                  <Typography variant="h5" fontWeight={"bold"} align="right">$ {fareArr[index] ? Math.ceil(parseInt(fareArr[index])) : '--'}</Typography>

                </div>}
                {(fareArr?.length > 0 || duration?.length > 0)&& <div style={{ width: '4%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '20px', height: '20px',marginTop:'15px', padding: '10px', borderRadius: '50%', backgroundColor: currentTheme.palette.secondary.main, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <LocalTaxiIcon sx={{ color: ' #757de8' }} />
                  </div>
                </div>}
                {(duration && duration.length > 0) && <div style={{ width: '48%' }}>
                  <Typography variant="subtitle1" component="span">
                    Drive For
                  </Typography>
                  <Typography variant="h5" fontWeight={"bold"}>{duration[index] ? Math.ceil(parseInt(duration[index])/60) : '--'} Minutes</Typography>
                </div>}

              </div>}
            </>
          ))}
        </Timeline>
      </Grid>
      <CButton
        title="Confirm"
        onClick={() => {finalize()}}
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
  );
};

export default VenueSelection;
