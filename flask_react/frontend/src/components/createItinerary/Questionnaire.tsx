import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Container,
  styled,
  InputLabel,
  Rating,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DesktopDatePicker, DesktopTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import StarIcon from "@mui/icons-material/Star";
import IItinerary from "../../models/IItinerary";

const venueTypes = [
  {
    id: 1,
    tag: "Tourist Attraction",
    venueType: "tourist_attraction",
    venueTypes: ["Brooklyn Bridge", "Empire State Building"],
  },
  {
    id: 2,
    tag: "Historical Landmark",
    venueType: "historical_landmark",
    venueTypes: ["Empire State Building", "Central Park"],
  },
  {
    id: 3,
    tag: "Scenic Spot",
    venueType: "scenic_spot",
    venueTypes: ["Cherry Hill", "Strawberry field"],
  },
];

const QuestionnaireTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const QuestionnaireButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

interface IProps {
  updateItinerary: (data: IItinerary) => void;
  currentItinerary: IItinerary;
}

export const Questionnaire: React.FC<IProps> = ({ updateItinerary, currentItinerary }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [starsSelected, setStarsSelected] = useState<number>(0.0);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [selectedSubCategoryTags, setSelectedSubCategoryTags] = useState<string[]>([]);
  const [hovering, setHovering] = useState(false);
  const [budget, setBudget] = useState(0);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const changeTime = (time: Dayjs | null, type: "start" | "end" | "date") => {
    let date = "";
    let temp = currentItinerary;
    switch (type) {
      case "date":
        date = `${time?.year()} ${time?.month()} ${time?.day()}`;
        setDate(date);
        temp.date = date;
        break;
      case "start":
        date = `${time?.hour()} ${time?.minute()}`;
        setStartTime(date);
        temp.startTime = date;

        break;
      case "end":
        date = `${time?.hour()} ${time?.minute()}`;
        setEndTime(date);
        temp.endTime = date;

        break;
    }
    updateItinerary(temp)
  };

  const handleStarsSelectionChange = (event: React.ChangeEvent<any>) => {
    setStarsSelected(event.target.value);
  };

  const handleTagChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    let listOptions: string[] = [];
    let listSubSelectionOptions: string[] = [];
    venueTypes.forEach((item) => {
      if (value.indexOf(item.tag) > -1) {
        item.venueTypes.forEach((vt) => {
          if (listOptions.indexOf(vt) < 0) {
            listOptions.push(vt);
          }
        });
      }
    });

    setSubCategory([...listOptions]);
    if (listOptions.length > 0) {
      selectedSubCategoryTags.forEach((item) => {
        if (listOptions.indexOf(item) > -1) {
          listSubSelectionOptions.push(item);
        }
      });
    }

    setSelectedSubCategoryTags([...listSubSelectionOptions]);
    setSelectedTags(value);
  };

  const handleSubTagChange = (
    event: React.ChangeEvent<{}>,
    value: string[]
  ) => {
    setSelectedSubCategoryTags(value);
  };

  const filterVenuesByTags = () => {
    const selectedVenueTypes = venueTypes.filter((venue) =>
      selectedTags.includes(venue.tag)
    );
  };

  return (
    <Container maxWidth="sm">
      <Paper>
        <QuestionnaireTitle variant="h4" align="center">
          Trip Information
        </QuestionnaireTitle>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DesktopDatePicker", "TimePicker"]}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <DemoItem label="Select Date">
                  <DesktopDatePicker
                    onChange={(value) => changeTime(value, "date")}
                    defaultValue={dayjs()}
                  />
                </DemoItem>
              </Grid>
              <Grid item xs={12}>
                <DemoItem label="Interests">
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={venueTypes.map((item) => item.tag)}
                    value={selectedTags}
                    onChange={handleTagChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
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
      </Paper>
    </Container>
  );
};
