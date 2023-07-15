import React from 'react';
import { Avatar, Button, Chip, Grid, Typography } from '@mui/material';
import { CheckCircleOutline, Description, People } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import IVenueItem from '../../../models/IVenueItem';

const Container = styled('div')`
  max-width: 700px;
  margin: 0 auto;
  padding: 16px;
  background-color: #f4f4f4;
  border-radius: 8px;
  color: ${({ theme }) =>
    theme.palette.mode === 'dark' ? '#555' : 'inherit'};
`;

const Header = styled(Typography)`
  margin-bottom: 24px;
  color: #333;
  font-weight: bold;
`;

const ItemContainer = styled(Grid)`
  margin-bottom: 16px;
`;

const ConfirmButton = styled(Button)`
  margin-top: 24px;
  background-color: #176B87; 
  color: #fff;
  &:hover {
    background-color: #114c62; 
  }
`;

const VenueChip = styled(Chip)`
  margin: 5px;
  background-color: #fff;
  border: 1px solid #ccc;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const IconContainer = styled(Grid)`
  display: flex;
  align-items: center;
`;

const TextContainer = styled(Grid)`
  margin-left: 8px;
  color: ${({ theme }) =>
    theme.palette.mode === 'dark' ? '#555' : 'inherit'};
`;


interface IProps {
  moveNext: () => void;
  newItemDetails: IVenueItem;
  updateNewItem: (item: IVenueItem) => void;
  onConfirm: () => void;
}

export const ConfirmNewItem: React.FC<IProps> = ({
  moveNext,
  newItemDetails,
  updateNewItem,
  onConfirm,
}) => {
  return (
    <Container>
      <Header variant="h6" gutterBottom>
        Confirm Details
      </Header>
      <ItemContainer container alignItems="center">
        <IconContainer item>
          <People fontSize="small" />
        </IconContainer>
        <TextContainer item>
          <Typography variant="body2">
            {newItemDetails.timeFrom} To {newItemDetails.timeTo}
          </Typography>
        </TextContainer>
      </ItemContainer>
      <ItemContainer container alignItems="center">
        <IconContainer item>
          <Description fontSize="small" />
        </IconContainer>
        <TextContainer item>
          <Typography variant="body2">
            <strong>Venue:</strong> {newItemDetails.title}
          </Typography>
        </TextContainer>
      </ItemContainer>
      <ItemContainer>
        <Typography variant="body2">
          <strong>Description:</strong>
        </Typography>
        <Typography variant="body2">
          {newItemDetails.description}
        </Typography>
      </ItemContainer>
      <ItemContainer>
        <Typography variant="body2">
          <strong>Invited:</strong>
        </Typography>
        <Grid container spacing={1}>
          {newItemDetails.invitedParticipant!.map((item, index) => (
            <Grid item key={index}>
              <VenueChip
                avatar={<Avatar alt={item} />}
                label={item}
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
      </ItemContainer>
      <ConfirmButton
        onClick={onConfirm}
        variant="contained"
        startIcon={<CheckCircleOutline />}
      >
        Confirm
      </ConfirmButton>
    </Container>
  );
};
