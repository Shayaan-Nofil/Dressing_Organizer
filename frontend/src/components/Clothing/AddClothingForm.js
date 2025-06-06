import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack
} from '@mui/material';
import axios from 'axios';

function AddClothingForm() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    color: '',
    brand: '',
    size: '',
    material: '',
    season: [],
    imageUrl: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  const categories = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'];
  const seasons = ['spring', 'summer', 'fall', 'winter'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/items', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/clothes');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToDelete)
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Clothing Item
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Color"
            margin="normal"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
          <TextField
            fullWidth
            label="Brand"
            margin="normal"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          />
          <TextField
            fullWidth
            label="Size"
            margin="normal"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          />
          <TextField
            fullWidth
            label="Material"
            margin="normal"
            value={formData.material}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Seasons</InputLabel>
            <Select
              multiple
              value={formData.season}
              label="Seasons"
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
            >
              {seasons.map((season) => (
                <MenuItem key={season} value={season}>
                  {season.charAt(0).toUpperCase() + season.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Image URL"
            margin="normal"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Add Tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <Button
              variant="outlined"
              onClick={handleAddTag}
              sx={{ mt: 1 }}
            >
              Add Tag
            </Button>
          </Box>
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
            {formData.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
              />
            ))}
          </Stack>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            Add Item
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddClothingForm;