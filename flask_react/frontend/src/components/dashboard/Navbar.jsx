import React, { useState } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import {
	Home as HomeIcon,
	FlightTakeoff as FlightTakeoffIcon,
	Menu as MenuIcon,
} from "@mui/icons-material";

const NavBar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setIsOpen(open);
	};

	const drawerList = () => (
		<div
			role="presentation"
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}
		>
			<List>
				{["Dashboard"].map((text, index) => (
					<ListItem button key={text}>
						<ListItemIcon>
							{index === 0 ? <FlightTakeoffIcon /> : <HomeIcon />}
						</ListItemIcon>
						<ListItemText primary={text} />
					</ListItem>
				))}
			</List>
		</div>
	);

	return (
		<div>
			<AppBar position="static">
				<Toolbar variant="dense">
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						onClick={toggleDrawer(true)}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" color="inherit">
						Dashboard
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer open={isOpen} onClose={toggleDrawer(false)}>
				{drawerList()}
			</Drawer>
		</div>
	);
};

export default NavBar;
