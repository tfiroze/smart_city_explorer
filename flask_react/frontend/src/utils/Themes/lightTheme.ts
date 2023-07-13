import { createTheme } from '@mui/material';
import { teal } from '@mui/material/colors';

export default createTheme({
  palette: {
    mode: 'light',
    primary: teal,
    secondary: {
      main: '#00796b'
    }
  },  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '10px', // Increase the padding
        },
      },
    },
    MuiSpeedDialAction: {
			styleOverrides: {
				staticTooltipLabel: {
					width: 150,
				},
			},
		},
	},
});
