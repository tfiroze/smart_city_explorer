import React from "react";
import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import background from "../resources/images/login-background.jpg";
import { CButton } from "../components/common/button";
import { Login } from "./Login";

export const Startup = () => {
  return (
    <Paper
      style={{
        overflow: "scroll",
        maxHeight: "100vh",
      }}
    >
      <Grid container style={{ position: "relative" }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "95vh", // Adjust the height according to your needs
              clipPath: "polygon(40% 0, 100% 0%, 100% 100%, 70% 100%)", // Add the clip-path property
            }}
          ></div>
        </Grid>
        <Paper
          style={{
            position: "absolute",
            top: "25%",
            left: "0%",
            width: "40%",
            // padding: "20px",
            // backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
          elevation={0}
        >
          <Typography
            variant="h4"
            align="center"
            color="textSecondary"
            gutterBottom
            style={{ margin: "20px 0" }}
          >
            Smart City Explorer
          </Typography>

          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            Unlock the Secrets of Manhattan!
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            gutterBottom
            style={{ margin: "20px 0" }}
          >
            Your Ultimate Companion for Crafting, Organising, and Mapping Itineraries in the Concrete Jungle!
          </Typography>
          <CButton title="LOGIN" onClick={() => { console.log('Okay') }} />
        </Paper>
      </Grid>

      <Login />
    </Paper>
  );
};
