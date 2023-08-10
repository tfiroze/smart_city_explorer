import {
    Grid,
    Typography,
    Divider,
    styled,
    useTheme,
} from "@mui/material";
import React from "react";
import "leaflet/dist/leaflet.css";
import { CButton } from "../common/button";


const StyledVenueName = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.pxToRem(18),
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
}));

interface IProps {
    detailsModalClick?: (arg:any)=>void;
    venDetails?: any;
    venType?:string;
    selectCard?:(args1:string, args2:string)=>void;
    showSelect?: boolean
    isSelected?:boolean
}

export const VenueCard :React.FC<IProps> = ({
  detailsModalClick,
  venDetails,
  venType,
  selectCard,
  showSelect = false,
  isSelected = false
})  => {
    
    const currentTheme = useTheme();
    const showModalDetails = ()=> detailsModalClick? detailsModalClick(venDetails):console.log('Something went wrong!')
    const handleSelection= ()=>{
        (selectCard && venType) ? selectCard(venType, venDetails.venue_id) : console.log('Something went wrong!')
    }
    
    return (
        <Grid
            style={{ cursor: "pointer", padding: '20px', borderRadius: '15px', margin: '10px', backgroundColor: currentTheme.palette.secondary.main }}
            item
            xs={3}
            onClick={() => { }}
        // className="unselectable"
        >
            <StyledVenueName noWrap>{venDetails.name}</StyledVenueName>

            {/* <Grid item xs={1} display="flex" justifyContent="flex-end">
                    <Checkbox checked={item.selected} />
                </Grid> */}

            <Grid xs={12} item >
                <img
                    src={venDetails.image}
                    alt=""
                    style={{ width: '100%', borderRadius: '5px' }}

                />
            </Grid>
            <Typography variant="subtitle2" sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
            }}>
                {venDetails.description}
            </Typography>
            <Divider sx={{ margin: '10px 0' }} />
            <Grid container style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: currentTheme.palette.secondary.main }}>
                <Typography>
                    Rating: {venDetails.rating}
                </Typography>

                <Typography>
                    Busyness: {(venDetails.busyness >= 40 && venDetails.busyness < 80) ? ' Moderate' : (venDetails.busyness >= 80) ? ' High' : ' Low' }
                </Typography>
            </Grid>
            <Divider sx={{ margin: '10px 0' }} />
            <Grid container style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: currentTheme.palette.secondary.main }}>
                {showSelect && <CButton
                    title="Select"
                    onClick={handleSelection}
                    style={{
                        width: '30%',
                        background:isSelected? '#757de8' : '#ffffff',
                        color: isSelected?'#ffffff': '#757de8',
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
                        background:showSelect?  currentTheme.palette.secondary.main : '#757de8',
                        color: '#757de8',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        fontWeight: 'bold',
                    }}
                />
            </Grid>

        </Grid>
    )
}