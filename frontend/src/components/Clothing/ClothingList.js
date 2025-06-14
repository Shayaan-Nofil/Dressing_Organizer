import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography, Button, TextField, Select, MenuItem, InputLabel, FormControl, Box, Chip, Modal } from '@mui/material';
import ClothingItem from './ClothingItem';
import { useNavigate } from 'react-router-dom';
import { searchItems, getUnusedItems, getLeastWornItems, getWearFrequencyStats } from '../../services/clothing';

function ClothingList() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ tags: '', type: '', color: '', category: '', favorite: '', lastWornBefore: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const navigate = useNavigate();

  const fetchFilteredItems = async () => {
    try {
      const params = {};
      if (filters.tags) params.tags = filters.tags;
      if (filters.type) params.type = filters.type;
      if (filters.color) params.color = filters.color;
      if (filters.category) params.category = filters.category;
      if (filters.favorite) params.favorite = filters.favorite;
      if (filters.lastWornBefore) params.lastWornBefore = filters.lastWornBefore;
      const data = await searchItems(params);
      setItems(data);
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };

  useEffect(() => {
    fetchFilteredItems();
    // eslint-disable-next-line
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchFilteredItems();
  };

  const handleShowUnused = async () => {
    const data = await getUnusedItems();
    setModalTitle('Unused Items (30+ days)');
    setModalContent(data);
    setModalOpen(true);
  };

  const handleShowLeastWorn = async () => {
    const data = await getLeastWornItems();
    setModalTitle('Least Worn Items');
    setModalContent(data);
    setModalOpen(true);
  };

  const handleShowFrequency = async () => {
    const data = await getWearFrequencyStats();
    setModalTitle('Wear Frequency Stats');
    setModalContent(data);
    setModalOpen(true);
  };

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
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField label="Tags (comma-separated)" name="tags" value={filters.tags} onChange={handleFilterChange} size="small" />
        <TextField label="Type" name="type" value={filters.type} onChange={handleFilterChange} size="small" />
        <TextField label="Color" name="color" value={filters.color} onChange={handleFilterChange} size="small" />
        <TextField label="Category" name="category" value={filters.category} onChange={handleFilterChange} size="small" />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Favorite</InputLabel>
          <Select label="Favorite" name="favorite" value={filters.favorite} onChange={handleFilterChange}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Last Worn Before (YYYY-MM-DD)" name="lastWornBefore" value={filters.lastWornBefore} onChange={handleFilterChange} size="small" />
        <Button variant="outlined" onClick={handleSearch}>Search</Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="secondary" onClick={handleShowUnused}>Show Unused Items</Button>
        <Button variant="contained" color="secondary" onClick={handleShowLeastWorn}>Show Least Worn</Button>
        <Button variant="contained" color="info" onClick={handleShowFrequency}>Wear Frequency</Button>
      </Box>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <ClothingItem item={item} onUpdate={fetchFilteredItems} />
          </Grid>
        ))}
      </Grid>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '10%', left: '10%', width: '80%', bgcolor: 'background.paper', p: 4, borderRadius: 2, overflowY: 'auto', maxHeight: '80vh' }}>
          <Typography variant="h6" gutterBottom>{modalTitle}</Typography>
          <Grid container spacing={2}>
            {modalContent.map((item, idx) => (
              <Grid item xs={12} sm={6} md={4} key={item._id || idx}>
                <ClothingItem item={item} onUpdate={fetchFilteredItems} />
              </Grid>
            ))}
          </Grid>
          <Button onClick={() => setModalOpen(false)} sx={{ mt: 2 }}>Close</Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default ClothingList;