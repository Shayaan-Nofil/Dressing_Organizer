import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AddClothingForm from './AddClothingForm';

function ClothingList() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Add this line
      const response = await axios.get(`http://localhost:5000/api/items/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleItemAdded = (newItem) => {
    setItems([...items, newItem]);
  };

  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  return (
    <Container>
      <AddClothingForm onItemAdded={handleItemAdded} />
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Clothing Items
        </Typography>
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card>
                {item.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imageUrl}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography color="textSecondary">{item.category}</Typography>
                      <Typography variant="body2">
                        {item.color && `Color: ${item.color}`}<br />
                        {item.size && `Size: ${item.size}`}<br />
                        {item.brand && `Brand: ${item.brand}`}<br />
                        {item.season && `Season: ${item.season.join(', ')}`}
                      </Typography>
                      {item.tags && item.tags.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            Tags: {item.tags.join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </div>
                    <IconButton onClick={() => handleDelete(item._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default ClothingList;