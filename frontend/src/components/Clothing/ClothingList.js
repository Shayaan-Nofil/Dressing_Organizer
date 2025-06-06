import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography, Button } from '@mui/material';
import ClothingItem from './ClothingItem';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ClothingList() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/items', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Wardrobe
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/add-clothing')}
        sx={{ mb: 3 }}
      >
        Add New Item
      </Button>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <ClothingItem item={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ClothingList;