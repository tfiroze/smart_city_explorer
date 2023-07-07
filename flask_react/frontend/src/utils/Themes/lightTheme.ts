import { createTheme } from '@mui/material';
import { teal } from '@mui/material/colors';

export default createTheme({
  palette: {
    mode: 'light',
    primary: teal,
    secondary: {
      main: "#176B87"
    }
  },  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '10px', // Increase the padding
        },
      },
    },
  },
});
