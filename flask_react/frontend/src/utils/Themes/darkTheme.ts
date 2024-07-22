import { createTheme } from '@mui/material';
import { blue, teal } from '@mui/material/colors';

export default createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#757de8', // Update the primary color
    },
    secondary: {
      main: '#161616', // Update the secondary color
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          // backgroundColor: '#535C7C', // Update the background color of Paper component
          // padding: '10px', // Increase the padding
        },
      },
    },
    MuiTypography:{
      styleOverrides:{
        root:{
          color:"#ffff",
        }
      }
    },
    MuiGrid:{
      styleOverrides:{
        root:{
          backgroundColor:'#000000'
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
