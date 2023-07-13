import {
	Avatar,
	Chip,
	Grid,
	IconButton,
	InputAdornment,
	TextField,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

interface IProps {
	moveNext: () => void;
}

export const InviteFriends: React.FC<IProps> = ({ moveNext }) => {
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

	return (
		<div>
			<TextField
				id="outlined-basic"
				value={user}
				onChange={(value) => setUser(value.target.value)}
				label="Invited User"
				variant="outlined"
				InputProps={{
					endAdornment: (
						<IconButton aria-label="delete" onClick={addUser} size="small">
							<PersonAddAlt1Icon />
						</IconButton>
					),
				}}
			/>
			<Grid container>
				<Grid item xs={12}>
					{invited.map((item, index) => {
						return (
							<Chip
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
		</div>
	);
};
