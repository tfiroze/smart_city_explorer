import React from "react";
import {
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

export const Questionnaire = () => {
    return (
        <Paper
            style={{
                overflow: "scroll",
                maxHeight: "100vh",
            }}
        >
            <Grid container style={{ position: "relative" }}>
                <Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: "10px" }}>
                    <Typography
                        variant="h4"
                        align="center"
                        color="textSecondary"
                        gutterBottom
                        style={{ margin: "20px 0" }}
                    >
                        Plan a New Trip
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                            components={[
                                'DesktopDatePicker',
                                'TimePicker'
                            ]}
                        >
                            <DemoItem label="Select Date">
                                <DesktopDatePicker defaultValue={dayjs('2022-04-17')} 
                                    // selectedSections={()=>{console.log('Add your selectedSections value here')}}
                                    // onSelectedSectionsChange={()=>{console.log('Add your handleSectionsChange function here')}}  
                                />
                            
                            </DemoItem>
                            <DemoItem label="Select Date">
                            <DesktopTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
                            
                            </DemoItem>
                        </DemoContainer>
                    </LocalizationProvider>
                </Grid>
            </Grid>
        </Paper>
    );
};
