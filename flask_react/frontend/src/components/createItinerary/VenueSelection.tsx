import * as React from "react";
import Typography from "@mui/material/Typography";
import {
	Button,
	Grid,
	CardContent,
	Card,
	CardActions,
	CardMedia,
	Divider,
	Chip,
} from "@mui/material";
import { useEffect } from "react";
import {
	Timeline,
	TimelineItem,
	TimelineSeparator,
	TimelineDot,
	TimelineContent,
	TimelineConnector,
	TimelineOppositeContent,
} from "@mui/lab";

interface IProps {}

const data = [
	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},	{
		timeFrom: "10:00",
		timeTo: "10:40",
		imgLink:
			"https://th.bing.com/th/id/OIP.OyELFMoJ0jngszX9pLX-twHaE8?pid=ImgDet&rs=1",
		title: "Time Square",
		description:
			"Times Square is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.",
		venueId: "1291212",
		invited: 20,
		budget: 100.5,
	},
];

export const VenueSelection: React.FC<IProps> = ({}) => {
	useEffect(() => {}, []);

	return (
		<Grid container>
			<Grid xs={1} />
			<Grid xs={5} style={{ maxHeight: "70vh", overflowY: "scroll" }}>
				<Timeline position="alternate-reverse">
					{data.map((item) => {
						return (
							<TimelineItem>
								<TimelineOppositeContent color="text.secondary">
									<b>{item.timeFrom} </b> <br /> To <br />
									<b>{item.timeTo} </b>
								</TimelineOppositeContent>
								<TimelineSeparator>
									<TimelineDot />
									<TimelineConnector />
								</TimelineSeparator>
								<TimelineContent>
									<Card sx={{ maxWidth: 345 }}>
										<CardMedia
											component="img"
											alt="times square"
											height="140"
											src={item.imgLink}/>
										<CardContent>
											<Grid container>
												<Grid
													item
													xs={12}
													md={3}
													style={{ borderRight: "1px dashed", padding: "5px" }}
												>
													<Typography
														gutterBottom
														variant="subtitle1"
														component="div"
														textAlign='center'
														style={{marginBottom:'0',padding:'0'}}
													>
														Invited 
													</Typography>
													<div   style={{ textAlign:'center' }}> {item.invited}</div>
													<Divider/>
													<Typography
														gutterBottom
														variant="subtitle1"
														component="div"
														textAlign='center'
														style={{marginBottom:'0',padding:'0'}}
													>
														Budget
													</Typography>
														
													<div style={{textAlign:'center'}}> {item.budget}</div>
												</Grid>

												<Grid item xs={12} md={8} style={{ padding: "5px" }}>
													<Typography gutterBottom variant="h5" component="div">
														{item.title}
													</Typography>
													<Typography variant="body2" color="text.secondary">
														{item.description}
													</Typography>
												</Grid>
											</Grid>
										</CardContent>
										<CardActions>
											<Button size="small" variant="outlined">
												View
											</Button>
										</CardActions>
									</Card>
								</TimelineContent>
							</TimelineItem>
						);
					})}
				</Timeline>
			</Grid>
		</Grid>
	);
};
