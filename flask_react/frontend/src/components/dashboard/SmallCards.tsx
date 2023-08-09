import { Button, Grid, Paper, Typography, styled, useTheme } from "@mui/material";
import React from "react";
import { toTitleCase } from "../../utils/utility_func";

interface Venue {
    name: string;
    image?: string;
}

interface IProps {
    venue: Venue;
    onClick?: () => void;
}

const CardGrid = styled(Grid)(({ theme }) => ({
    cursor: "pointer",
    padding: theme.spacing(2),
    width: "100%",
    backgroundColor: theme.palette.secondary.main,
    marginRight: theme.spacing(0.5),
    borderRadius: 10,
    [theme.breakpoints.up('sm')]: {
        width: "35%",
    },
}));

const VenueImage = styled('img')({
    width: '100%',
    borderRadius: 5,
    aspectRatio: '16/9',
});

const StyledTypography = styled(Typography)({
    fontWeight: 600,
});

export const SmallCards: React.FC<IProps> = ({ venue, onClick }) => {
    return (
        <CardGrid
            item
            className="unselectable"
            onClick={() => onClick && onClick()}
        >
            <Grid item xs={12}>
                <VenueImage
                    src={venue.image}
                    alt={`Image of ${venue.name}`}
                />
            </Grid>
            <Grid item xs={12}>
                <StyledTypography variant="subtitle2">
                    {toTitleCase(venue.name)}
                </StyledTypography>
            </Grid>
        </CardGrid>
    );
};
