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
    type: '',
    category: '',
    color: '',
    brand: '',
    size: '',
    season: [],
    condition: '',
    purchaseDate: '',
    price: '',
    notes: '',
    tags: [],
    image: null
  });
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  const types = ['Shirt', 'T-shirt', 'Blouse', 'Sweater', 'Jacket', 'Coat', 'Blazer', 'Pants', 'Jeans', 'Shorts', 'Skirt', 'Dress', 'Jumpsuit', 'Suit', 'Shoes', 'Sneakers', 'Boots', 'Sandals', 'Heels', 'Flats', 'Bag', 'Belt', 'Hat', 'Scarf', 'Gloves', 'Jewelry', 'Watch', 'Other'];
  const categories = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'];
  const seasons = ['spring', 'summer', 'fall', 'winter'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('type', formData.type);
      fd.append('category', formData.category);
      fd.append('color', formData.color);
      fd.append('brand', formData.brand);
      fd.append('size', formData.size);
      fd.append('season', formData.season.join(','));
      fd.append('condition', formData.condition);
      fd.append('purchaseDate', formData.purchaseDate);
      fd.append('price', formData.price);
      fd.append('notes', formData.notes);
      if (formData.tags.length > 0) fd.append('tags', formData.tags.join(','));
      if (formData.image) fd.append('image', formData.image);
      await axios.post('http://localhost:5000/api/clothing-items', fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/clothes');
    } catch (error) {
      console.error('Error adding item:', error?.response?.data || error);
      alert('Error adding item: ' + (error?.response?.data?.message || error.message));
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
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
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            label="Condition"
            margin="normal"
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          />
          <TextField
            fullWidth
            label="Purchase Date"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            margin="normal"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <TextField
            fullWidth
            label="Notes"
            margin="normal"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button variant="outlined" component="label">
              {formData.image ? formData.image.name : 'Upload Image'}
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
          </Box>
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