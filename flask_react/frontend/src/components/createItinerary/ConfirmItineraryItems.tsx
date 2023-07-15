import React from 'react'
import IItinerary from '../../models/IItinerary';
import IVenueItem from '../../models/IVenueItem';
import { Button, Grid, TextField } from '@mui/material';

interface IProps{
    data:IVenueItem[];
    completed:(data:IItinerary)=>void;
}

export const ConfirmItineraryItems:React.FC<IProps> = () => {
  return (
    <Grid container> 
    <Grid item xs={12}> 
        <TextField label="Name"/>
    </Grid>
    <Grid item xs={12}> 

        <TextField
          id="filled-multiline-flexible"
          label="Notes"
          multiline
          maxRows={4}
          variant="filled"
        />
    </Grid>
    <Grid item xs={12}> 

        <Button>Finish</Button>
    </Grid>

    </Grid>
  )
}
