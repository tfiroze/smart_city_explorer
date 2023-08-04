import React from "react";
import Profile from "../components/profile/Profile";
import { AuthContext } from "../utils/AuthContext";
import { Header } from "../components/dashboard/Header";
import {
    Button,
    Grid,
    Paper,
    Typography,
    styled,
    Divider,
    Avatar,
    TextField,
} from "@mui/material";

const BackgroundLessGrid = styled(Grid)(({ theme }) => ({
    background: "none",
}));

const EditProfile = () => {
    return (
        <>
            <Paper style={{ padding: "10px" }}>
                <Button variant="outlined"> Return To Dashboard</Button>
            </Paper>

            <div style={{ marginLeft: "15%", marginRight: "15%", marginTop: "30px" }}>
                <BackgroundLessGrid container style={{ background: "none" }}>
                    <BackgroundLessGrid style={{ background: "none" }} item xs={12}>
                        <Typography variant="h5">Your Information</Typography>
                    </BackgroundLessGrid>
                    <BackgroundLessGrid style={{ background: "none" }} item xs={12}>
                        <Paper style={{ padding: "10px" }}>
                            <BackgroundLessGrid container>
                                <BackgroundLessGrid xs={12}>
                                    <BackgroundLessGrid xs={4} md={4}>
                                        <Typography variant="h6">
                                            {/* {authContext.userInfo?.first_name} */}
                                            Thea mothaf... Jaeger
                                        </Typography>
                                    </BackgroundLessGrid>
                                </BackgroundLessGrid>
                                <BackgroundLessGrid
                                    style={{ marginTop: "5px", marginBottom: "5px" }}
                                    xs={12}
                                >
                                    <Divider />
                                </BackgroundLessGrid>
                                <BackgroundLessGrid xs={12}>
                                    <BackgroundLessGrid container>
                                        <BackgroundLessGrid
                                            xs={12}
                                            md={3}
                                            display="flex"
                                            justifyContent="center"
                                            alignContent="center"
                                        >
                                            <Avatar sx={{ width: 150, height: 150 }} />
                                        </BackgroundLessGrid>
                                        <BackgroundLessGrid xs={12} md={9}>
                                            <Typography variant="caption">
                                                Personalize your account with a photo. Your profile
                                                photo will appear on apps and devices that use your{" "}
                                                <span
                                                    style={{
                                                        backgroundColor: "black",
                                                        color: "white",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    Corn
                                                </span>
                                                <span
                                                    style={{
                                                        color: "black",
                                                        backgroundColor: "orange",
                                                        padding: "2px",
                                                    }}
                                                >
                                                    Hub
                                                </span>
                                                account
                                            </Typography>
                                            <br />
                                            <Button variant="contained">
                                                <b />
                                                Edit Picture
                                            </Button>
                                        </BackgroundLessGrid>
                                    </BackgroundLessGrid>
                                </BackgroundLessGrid>
                            </BackgroundLessGrid>
                        </Paper>
                    </BackgroundLessGrid>
                </BackgroundLessGrid>
            </div>

            <div style={{ marginLeft: "15%", marginRight: "15%", marginTop: "30px" }}>
                <BackgroundLessGrid container style={{ background: "none" }}>
                    <BackgroundLessGrid style={{ background: "none" }} item xs={12}>
                        <Typography variant="h5">Security Information</Typography>
                    </BackgroundLessGrid>
                    <BackgroundLessGrid style={{ background: "none" }} item xs={12}>
                        <Paper style={{ padding: "10px" }}>
                            <BackgroundLessGrid container>
                                <BackgroundLessGrid xs={12}>
                                    <BackgroundLessGrid xs={4} md={4}>
                                        <Typography variant="h6">Update Password</Typography>
                                        <BackgroundLessGrid container>
                                            <BackgroundLessGrid xs={6}>
                                                <TextField
                                                    type="password"
                                                    style={{ marginTop: "10px" }}
                                                    fullWidth
                                                    label="Old Password"
                                                    id="fullWidth"
                                                />
                                            </BackgroundLessGrid>
                                            <BackgroundLessGrid xs={6}>
                                                <TextField
                                                    type="password"
                                                    style={{ marginTop: "10px", width: '100%' }}
                                                    fullWidth
                                                    label="New Password"
                                                    id="fullWidth"
                                                />
                                            </BackgroundLessGrid>
                                        </BackgroundLessGrid>
                                        <TextField
                                            type="password"
                                            style={{ marginTop: "10px" }}
                                            fullWidth
                                            label="Confirm New Password"
                                            id="fullWidth"
                                        />
                                    </BackgroundLessGrid>
                                </BackgroundLessGrid>
                            </BackgroundLessGrid>
                        </Paper>
                    </BackgroundLessGrid>
                </BackgroundLessGrid>
            </div>
        </>
    );
};

export default EditProfile;
