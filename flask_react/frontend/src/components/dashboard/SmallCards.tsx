import { Button, Grid, Paper, Typography, useTheme } from "@mui/material";
import React from "react";
import { toTitleCase } from "../../utils/utility_func";

interface IProps {
    venue: object;
}

export const SmallCards: React.FC<IProps> = ({ venue }) => {
    const currentTheme = useTheme();

    return (
        <Grid
            style={{ cursor: "pointer", padding: '15px', width: '35%', backgroundColor: currentTheme?.palette?.secondary?.main, marginRight: '5px', borderRadius: '10px' }}
            item
            className="unselectable"
        >
            <Grid xs={12} >
                <img
                    src="https://media.istockphoto.com/id/528725265/photo/central-park-aerial-view-manhattan-new-york.jpg?s=2048x2048&w=is&k=20&c=D1ec8s1coWVXA9JoMRfxT-zj0AW6T6b1fDlqftWllkU="
                    alt=""
                    style={{ width: '100%', borderRadius: '5px' }}
                />
            </Grid>
            <Grid xs={12}>
                <Typography variant="subtitle2" fontWeight={600}>
                    {toTitleCase('')}
                </Typography>
            </Grid>
        </Grid>
    );
};
