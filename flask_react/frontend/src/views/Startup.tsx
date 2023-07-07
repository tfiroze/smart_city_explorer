import React from "react";
import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import background from "../resources/images/login-background.jpg";
import backgroundVideo from "../resources/video/ManhattanVideo.mp4"
import { CButton } from "../components/common/button";
import { Login } from "./Login";
import ReactPlayer from "react-player";

export const Startup = () => {
  return (
    // <Paper
    //   style={{
    //     overflow: "scroll",
    //     maxHeight: "100vh",
    //   }}
    // >
    //   <Grid container style={{ position: "relative" }}>
    //     <Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: "10px" }}>
    //       <div
    //         style={{
    //           backgroundImage: `url(${background})`,
    //           backgroundSize: "cover",
    //           backgroundPosition: "center",
    //           height: "95vh", // Adjust the height according to your needs
    //           clipPath: "polygon(40% 0, 100% 0%, 100% 100%, 70% 100%)", // Add the clip-path property
    //         }}
    //       ></div>
    //     </Grid>
    //     <Paper
    //       style={{
    //         position: "absolute",
    //         top: "10%",
    //         left: "0%",
    //         width: "40%",
    //         padding: "20px",
    //         backgroundColor: "rgba(255, 255, 255, 0.8)",
    //       }}
    //       elevation={0}
    //     >
    //       <Typography
    //         variant="h4"
    //         align="center"
    //         color="textSecondary"
    //         gutterBottom
    //         style={{ margin: "20px 0" }}
    //       >
    //         Smart City Explorer
    //       </Typography>

    //       <Typography
    //         variant="h5"
    //         align="center"
    //         color="textSecondary"
    //         gutterBottom
    //       >
    //         Unlock the Secrets of Manhattan!
    //       </Typography>
    //       <Typography
    //         variant="subtitle1"
    //         align="center"
    //         color="textSecondary"
    //         gutterBottom
    //         style={{ margin: "20px 0" }}
    //       >
    //         Your Ultimate Companion for Crafting, Organising, and Mapping Itineraries in the Concrete Jungle!
    //       </Typography>
    //       <CButton title="LOGIN" onClick={() => { console.log('Okay') }} />
    //     </Paper>
    //   </Grid>

    //   <Login />
    // </Paper>

    <Paper elevation={0}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ position: 'relative', width: '100%', height: '95vh', overflow: 'hidden' }}>
            <div style={{
              position: 'relative', top: '0px', left: '0px',
            }}>
              <video src={backgroundVideo} preload="auto" loop style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }} autoPlay={true} muted></video>
            </div>
            <section style={{
              backgroundImage: 'linear-gradient(to right bottom, rgba(126,213,111,0.6), rgba(40,180,133,0.6))',
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 10,
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <div style={{
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'center',
                alignItems: 'center',
                height:'60%',
                width:'80%',
                // border:'3px solid black'
              }}>
          <Typography
            variant="h3"
            align="center"
            color="textSecondary"
            
            style={{ letterSpacing:15, padding:'20px', fontWeight:600}}
          >
            SMART CITY EXPLORER
          </Typography>
          <Typography
      variant="h6"
      align="center"
      color="textSecondary"
      gutterBottom
      style={{ margin: "20px 0" }}
    >
      Your Ultimate Companion for Crafting, Organising, and Mapping Itineraries in the Concrete Jungle!
    </Typography>
              <CButton title="Login" onClick={() => { console.log('Okay') }} />
          </div>
        </section>
      </div>
    </Grid>
      </Grid >
    </Paper >
  );
};
