import React from 'react';
import { Grid, Paper, Typography, styled, Divider, Avatar, TextField, Box, Button } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImageUploader from 'react-images-upload';
import { useTheme } from '@mui/material/styles';
import Profile from '../components/profile/Profile';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(5),
    margin: 'auto',
    marginTop: theme.spacing(3),
    maxWidth: 800,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    margin: theme.spacing(2, 'auto'),
    backgroundColor: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(2, 'auto'),
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    margin: theme.spacing(2, 0),
}));

const EditProfile = () => {
    const theme = useTheme();
    return (
        <StyledPaper elevation={3}>
            <Divider variant="middle" sx={{ marginBottom: theme.spacing(4) }} />
            <Profile />
            <Grid item xs={12} sm={8}>
            </Grid>
        </StyledPaper>
    );
};

export default EditProfile;
