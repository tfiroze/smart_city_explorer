import React, { useState } from "react";
import {
  Dialog,
  Grid,
  Box,
  Typography,
  Tooltip
} from "@mui/material";
import backgroundVideo from "../resources/video/ManhattanVideo.mp4"
import { CButton } from "../components/common/button";
import { Login } from "./Login";
import { Register } from "../components/login/Register";
import { motion } from "framer-motion";

export const Startup = () => {

  const [loginModal, setLoginModal] = useState(false)

  const handleLoginModal = () => {
    setLoginModal(!loginModal)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <Dialog
        open={loginModal}
        onClose={handleLoginModal}
        maxWidth="sm"
        fullWidth
      >
        <Login />
      </Dialog>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.2))',
            zIndex: 2,
          },
        }}
      >
        <video src={backgroundVideo} preload="auto" loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay={true} muted></video>
      </Box>
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          p: 2,
          textAlign: 'center',
          color: '#FFFFFF',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h2" component="div" gutterBottom>
            SMART CITY EXPLORER
          </Typography>
        </motion.div>
        <Typography variant="subtitle1" gutterBottom style={{ fontStyle: 'italic', marginTop: '20px' }}>
          Because life's too short to get lost in a city!
        </Typography>
        <Box mt={4}>
          <Tooltip title="Don't be shy, click me!">
            <CButton
              title="Start Exploring"
              onClick={handleLoginModal}
              style={{
                background: '#FFFFFF',
                color: '#008080',
                borderRadius: '20px',
                padding: '10px 30px',
                fontWeight: 'bold',
                transition: '0.3s',
                '&:hover': {
                  background: '#008080',
                  color: '#FFFFFF'
                }
              }}
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
