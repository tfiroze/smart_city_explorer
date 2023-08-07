import {
    Grid,
    Typography,
    Paper,
    Checkbox,
    Divider,
    Alert,
    styled,
    useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { CButton } from "../common/button";



interface IProps {
    onFirstClick?: ()=>void;
    onSecondClick?: ()=>void;
    totalButtons?: number;
    buttonText?:string;
    message?:string
}

export const MessagePopups :React.FC<IProps> = ({
  onFirstClick,
  onSecondClick,
  totalButtons = 1,
  buttonText,
  message
})  => {
    
    const currentTheme = useTheme();
    const firstButtonClick = ()=> onFirstClick? onFirstClick():console.log('Something went wrong!')
    const secondButtonClick = ()=>onSecondClick? onSecondClick():console.log('Something went wrong!')

    return (
        <Grid
            style={{ cursor: "pointer", padding: '20px', borderRadius: '15px', margin: '10px', backgroundColor: currentTheme.palette.secondary.main }}
            item
            xs={12}
            onClick={() => {}}
        >
            <Typography variant="h6" align="center" style={{margin:'10px 0'}}>{message}</Typography>
            <Grid container style={{ flexDirection: 'row', justifyContent:totalButtons ==2 ? 'space-between' : 'center', backgroundColor: currentTheme.palette.secondary.main }}>
                <CButton
                    title={ buttonText?buttonText : "Select"}
                    onClick={() => {firstButtonClick()}}
                    style={{
                        width: '30%',
                        background: '#757de8',
                        color: '#ffffff',
                        borderRadius: '20px',
                        padding: '10px 10px',
                        fontWeight: 'bold',
                    }}
                />
                {totalButtons==2 && <CButton
                    title="Cancel"
                    onClick={() => {secondButtonClick()}}
                    style={{
                        width: '30%',
                        background: '#757de8',
                        color: '#ffffff',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        fontWeight: 'bold',
                    }}
                />}
            </Grid>

        </Grid>
    )
}