import { createTheme } from '@mui/material';
import { teal } from '@mui/material/colors';

export default createTheme({
  palette: {
    mode: 'light',
    primary:{main: '#757de8'},
    secondary: {
      main: '#f5f5f5'
    }
  },  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          // padding: '10px', // Increase the padding
        },
      },
    },
    MuiTypography:{
      styleOverrides:{
        root:{
          color:"#333333"
        }
      }
    },
    MuiGrid:{
      styleOverrides:{
        root:{
          backgroundColor:'#ffffff'
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
	},
});
