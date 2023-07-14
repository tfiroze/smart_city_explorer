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
	Dialog,
	DialogContent,
	DialogTitle,
	SpeedDial,
	SpeedDialAction,
	createStyles,
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
import SettingsIcon from "@mui/icons-material/Settings";
import { VenueSelectionControls } from "./VenueSelectionControls";
import AccessAlarmsSharpIcon from "@mui/icons-material/AccessAlarmsSharp";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import CreateSharpIcon from "@mui/icons-material/CreateSharp";
import venueData from "../../temp/dummy_data/venueData.json";
import Itinerary from "../../models/IItinerary";

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

const ControlsContainer = styled(Dialog)`
	.MuiDialog-paper {
		width: 320px;
	}
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
	// color: #008080;
`;

export const VenueSelection = () => {
	const [itinerary, setItinerary] = React.useState<Itinerary[]>([]);
	const [controlsOpen, setControlsOpen] = React.useState(false);

	useEffect(() => {
		let response = [...(venueData as Itinerary[])]; 
		response = sortData(response.slice(0, 3));
		response = identifyConflicts(response);
		setItinerary(response);
	}, []);

	const addItinerary = (data: Itinerary) => {
		let items = [...itinerary, data];
		if(controlsOpen===true) {
			handleControlsToggle();
		}
		setItinerary([...items])
	};

	const identifyConflicts = (data: Itinerary[]) => {
		for (let x = 0; x < data.length; x++) {}

		return data;
	};

	const sortData = (data: Itinerary[]) =>
		data.sort((itemA, itemB) => {
			const timeA = convertTimeToMinutes(itemA.timeFrom);
			const timeB = convertTimeToMinutes(itemB.timeFrom);
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

	const handleControlsToggle = () => {
		setControlsOpen((prevOpen) => !prevOpen);
	};

	return (
		<Grid container justifyContent="center">
			<Grid
				item
				xs={12}
				md={8}
				style={{ maxHeight: "70vh", overflowY: "scroll" }}
			>
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
									{index === 0 ? <LocationOnIcon /> : <StyledLocationOnIcon />}
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
													<strong> Busyness: </strong>
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
					tooltipOpen
					icon={<AddSharpIcon />}
					tooltipTitle="Add New Booking"
					onClick={handleControlsToggle}
				/>
				<SpeedDialAction
					tooltipOpen
					key="Batch Edit Time"
					icon={<AccessAlarmsSharpIcon />}
					tooltipTitle="Batch Edit Time"
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
