import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useDividerStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: '20px 0',
        alignItems: 'center',
        display: 'flex',
    },
    divider: {
        flexGrow: 1,
    },
    text: {
        margin: '0 10px',
        fontWeight: 500,
    }
}));

interface StyledDividerProps {
    text: string;
    icon: React.ReactElement;
}

const StyledDivider: React.FC<StyledDividerProps> = ({ text, icon }) => {
    const classes = useDividerStyles();

    return (
        <Box className={classes.root}>
            <Divider className={classes.divider} />
            {icon}
            <Typography variant="body1" className={classes.text}>
                {text}
            </Typography>
            <Divider className={classes.divider} />
        </Box>
    );
}

export default StyledDivider;
