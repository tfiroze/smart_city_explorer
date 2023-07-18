import React, { useState } from "react";
import {
  Dialog,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import background from "../resources/images/login-background.jpg";
import backgroundVideo from "../resources/video/ManhattanVideo.mp4"
import { CButton } from "../components/common/button";
import { Login } from "./Login";
import { Register } from "../components/login/Register";

export const Startup = () => {

  const [loginModal, setLoginModal] = useState(false)

  const handleLoginModal = ()=>{
    setLoginModal(!loginModal)
  }
  
  return (
    <Paper elevation={0}>
      <Dialog        
				open={loginModal}
				onClose={handleLoginModal}
        maxWidth="sm"
        fullWidth
			>
        <Login/>
      </Dialog>
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
              <CButton title="Login" onClick={handleLoginModal} style={{
                background:'white', color: '#1ED760'
              }} />
          </div>
        </section>
      </div>
    </Grid>
      </Grid >
    </Paper >
  );
};
