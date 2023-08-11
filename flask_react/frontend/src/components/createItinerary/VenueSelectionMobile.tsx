import React, { useEffect } from "react";
import IVenueItem from "../../models/IVenueItem";
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
    makeStyles,
} from "@mui/material";
import { Typography, Tooltip, useTheme } from "@mui/material";
interface IProps {
    items: IVenueItem[]
}

export const VenueSelectionMobile: React.FC<IProps> = ({ items }) => {
    const currentTheme = useTheme();
    return (
        <Grid container spacing={2} style={{ marginTop: '10px' }}>
            {items.map((item) => {
                return (
                    <Grid item xs={12}>
                        <Card
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                padding: '15px',
                                borderRadius: '10px',
                                backgroundColor: currentTheme.palette.secondary.main
                            }}>
                            <Typography variant="h6" align="left">
                                {item.title}
                            </Typography>
                        </Card>
                    </Grid>)
            })}
        </Grid>
    )
}