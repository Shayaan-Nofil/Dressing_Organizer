import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
} from '@mui/material';
import axios from 'axios';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

function CreateOutfitForm() {
  const [formData, setFormData] = useState({
    name: '',
    items: [],
    notes: ''
  });
  const [availableItems, setAvailableItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/clothing-items', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvailableItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      // Adjust these fields as per your formData structure
      data.append('name', formData.name);
      data.append('occasion', formData.occasion);
      data.append('weather', formData.weather);
      data.append('season', formData.season);
      data.append('style', formData.style);
      data.append('notes', formData.notes);
      // Append each itemId separately so backend gets an array
      if (Array.isArray(formData.items)) {
        formData.items.forEach(itemId => data.append('items', itemId));
      }
      // If you have an image upload field
      if (formData.image) {
        data.append('image', formData.image);
      }
      await axios.post('http://localhost:5000/api/outfits', data, {
        headers: {
          Authorization: `Bearer ${token}`
          // Do NOT set Content-Type manually; Axios will set it for FormData
        }
      });
      navigate('/outfits');
    } catch (error) {
      console.error('Error creating outfit:', error);
    }
  };

  const handleItemToggle = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.includes(itemId)
        ? prev.items.filter(id => id !== itemId)
        : [...prev.items, itemId]
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Outfit
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Outfit Name"
            margin="normal"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Notes"
            margin="normal"
            multiline
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Select Items
          </Typography>
          <Grid container spacing={2}>
            {availableItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card
                  variant="outlined"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    bgcolor: formData.items.includes(item._id) ? 'action.selected' : 'background.paper'
                  }}
                  onClick={() => handleItemToggle(item._id)}
                >
                  <Checkbox
                    checked={formData.items.includes(item._id)}
                    onChange={() => handleItemToggle(item._id)}
                  />
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, objectFit: 'cover' }}
                    image={getImageUrl(item.image) || getPlaceholderImage(100, 100)}
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.category}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={formData.items.length === 0}
          >
            Create Outfit
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default CreateOutfitForm;