import {
	Avatar,
	Button,
	Chip,
	Grid,
	IconButton,
	InputAdornment,
	TextField,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import IVenueItem from "../../../models/IVenueItem";

interface IProps {
	moveNext: () => void;
	newItemDetails:IVenueItem;
	updateNewItem: (item:IVenueItem) => void;
}

export const InviteFriends: React.FC<IProps> = ({ moveNext, newItemDetails, updateNewItem }) => {
	const [invited, setInvited] = useState<string[]>([]);
	const [user, setUser] = useState<string>("");

	const deleteInvitedUser = (userToDelete: string) => {
		let tmpLst: string[] = [];

		invited.forEach((item) => {
			console.log(item == userToDelete, userToDelete, item);
			if (item != userToDelete) {
				tmpLst.push(item);
			}
		});
		setInvited([...tmpLst]);
	};

	const addUser = () => {
		setInvited([user, ...invited]);
		setUser("");
	};

	const moveNextAndAdd = () => {
		let temp = newItemDetails;
		temp.invitedParticipant = invited
		updateNewItem(temp)
		moveNext();
	}

	return (
		<div>
			<TextField
				id="outlined-basic"
				value={user}
				onChange={(value) => setUser(value.target.value)}
				label="Invited User"
				variant="outlined"
				style={{marginBottom:'10px'}}
				InputProps={{
					endAdornment: (
						<IconButton aria-label="delete" onClick={addUser} size="small">
							<PersonAddAlt1Icon />
						</IconButton>
					),
				}}
			/>
			<Grid container>
				<Grid item xs={12} style={{maxWidth: '700px'}}>
					{invited.map((item, index) => {
						return (
							<Chip
								style={{margin:'5px'}}
								avatar={<Avatar alt={item} />}
								label={item}
								key={index}
								variant="outlined"
								onDelete={() => deleteInvitedUser(item)}
							/>
						); 
					})}
				</Grid>
			</Grid>
			<Button variant='contained' style={{marginTop:'5px'}} onClick={moveNextAndAdd}>Next</Button>
		</div>
	);
};
