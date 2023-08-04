import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import HomeIcon from "@mui/icons-material/Home";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import LuggageIcon from "@mui/icons-material/Luggage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HistoryIcon from '@mui/icons-material/History';

interface IProps {
    open: boolean;
    handleClose: () => void;
}

export const ProfileDrawer: React.FC<IProps> = ({ open }) => {
    return (
        <Drawer open={open}>
            <List>
                {['Home', 'Update User Password', 'Requests', 'Past Trips', 'Upcoming Trips', 'Weather'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>
                            {index === 0 ? <HomeIcon /> : index === 1 ? <LockOpenIcon /> : index === 2 ? <ListAltIcon /> : index === 3 ? <HistoryIcon /> : index === 4 ? <LuggageIcon /> : <WbSunnyIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}
