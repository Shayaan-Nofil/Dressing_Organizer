import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function OutfitItem({ outfit }) {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/outfits/${outfit._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting outfit:', error);
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Typography variant="h6" component="div">
          {outfit.name}
        </Typography>
        <IconButton onClick={handleDelete} color="error" size="small">
          <DeleteIcon />
        </IconButton>
      </Box>
      <CardContent>
        <Grid container spacing={2}>
          {outfit.items.map((item) => (
            <Grid item xs={6} key={item._id}>
              <Card variant="outlined">
                <CardMedia
                  component="img"
                  height="100"
                  image={item.imageUrl || 'https://via.placeholder.com/100'}
                  alt={item.name}
                />
                <CardContent>
                  <Typography variant="body2">{item.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {outfit.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Notes: {outfit.notes}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default OutfitItem;