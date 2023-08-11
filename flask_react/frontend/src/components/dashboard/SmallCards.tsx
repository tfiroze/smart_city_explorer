import { Button, Grid, Paper, Typography, useTheme } from "@mui/material";
import React from "react";
import { toTitleCase } from "../../utils/utility_func";

interface Venue {
    name: string;
    image?: string;
  }
  
  interface IProps {
    venue: Venue;
    onClick?: ()=>void
  }
export const SmallCards: React.FC<IProps> = ({venue, onClick}) => {
    const currentTheme = useTheme();

    return (
        <Grid
            style={{ cursor: "pointer", padding: '15px', width: '35%', backgroundColor: currentTheme?.palette?.secondary?.main, marginRight: '5px', borderRadius: '10px' }}
            item
            className="unselectable"
            onClick={()=>onClick && onClick()}
        >
            <Grid xs={12} >
                <img
                    src={venue.image}
                    alt=""
                    style={{ width: '100%', borderRadius: '5px', aspectRatio:16/9 }}
                    
                />
            </Grid>
            <Grid xs={12}>
                <Typography variant="subtitle2" fontWeight={600}>
                    {toTitleCase(venue.name)}
                </Typography>
            </Grid>
        </Grid>
    );
};
