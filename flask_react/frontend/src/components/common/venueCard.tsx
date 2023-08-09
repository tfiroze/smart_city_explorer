import {
    Grid,
    Typography,
    Divider,
    styled,
    useTheme,
} from "@mui/material";
import React from "react";
import { CButton } from "../common/button";

const VenueGrid = styled(Grid)(({ theme }) => ({
    cursor: "pointer",
    padding: theme.spacing(2),
    borderRadius: 15,
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
}));

const VenueImage = styled('img')(({ theme }) => ({
    width: '100%',
    borderRadius: 5,
}));

const InfoContainer = styled(Grid)(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.secondary.main,
}));

const StyledCButton = styled(CButton)(({ theme }) => ({
    width: '30%',
    background: '#757de8',
    color: '#ffffff',
    borderRadius: 20,
    padding: theme.spacing(1, 2),
    fontWeight: 'bold',
}));

interface IProps {
    detailsModalClick?: () => void;
}

export const VenueCard: React.FC<IProps> = ({ detailsModalClick }) => {

    const currentTheme = useTheme();
    const showModalDetails = () => detailsModalClick ? detailsModalClick() : console.log('Something went wrong!')

    return (
        <VenueGrid item xs={12}>
            <Typography variant="h6" noWrap>{'Name'}</Typography>

            <VenueImage
                src="https://media.istockphoto.com/id/528725265/photo/central-park-aerial-view-manhattan-new-york.jpg?s=2048x2048&w=is&k=20&c=D1ec8s1coWVXA9JoMRfxT-zj0AW6T6b1fDlqftWllkU="
                alt="Central Park Aerial View"
            />

            <Typography variant="subtitle2" sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
            }}>
                Venue 1 is a major commercial intersection and neighborhood located in the Midtown Manhattan section of New York City. It is known for its vibrant atmosphere, bright billboards, and massive crowds.
            </Typography>
            <Divider sx={{ margin: '10px 0' }} />
            <InfoContainer container>
                <Typography>
                    Rating: <span>4</span>
                </Typography>
                <Typography>
                    Busyness: <span>Moderate</span>
                </Typography>
            </InfoContainer>
            <Divider sx={{ margin: '10px 0' }} />
            <InfoContainer container>
                <StyledCButton
                    title="Select"
                    onClick={() => { }}
                />
                <StyledCButton
                    title="View"
                    onClick={() => showModalDetails()}
                />
            </InfoContainer>
        </VenueGrid>
    )
}
