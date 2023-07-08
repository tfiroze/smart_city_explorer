import { Alert, Button, Grid, Paper } from '@mui/material'
import React from 'react'

export const VenueSelectionControlls = () => {
  return (
    <Paper>
        <Grid container spacing={2} justifyContent='center' display='flex'>
            <Grid item sm={12} md={12}>
                <Alert severity="info">Venue Planner Controlls</Alert>
            </Grid>
            <Grid item sm={12} md={6}>
                <Button variant='contained'>Add New Item</Button>
            </Grid>
            <Grid item sm={12} md={6}>
                <Button variant='contained' color='secondary'>Batch Edit Times</Button>
            </Grid>

        </Grid>
    </Paper>
  )
}
