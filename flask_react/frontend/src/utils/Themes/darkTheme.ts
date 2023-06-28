import { createTheme } from '@mui/material';
import { blue, green } from '@mui/material/colors';

export default createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main:'#242D3E'
    },
    secondary: {
      main:'#115b4c'
    },
  },
  components:{
    MuiPaper:{
     styleOverrides:{
       root:{
         backgroundColor:'#535C7C',
         padding:'5px'
       }
     } 
    }
  }
});

