
import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography, Button } from '@mui/material';
import OutfitItem from './OutfitItem';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OutfitList() {
  const [outfits, setOutfits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/outfits', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOutfits(response.data);
      } catch (error) {
        console.error('Error fetching outfits:', error);
      }
    };

    fetchOutfits();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Outfits
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/create-outfit')}
        sx={{ mb: 3 }}
      >
        Create New Outfit
      </Button>
      <Grid container spacing={3}>
        {outfits.map((outfit) => (
          <Grid item xs={12} sm={6} md={4} key={outfit._id}>
            <OutfitItem outfit={outfit} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default OutfitList;