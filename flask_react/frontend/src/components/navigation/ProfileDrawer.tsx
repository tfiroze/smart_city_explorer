import { Drawer, List, ListItem, ListItemIcon, ListItemText, ClickAwayListener } from '@mui/material';
import React from 'react';
import HomeIcon from "@mui/icons-material/Home";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import LuggageIcon from "@mui/icons-material/Luggage";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HistoryIcon from '@mui/icons-material/History';

interface IProps {
    open: boolean;
    handleClose: () => void;
}

export const ProfileDrawer: React.FC<IProps> = ({ open, handleClose }) => {
    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div>
                <Drawer open={open} onClose={handleClose} variant="temporary">
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
            </div>
        </ClickAwayListener>
    )
}
