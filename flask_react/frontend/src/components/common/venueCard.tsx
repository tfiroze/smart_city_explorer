import {
    Grid,
    Typography,
    Divider,
    styled,
    useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { CButton } from "../common/button";
import { useLocation } from "react-router-dom";


const StyledVenueName = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.pxToRem(18),
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
}));

interface IProps {
    detailsModalClick?: (arg: any) => void;
    venDetails?: any;
    venType?: string;
    selectCard?: (args1: string, args2: string, args3: any) => void;
    showSelect?: boolean
    isSelected?: boolean
}

export const VenueCard: React.FC<IProps> = ({
    detailsModalClick,
    venDetails,
    venType,
    selectCard,
    showSelect = false,
    isSelected = false
}) => {

    const currentTheme = useTheme();
    const [widthVal, setWidthVal] = useState<number>(12)
    const showModalDetails = () => detailsModalClick ? detailsModalClick(venDetails) : console.log('Something went wrong!')
    const handleSelection = () => {
        (selectCard && venType) ? selectCard(venType, venDetails.venue_id, venDetails) : console.log('Something went wrong!')
    }

    console.log(venDetails);
    const pathname = useLocation();

    useEffect(() => {
        pathname.pathname === '/ItineraryDetails' ? setWidthVal(12) : setWidthVal(3);
    }, [])

    return (
        <Grid
            style={{ cursor: "pointer", padding: '20px', borderRadius: '15px', margin: '10px', backgroundColor: currentTheme.palette.secondary.main }}
            item
            xs={widthVal}
            onClick={() => { }}
        // className="unselectable"
        >
            <StyledVenueName noWrap>{venDetails?.name ? venDetails?.name : venDetails?.venue_name ? venDetails?.venue_name : ''}</StyledVenueName>

            {/* <Grid item xs={1} display="flex" justifyContent="flex-end">
                    <Checkbox checked={item.selected} />
                </Grid> */}

            <Grid xs={12} item >
                <img
                    src={venDetails?.image ? venDetails?.image : ''}
                    alt=""
                    style={{ width: '100%', borderRadius: '5px', aspectRatio: 16 / 9 }}

                />
            </Grid>
            <Typography variant="subtitle2" sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
            }}>
                {venDetails?.description ? venDetails?.description : ''}
            </Typography>
            <Divider sx={{ margin: '10px 0' }} />
            <Grid container style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: currentTheme.palette.secondary.main }}>
                <Typography>
                    Rating: {venDetails?.rating ? venDetails?.rating : ''}
                </Typography>

                {venDetails?.busyness && <Typography>
                    Busyness: {(venDetails.busyness >= 40 && venDetails.busyness < 80) ? ' Moderate' : (venDetails.busyness >= 80) ? ' High' : ' Low'}
                </Typography>}
            </Grid>
            <Divider sx={{ margin: '10px 0' }} />
            <Grid container style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: currentTheme.palette.secondary.main }}>
                {showSelect && <CButton
                    title="Select"
                    onClick={handleSelection}
                    style={{
                        width: '30%',
                        background: isSelected ? '#757de8' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#757de8',
                        borderRadius: '20px',
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        border: '2px solid #757de8'
                    }}
                />}
                <CButton
                    title="View"
                    onClick={() => showModalDetails()}
                    style={{
                        width: '30%',
                        background: showSelect ? currentTheme.palette.secondary.main : '#757de8',
                        color: showSelect ? '#757de8' : '#fff',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        fontWeight: 'bold',
                    }}
                />
            </Grid>

        </Grid>
    )
}