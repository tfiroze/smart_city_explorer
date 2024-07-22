import { useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useCallback } from "react";

// Create theme outside of the component
export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1500
    },
  },
});

// Custom hook for dynamic font size



const style = (mod: string, fontSize:string)=> createTheme({
    palette: {
      mode: mod == 'light' ? 'light' : 'dark',
      primary: {
        main: '#757de8', // Update the primary color
      },
      secondary: {
        main: mod == 'dark' ? '#161616' : '#f5f5f5', // Update the secondary color
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor:mod == 'dark' ? '#535C7C' : '#f5f5f5', // Update the background color of Paper component
            // padding: '10px', // Increase the padding
          },
        },
      },
      MuiTypography:{
        styleOverrides:{
          root:{
            color:mod == "light" ? "#333333": "#ffff",
            fontSize: fontSize,
            // fontFamily: "Roboto", "Helvetica", "Arial", sans-serif,
            fontFamily: "Helvetica, sans-serif"
          }
        }
      },
      MuiGrid:{
        styleOverrides:{
          root:{
            backgroundColor:mod == 'dark' ? '#000000' : '#f5f5f5'
          }
        }
      },
      MuiDialog:{
        // MuiPaper-root-MuiDialog-paper
        styleOverrides:{
          root:{
            backgroundColor:mod == 'dark' ? '#535C7C' : '#f5f5f5'
          }
        }
      },
  
      MuiSpeedDialAction: {
        styleOverrides: {
          staticTooltipLabel: {
            width: 150,
          },
        },
      },
      MuiStepper: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
          },
        },
      },
      MuiStepConnector: {
        styleOverrides: {
          line: {
            borderColor: '#ddd',
          },
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          label: {
            color: '#555',
            fontWeight: 'bold',
          },
        },
      },
    },
  });


  export default style