import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import {
  Button,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
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
import { keyframes } from "@emotion/react";
import { styled } from "@mui/system";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import MoneyIcon from "@mui/icons-material/Money";
import SettingsIcon from "@mui/icons-material/Settings";
import { VenueSelectionControls } from "./VenueSelectionControls";

// const StyledArrowForwardIcon = styled(ArrowForwardIcon)`
//   color: #008080;
//   vertical-align: middle;
//   margin: 0 8px;
// `;
interface Itinerary {
	timeFrom: string;
	timeTo: string;
	imgLink: string;
	title: string;
	description: string;
	venueId: string | number; //based on backend but ye....( ͡° ʖ̯ ͡°)
	budget: number;
	invited: number;
	conflictsWithPrevouse?: boolean;
}
const data: Itinerary[] = [
	{
		timeFrom: "08:00",
		timeTo: "09:40",
		imgLink:
			"https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=695&q=80",
		title: "Times Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},
	{
		timeFrom: "13:45",
		timeTo: "15:00",
		imgLink:
			"https://images.unsplash.com/photo-1563818785891-5e953f985e29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=655&q=80",
		title: "The High Line",
		description:
			"The High Line is an elevated linear park built on a historic freight rail line. It offers a unique and scenic walkway with gardens, art installations, and stunning views of Manhattan's West Side.",
		venueId: "1357911",
		invited: 12,
		budget: 60.7,
	},
	{
		timeFrom: "10:00",
		timeTo: "11:40",
		imgLink:
			"https://images.unsplash.com/photo-1512872942423-e9877d94e902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
		title: "Central Park",
		description:
			"Central Park is an urban park in the middle of Manhattan. It is one of the most famous parks in the world and offers a wide range of recreational activities and attractions, including lakes, meadows, walking paths, and iconic landmarks.",
		venueId: "9876543",
		invited: 15,
		budget: 80.2,
	},
	{
		timeFrom: "12:00",
		timeTo: "13:30",
		imgLink:
			"https://images.unsplash.com/photo-1555109307-f7d9da25c244?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
		title: "Empire State Building",
		description:
			"The Empire State Building is a world-famous skyscraper located in Midtown Manhattan. It offers breathtaking views of the city from its observation decks and is a popular tourist attraction.",
		venueId: "246810",
		invited: 25,
		budget: 150.9,
	},

	{
		timeFrom: "22:00",
		timeTo: "22:40",
		imgLink:
			"https://images.unsplash.com/photo-1501503125584-bb1da5f56d48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
		title: "Grand Central Terminal",
		description:
			"Grand Central Terminal is a historic train station located in Midtown Manhattan. It is renowned for its stunning Beaux-Arts architecture, intricate details, and vibrant main concourse.",
		venueId: "2236067",
		invited: 24,
		budget: 135.2,
	},
	{
		timeFrom: "16:15",
		timeTo: "17:40",
		imgLink:
			"https://images.unsplash.com/photo-1590700928582-5389e4ded3cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
		title: "The Metropolitan Museum of Art",
		description:
			"The Metropolitan Museum of Art, often referred to as the Met, is one of the world's largest and most prestigious art museums. It houses an extensive collection spanning thousands of years and various cultures.",
		venueId: "271828",
		invited: 30,
		budget: 200.0,
	},
	{
		timeFrom: "18:00",
		timeTo: "19:40",
		imgLink:
			"https://images.unsplash.com/photo-1503572327579-b5c6afe5c5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=742&q=80",
		title: "Statue of Liberty",
		description:
		"The Statue of Liberty is a colossal neoclassical sculpture located on Liberty Island in New York Harbor. It is a symbol of freedom and democracy and has become one of the most iconic landmarks in the United States.",
		venueId: "1414213",
		invited: 22,
		budget: 120.5,
	},
	{
		timeFrom: "20:00",
		timeTo: "21:40",
		imgLink:
			"https://images.unsplash.com/photo-1602089266537-57cb22e5235b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=689&q=80",
		title: "Rockefeller Center",
		description:
			"Rockefeller Center is a complex of commercial buildings located in Midtown Manhattan. It is famous for its Art Deco architecture, ice skating rink, and the iconic Christmas tree during the holiday season.",
		venueId: "1123581",
		invited: 17,
		budget: 95.7,
	},

	{
		timeFrom: "23:00",
		timeTo: "00:00",
		imgLink:
			"https://images.unsplash.com/photo-1625358775317-a4f33370c520?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1155&q=80",
		title: "The Museum of Modern Art",
		description:
			"The Museum of Modern Art, also known as MoMA, is a renowned art museum located in Midtown Manhattan. It showcases a vast collection of modern and contemporary artworks from around the world.",
		venueId: "987654",
		invited: 16,
		budget: 75.8,
	},
	{
		timeFrom: "15:15",
		timeTo: "16:00",
		imgLink:
			"https://images.unsplash.com/photo-1599854171059-d91f0fee45cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1610&q=80",
		title: "Brooklyn Bridge",
		description:
			"The Brooklyn Bridge is a famous landmark that connects Manhattan to Brooklyn. It is a suspension bridge with pedestrian walkways, offering stunning views of the New York City skyline and the East River.",
		venueId: "3141592",
		invited: 18,
		budget: 90.3,
	},
];

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

const DividerWrapper = styled("div")`
  height: 2px;
  position: relative;
  background-color: #008080;
  overflow: hidden;
  margin: 12px 0;
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

const StyledLocationOnIcon = styled(LocationOnIcon)`
  color: #008080;
  margin-right: 4px;
  animation: ${slideInAnimation} 0.5s ease-in-out;
`;

const StyledPeopleIcon = styled(PeopleIcon)`
  color: #008080;
  margin-right: 4px;
  animation: ${slideInAnimation} 0.5s ease-in-out;
`;

const StyledMoneyIcon = styled(MoneyIcon)`
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

const ControlsContainer = styled(Grid)<{ open: boolean }>`
  position: fixed;
  top: 0;
  right: ${({ open }) => (open ? "0" : "-320px")};
  width: 320px;
  height: 100vh;
  background-color: #fff;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  z-index: 999;
`;

const OpenControlsButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
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
//   min-width: 48px;
  display: flex;
  align-items: center;
`;

const StyledTime = styled(Typography)`
  font-weight: 600;
`;

export const VenueSelection = () => {
  const [itinerary, setItinerary] = React.useState<Itinerary[]>([]);
  const [controlsOpen, setControlsOpen] = React.useState(false);

  useEffect(() => {
    let response = [...data]; // API response

    response = sortData(response);
    response = identifyConflicts(response);
    setItinerary(response);
  }, []);

  const addItinerary = (data: Itinerary) => {
    let items = [...itinerary, data];
  };

  const identifyConflicts = (data: Itinerary[]) => {
    for (let x = 0; x < data.length; x++) {}

    return data;
  };

  const sortData = (data: Itinerary[]) =>
    data.sort((timeA, timeB) => {
      let z = convertTimeToMinutes(timeA.timeFrom);
      let b = convertTimeToMinutes(timeB.timeFrom);
      console.log(z, b);

      return z + b;
    });

  const convertTimeToMinutes = (time: string) => {
    let [hours, minutes] = time.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  const handleControlsToggle = () => {
    setControlsOpen((prevOpen) => !prevOpen);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8} style={{ maxHeight: "70vh", overflowY: "scroll" }}>
        <Timeline position="alternate-reverse">
          {itinerary.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent>
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
</TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary" variant="outlined">
                  {index === 0 ? (
                    <LocationOnIcon />
                  ) : (
                    <StyledLocationOnIcon />
                  )}
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
                  <CardContent >
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
                          <strong>Invited:{" "}</strong>
                        </Typography>
                        <Typography variant="body2" component="span">
                          {item.invited}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <StyledMoneyIcon />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2" component="span">
                          <strong> Budget:{" "} </strong>
                        </Typography>
                        <Typography variant="body2" component="span">
                          {item.budget}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CenteredCardActions>
                    <Button size="small" variant="outlined">
                      View
                    </Button>
                  </CenteredCardActions>
                </Card>
				<StyledDivider />
				{/* {index !== itinerary.length - 1 && <Divider />} */}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Grid>
      <ControlsContainer open={controlsOpen}>
	  <VenueSelectionControls />
      </ControlsContainer>
      <OpenControlsButton
        variant="contained"
        color="primary"
        onClick={handleControlsToggle}
        startIcon={<SettingsIcon />}
      >
        Open Controls
      </OpenControlsButton>
    </Grid>
  );
};