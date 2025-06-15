import React, { useState, useEffect } from 'react';
import { generateOutfitSuggestion } from '../../services/gemini';
import { getAllItems } from '../../services/clothing';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';
import { 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress, 
  Alert, 
  Typography, 
  Box
} from '@mui/material';
import { Refresh as RefreshIcon, Favorite as FavoriteIcon } from '@mui/icons-material';

const OutfitGenerator = ({ onSaveOutfit }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [outfit, setOutfit] = useState(null);
  
  const [filters, setFilters] = useState({
    occasion: 'casual',
    weather: 'moderate',
    style: ''
  });

  // Fetch user's clothing items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        
        const response = await getAllItems(token);
        setItems(response || []);
      } catch (err) {
        setError('Failed to load clothing items');
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleGenerate = async () => {
    if (items.length === 0) {
      setError('Please add some clothing items first');
      return;
    }

    try {
      setGenerating(true);
      setError('');
      
      // Filter items based on selected filters
      const filteredItems = items.filter(item => {
        // For weather filtering, only filter if a specific weather is selected (not 'moderate')
        if (filters.weather && filters.weather !== 'moderate') {
          // Map weather to seasons - be more permissive
          const weatherToSeason = {
            'hot': ['summer'],
            'warm': ['spring', 'summer'],
            'cool': ['fall', 'spring'], 
            'cold': ['winter']
          };
          const expectedSeasons = weatherToSeason[filters.weather];
          
          if (expectedSeasons && item.season && !expectedSeasons.includes(item.season.toLowerCase())) {
            return false;
          }
        }
        
        // For now, we'll be very permissive and allow most items through
        // You can add more sophisticated filtering later based on tags or categories
        return true;
      });

      console.log('Total items:', items.length);
      console.log('Filtered items:', filteredItems.length);
      console.log('Current filters:', filters);
      console.log('Sample items:', items.slice(0, 2));

      if (filteredItems.length < 1) {
        throw new Error(`Not enough items match the selected filters. Found ${filteredItems.length} items out of ${items.length} total.`);
      }

      // Generate outfit using AI
      const suggestion = await generateOutfitSuggestion(filteredItems, filters);
      setOutfit({
        ...suggestion,
        items: suggestion.items.map(id => filteredItems.find(item => item._id === id)).filter(Boolean)
      });
    } catch (err) {
      setError(err.message || 'Failed to generate outfit suggestion');
      console.error('Error generating outfit:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!outfit) return;
    
    try {
      const result = await onSaveOutfit({
        name: `AI Generated Outfit - ${new Date().toLocaleDateString()}`,
        occasion: filters.occasion,
        weather: filters.weather,
        style: filters.style,
        items: outfit.items.map(item => item._id),
        isAI: true
      });
      
      if (result && result.success) {
        setOutfit(null);
        setFilters({ occasion: 'casual', weather: 'moderate', style: '' });
      }
    } catch (err) {
      console.error('Error saving outfit:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>AI Outfit Generator</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Occasion</InputLabel>
              <Select
                value={filters.occasion}
                label="Occasion"
                onChange={(e) => setFilters({...filters, occasion: e.target.value})}
              >
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="formal">Formal</MenuItem>
                <MenuItem value="sport">Sport</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Weather</InputLabel>
              <Select
                value={filters.weather}
                label="Weather"
                onChange={(e) => setFilters({...filters, weather: e.target.value})}
              >
                <MenuItem value="hot">Hot</MenuItem>
                <MenuItem value="warm">Warm</MenuItem>
                <MenuItem value="moderate">Moderate</MenuItem>
                <MenuItem value="cool">Cool</MenuItem>
                <MenuItem value="cold">Cold</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Style (Optional)</InputLabel>
              <Select
                value={filters.style}
                label="Style (Optional)"
                onChange={(e) => setFilters({...filters, style: e.target.value})}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Any style</em>
                </MenuItem>
                <MenuItem value="minimalist">Minimalist</MenuItem>
                <MenuItem value="streetwear">Streetwear</MenuItem>
                <MenuItem value="classic">Classic</MenuItem>
                <MenuItem value="Fancy">Fancy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box display="flex" justifyContent="space-between" mb={outfit ? 2 : 0}>
          <Button 
            variant="contained" 
            onClick={handleGenerate}
            disabled={generating || items.length === 0}
            startIcon={<RefreshIcon />}
          >
            {generating ? 'Generating...' : 'Generate Outfit'}
            {generating && <CircularProgress size={24} sx={{ ml: 1 }} />}
          </Button>
          
          {outfit && (
            <Button 
              variant="contained" 
              color="success"
              onClick={handleSave}
              disabled={generating}
              startIcon={<FavoriteIcon />}
            >
              Save Outfit
            </Button>
          )}
        </Box>
        
        {outfit && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>Generated Outfit</Typography>
            <Grid container spacing={2}>
              {outfit.items.map((item, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={getImageUrl(item.image) || getPlaceholderImage(150, 140)}
                      alt={item.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="subtitle2" noWrap>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.category}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {outfit.reasoning && (
              <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                <Typography variant="subtitle2" gutterBottom>Why this works:</Typography>
                <Typography variant="body2">{outfit.reasoning}</Typography>
              </Box>
            )}
          </Box>
        )}
        
        {items.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No clothing items found. Please add some items to your wardrobe first.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default OutfitGenerator;
