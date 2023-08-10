import { SxProps } from '@mui/system';
import { styled } from '@mui/material/styles';
import {
    Grid,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    Button,
} from "@mui/material";
import { CButton } from "../components/common/button";


export const StyledPaper = styled(Paper)(({ theme }) => ({
    // background: '#f7f7f7',
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(2),
    },
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(2, 0),
}));

export const StyledButton = styled(CButton)(({ theme }) => ({
    background: '#757de8',
    color: 'white',
}));

export const StyledLink = styled(Typography)({
    cursor: 'pointer',
});


