import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Input } from '@mui/material';
import axios from 'axios';

function AddClothingForm({ onItemAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    color: '',
    brand: '',
    size: '',
    material: '',
    season: [],
    imageUrl: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const categories = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'];
  const seasons = ['spring', 'summer', 'fall', 'winter'];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(file);
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/items', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onItemAdded) {
        onItemAdded(response.data);
      }
      setFormData({
        name: '',
        category: '',
        color: '',
        brand: '',
        size: '',
        material: '',
        season: [],
        imageUrl: '',
        tags: ''
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Add New Clothing Item
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Item Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            label="Color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Size"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Material"
            value={formData.material}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            select
            SelectProps={{ multiple: true }}
            label="Season"
            value={formData.season}
            onChange={(e) => setFormData({ ...formData, season: e.target.value })}
          >
            {seasons.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="Enter image URL or upload a file"
          />
          <Input
            type="file"
            onChange={handleFileChange}
            sx={{ mt: 2, mb: 2 }}
            accept="image/*"
          />
          <TextField
            margin="normal"
            fullWidth
            label="Tags (comma-separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Item
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddClothingForm;