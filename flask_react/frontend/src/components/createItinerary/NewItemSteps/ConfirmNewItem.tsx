import React from 'react';
import IItinerary from '../../../models/IItinerary';
import { Avatar, Button, Chip, Grid, Typography } from '@mui/material';


interface IProps {
	moveNext: () => void;
	newItemDetails: IItinerary;
	updateNewItem: (item: IItinerary) => void;
	onConfirm: () => void;
}

export const ConfirmNewItem: React.FC<IProps> = ({
	moveNext,
	newItemDetails,
	updateNewItem,
	onConfirm,
}) => {
	return (
		<div style={{ maxWidth: '700px', margin: '0 auto' }}>
			<Typography variant='h6' gutterBottom>
				Confirm Details
			</Typography>
			<Typography variant='body2' gutterBottom>
				{newItemDetails.timeFrom} To {newItemDetails.timeTo}
			</Typography>
			<Typography variant='body2' gutterBottom>
				<strong>Venue:</strong> {newItemDetails.title}
			</Typography>
			<Typography variant='body2' gutterBottom>
				<strong>Description:</strong>
			</Typography>
			<Typography variant='body2' gutterBottom>
				{newItemDetails.description}
			</Typography>
			<Typography variant='body2' gutterBottom>
				<strong>Invited:</strong>
			</Typography>
			<Grid container spacing={1}>
				{newItemDetails.invitedParticipant!.map((item, index) => (
					<Grid item key={index}>
						<Chip
							style={{ margin: '5px' }}
							avatar={<Avatar alt={item} />}
							label={item}
							variant='outlined'
						/>
					</Grid>
				))}
			</Grid>
			<Button onClick={onConfirm} variant='contained' color='primary' sx={{ mt: 2 }}>
				Confirm
			</Button>
		</div>
	);
};
