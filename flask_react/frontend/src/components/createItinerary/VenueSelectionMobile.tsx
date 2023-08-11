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
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
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
                            <CardMedia
                                component="img"
                                alt="times square"
                                image={item.imgLink}
                                sx={{
                                    height: 200,
                                    aspectRatio: 16 / 9,
                                    objectFit: "cover",
                                    borderTopLeftRadius: "4px",
                                    borderRadius: '10px',
                                    marginBottom: '10px'
                                }}
                            />
                            <Divider sx={{ margin: '10px 0' }} />
                            <Grid container style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: currentTheme.palette.secondary.main }}>
                                <Typography>
                                    Rating: <span>4</span>
                                </Typography>

                                <Typography>
                                    Busyness: <span>Moderate</span>
                                </Typography>
                            </Grid>
                            <Grid container style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: currentTheme.palette.secondary.main }}>
                                <Button
                                    title="View"
                                    onClick={() => { }}
                                    style={{
                                        width: '30%',
                                        background: '#757de8',
                                        color: '#ffffff',
                                        borderRadius: '20px',
                                        padding: '10px 30px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    View
                                </Button>
                            </Grid>
                        </Card>
                    </Grid>)
            })}
        </Grid>
    )
}