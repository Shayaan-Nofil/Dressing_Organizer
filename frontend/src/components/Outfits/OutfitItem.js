import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box, Grid, Button, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios';
import { getImageUrl, getOutfitImageUrl, getPlaceholderImage } from '../../utils/imageUtils';
import SocialSharingDialog from '../Social/SocialSharingDialog';

function OutfitItem({ outfit }) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
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
        <Box>
          <Tooltip title="Share Outfit">
            <IconButton onClick={() => setShareDialogOpen(true)} color="primary" size="small">
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={handleDelete} color="error" size="small">
            <DeleteIcon />
          </IconButton>
          <Button onClick={async () => {
            try {
              const token = localStorage.getItem('token');
              await axios.patch(`http://localhost:5000/api/outfits/${outfit._id}/mark-worn`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              });
              window.location.reload();
            } catch (error) {
              console.error('Error marking as worn:', error);
            }
          }} color="success" size="small" sx={{ ml: 1 }}>
            Mark as Worn
          </Button>
        </Box>
      </Box>
      <CardContent>
        <Grid container spacing={2}>
          {outfit.items.map((item) => (
            <Grid item xs={6} key={item._id}>
              <Card variant="outlined">
                <CardMedia
                  component="img"
                  height="100"
                  image={getImageUrl(item.image) || getPlaceholderImage(100, 100)}
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
      
      <SocialSharingDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        type="outfit"
        outfit={{
          id: outfit._id,
          name: outfit.name,
          occasion: outfit.occasion,
          weather: outfit.weather,
          items: outfit.items
        }}
      />
    </Card>
  );
}

export default OutfitItem;