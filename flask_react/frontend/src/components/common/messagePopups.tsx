import {
    Grid,
    Typography,
    useTheme,
    styled,
} from "@mui/material";
import React from "react";
import { CButton } from "../common/button";

interface IProps {
    onFirstClick?: () => void,
    onSecondClick?: () => void,
    totalButtons?: number,
    buttonText?: string,
    message?: string,
}

const MessageGrid = styled(Grid)(({ theme }) => ({
    cursor: "pointer",
    padding: theme.spacing(2),
    borderRadius: 15,
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
}));

const ButtonContainer = styled(Grid)(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.palette.secondary.main,
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    }
}));

const StyledCButton = styled(CButton)(({ theme }) => ({
    width: '30%',
    background: '#757de8',
    color: '#ffffff',
    borderRadius: 20,
    padding: theme.spacing(1, 2),
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginBottom: theme.spacing(1),
    }
}));

export const MessagePopups: React.FC<IProps> = ({
    onFirstClick,
    onSecondClick,
    totalButtons = 1,
    buttonText,
    message
}) => {

    const firstButtonClick = () => onFirstClick ? onFirstClick() : console.log('Something went wrong!')
    const secondButtonClick = () => onSecondClick ? onSecondClick() : console.log('Something went wrong!')

    return (
        <MessageGrid item xs={12}>
            <Typography variant="h6" align="center" gutterBottom>
                {message}
            </Typography>
            <ButtonContainer container>
                <StyledCButton
                    title={buttonText ? buttonText : "Select"}
                    onClick={() => { firstButtonClick() }}
                />
                {totalButtons == 2 &&
                    <StyledCButton
                        title="Cancel"
                        onClick={() => { secondButtonClick() }}
                    />
                }
            </ButtonContainer>
        </MessageGrid>
    )
}
