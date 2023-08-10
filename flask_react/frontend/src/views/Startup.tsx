import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery
} from "@mui/material";
import backgroundVideo from "../resources/video/ManhattanVideo.mp4";
import { CButton } from "../components/common/button";
import { Login } from "./Login";
import { motion } from "framer-motion";

interface BackgroundVideoProps {
  src: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ src }) => {
  return (
    <video
      src={src}
      preload="auto"
      loop
      autoPlay={true}
      muted
      aria-label="Background video"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 1
      }}
    ></video>
  );
};


export const Startup = () => {
  const [loginModal, setLoginModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLoginModal = () => setLoginModal(!loginModal);

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
        flexDirection: 'column',
        zIndex: 3,
        p: 2,
        textAlign: 'center',
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

      <BackgroundVideo src={backgroundVideo} />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0,0,0,0.1))',
          zIndex: 2
        }}
      ></Box>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          zIndex: 3,
          padding: isMobile ? 2 : 4,  // sit hier by vir responsive goed wat krediet dief leunaar vir my gevra het 
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <Typography variant="h2" component="div" style={{ color: 'white' }}>
            SMART CITY EXPLORER
          </Typography>
        </motion.div>
        <Typography variant="subtitle1" style={{ fontStyle: 'italic', marginTop: '20px', color: 'white' }}>
          Amidst Manhattan's buzz, let's seize every moment!
        </Typography>
        <Box mt={isMobile ? 2 : 4}>
          <Tooltip title="Don't be shy, click me!">
            <CButton
              aria-label="Start Exploring"
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
