import React, { useState, useEffect } from 'react';
import './Outfits.css';
import { getOutfitSuggestions, getOutfitHistory, getAllOutfits } from '../../services/outfits';
import { Box, Tabs, Tab, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';

const Outfits = () => {
  const [tab, setTab] = useState(0);
  const [outfits, setOutfits] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [clothingItems, setClothingItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOutfit, setNewOutfit] = useState({ name: '', occasion: '', weather: '', notes: '', season: '', style: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    fetchOutfits();
    fetchClothingItems();
  }, []);

  // Fetch all clothing items for AI suggestions
  const fetchClothingItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setClothingItems(data);
      } else {
        setClothingItems([]);
      }
    } catch (error) {
      setClothingItems([]);
    }
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    setLoading(true);
    try {
      const data = await getAllOutfits();
      setOutfits(data);
    } catch (error) {
      setOutfits([]);
    }
    setLoading(false);
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const data = await getOutfitSuggestions();
      setSuggestions(data);
    } catch (error) {
      setSuggestions([]);
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getOutfitHistory();
      setHistory(data);
    } catch (error) {
      setHistory([]);
    }
    setLoading(false);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    if (newValue === 1 && suggestions.length === 0) fetchSuggestions();
    if (newValue === 2 && history.length === 0) fetchHistory();
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOutfit(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setMessage('Please select at least one item for the outfit.');
      setMessageType('error');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const body = {
        ...newOutfit,
        items: selectedItems,
      };
      const response = await fetch('http://localhost:5000/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        await fetchOutfits();
        setShowAddForm(false);
        setSelectedItems([]);
        setNewOutfit({ name: '', occasion: '', weather: '', notes: '', season: '', style: '' });
        setMessage('Outfit created successfully!');
        setMessageType('success');
      } else {
        setMessage('Error creating outfit. Please check your input.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error creating outfit. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // AI Suggestion: pick a random item from each type (top, bottom, shoes)
  const handleSuggestOutfit = () => {
    const tops = clothingItems.filter(item => ['Shirt', 'T-shirt', 'Blouse', 'Sweater', 'Jacket', 'Coat', 'Blazer'].includes(item.type));
    const bottoms = clothingItems.filter(item => ['Pants', 'Jeans', 'Shorts', 'Skirt'].includes(item.type));
    const shoes = clothingItems.filter(item => ['Shoes', 'Boots', 'Sandals', 'Sneakers', 'Heels'].includes(item.type));
    const pick = arr => arr.length ? arr[Math.floor(Math.random() * arr.length)]._id : null;
    const suggestion = [pick(tops), pick(bottoms), pick(shoes)].filter(Boolean);
    if (suggestion.length < 2) {
      setMessage('Not enough variety in your wardrobe for an intelligent suggestion.');
      setMessageType('error');
      return;
    }
    setSelectedItems(suggestion);
    setShowAddForm(true);
    setMessage('AI suggested an outfit! You can edit or save it.');
    setMessageType('success');
  };

  return (
    <Box className="outfits-container" sx={{ mt: 4 }}>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="My Outfits" />
        <Tab label="Suggestions" />
        <Tab label="History & Analytics" />
      </Tabs>
      <Box sx={{ mt: 3 }}>
        {tab === 0 && (
          <>
            <Typography variant="h5" gutterBottom>My Outfits</Typography>
            {loading ? <CircularProgress /> : (
              <Grid container spacing={2}>
                {outfits.map((outfit) => (
                  <Grid item xs={12} sm={6} md={4} key={outfit._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{outfit.name}</Typography>
                        <Typography variant="body2">Occasion: {outfit.occasion}</Typography>
                        <Typography variant="body2">Season: {outfit.season}</Typography>
                        <Typography variant="body2">Weather: {outfit.weather}</Typography>
                        <Typography variant="body2">Style: {outfit.style}</Typography>
                        <Typography variant="body2">Notes: {outfit.notes}</Typography>
                        <Typography variant="body2">Items: {outfit.items && outfit.items.map(i => i.name).join(', ')}</Typography>
                        <Typography variant="body2">Rating: {outfit.rating || 'N/A'}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
        {tab === 1 && (
          <>
            <Typography variant="h5" gutterBottom>Outfit Suggestions</Typography>
            {loading ? <CircularProgress /> : suggestions.length === 0 ? <Typography>No suggestions available.</Typography> : (
              <Grid container spacing={2}>
                {suggestions.map((pair, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1">Suggestion {idx + 1}</Typography>
                        <Typography variant="body2">
                          {pair.map(item => item.name).join(' + ')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
        {tab === 2 && (
          <>
            <Typography variant="h5" gutterBottom>Outfit History & Analytics</Typography>
            {loading ? <CircularProgress /> : history.length === 0 ? <Typography>No history available.</Typography> : (
              <Grid container spacing={2}>
                {history.map((outfit, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={outfit.id || idx}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{outfit.name}</Typography>
                        <Typography variant="body2">Items: {outfit.items && outfit.items.map(i => i.name).join(', ')}</Typography>
                        <Typography variant="body2">Rating: {outfit.rating || 'N/A'}</Typography>
                        <Typography variant="body2">Notes: {outfit.notes}</Typography>
                        <Typography variant="body2">Created: {outfit.dateCreated ? new Date(outfit.dateCreated).toLocaleDateString() : 'N/A'}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Outfits;