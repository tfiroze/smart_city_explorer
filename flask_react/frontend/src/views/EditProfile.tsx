import React from 'react';
import { Grid, Paper, Typography, styled, Divider, Avatar, TextField, Box, Button } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImageUploader from 'react-images-upload';
import { useTheme } from '@mui/material/styles';
import Profile from '../components/profile/Profile';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    margin: 'auto',
    marginTop: theme.spacing(3),
    maxWidth: 800,
    backgroundColor: theme.palette.background.default,
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    margin: theme.spacing(2, 'auto'),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(2, 'auto'),
}));

const StyledReturnButton = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    margin: theme.spacing(1, 0),
}));

const EditProfile = () => {
    const theme = useTheme();
    return (
        <StyledPaper elevation={3}>
            <Profile />
            {/* <StyledReturnButton variant="outlined" size="small">Return To Dashboard</StyledReturnButton> */}
            {/* <Typography variant="h5" align="center" gutterBottom>Your Information</Typography> */}
            <StyledGrid container spacing={3}>
                {/* <StyledGrid item xs={12} sm={4} md={4}>
                    <StyledAvatar />
                    <ImageUploader
                        buttonText='Upload Image'
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                    />
                    <StyledButton variant="contained" color="primary">Edit Picture</StyledButton>
                </StyledGrid> */}
                {/* <StyledGrid item xs={12} sm={8} md={8}>
                    <Box display="flex" alignItems="center">
                        <AccountCircleIcon fontSize="large" />
                        <Box ml={2}>
                            <Typography variant="h6">Jane Doe</Typography>
                            <Typography variant="subtitle2">Personal Account</Typography>
                        </Box>
                    </Box>
                </StyledGrid> */}
                {/* </StyledGrid> */}
                <Divider variant="middle" />
                {/* <Typography variant="h5" align="center" gutterBottom>Security Information</Typography> */}

                {/* <StyledGrid container spacing={3}>
                <StyledGrid item xs={12} md={6}>
                    <Divider></Divider>
                    <Typography variant="h6" gutterBottom>Update Password</Typography>
                    <StyledTextField
                        type="password"
                        fullWidth
                        label="Old Password"
                        variant="outlined"
                    /> */}
                {/* <StyledTextField
                        type="password"
                        fullWidth
                        label="New Password"
                        variant="outlined"
                    /> */}
                {/* <StyledTextField
                        type="password"
                        fullWidth
                        label="Confirm New Password"
                        variant="outlined"
                    />
                </StyledGrid> */}
            </StyledGrid>
        </StyledPaper >
    );
};

export default EditProfile;
