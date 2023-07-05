import { createTheme } from '@mui/material';
import { teal } from '@mui/material/colors';

export default createTheme({
  palette: {
    mode: 'light',
    primary: teal,
    secondary: {
      main: "#00796b"
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F5F5',
          padding: '10px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h5: {
          fontWeight: 'bold',
          marginBottom: '10px',
        },
      },
    },
  },
});
