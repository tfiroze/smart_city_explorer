import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// will link to our data...
const data = [
  { id: 1, tag: "Tag 1" },
  { id: 2, tag: "Tag 2" },
  { id: 3, tag: "Tag 3" },
  // this is just placeholders for now
];

export const Questionnaire = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    setSelectedTags(value);
  };

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
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DemoItem label="Select Date">
                    <DesktopDatePicker defaultValue={dayjs('2022-04-17')} 
                      // selectedSections={()=>{console.log('Add your selectedSections value here')}}
                      // onSelectedSectionsChange={()=>{console.log('Add your handleSectionsChange function here')}}  
                    />
                  </DemoItem>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DemoItem label="Select Time">
                    <DesktopTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
                  </DemoItem>
                </Grid>
                <Grid item xs={12}>
                  <DemoItem label="Select Interests">
                    <Autocomplete
                      multiple
                      id="tags-standard"
                      options={data.map((item) => item.tag)}
                      value={selectedTags}
                      onChange={handleTagChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Select Categories"
                          placeholder="Tags"
                        />
                      )}
                    />
                  </DemoItem>
                </Grid>
              </Grid>
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Paper>
  );
};
