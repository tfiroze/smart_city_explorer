import { createTheme } from '@mui/material';
import { blue, teal } from '@mui/material/colors';

export default createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#242D3E', // Update the primary color
    },
    secondary: {
      main: '#00796b', // Update the secondary color
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#535C7C', // Update the background color of Paper component
          padding: '10px', // Increase the padding
        },
      },
    },
  },
});
