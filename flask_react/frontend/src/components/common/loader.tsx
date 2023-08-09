import { AccountCircle } from "@mui/icons-material";
import {
	Grid,
	Paper,
	Typography,
	TextField,
	InputAdornment,
	FormControlLabel,
	Checkbox,
	Button,
} from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, useState, useContext, useEffect } from "react";
import Lottie from 'react-lottie';
import animationData from '../../resources/lottie/loader_pin.json';

export const Loader = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
    
    return (
      <div style={{width:'100vw', height:'100vh', display:'flex', alignItems:'center', background:'transparent'}}>
        <Lottie 
          options={defaultOptions}
          height={200}
          width={200}
        />
      </div>
    );
};
