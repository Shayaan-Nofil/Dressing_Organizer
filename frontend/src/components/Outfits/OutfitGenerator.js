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
  Box,
  TextField,
  Chip,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Refresh as RefreshIcon, 
  Favorite as FavoriteIcon,
  AutoAwesome as MagicIcon,
  Tune as TuneIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { 
  ModernCard, 
  ModernButton, 
  modernBlue, 
  gradients,
  responsiveTypography,
  responsiveSpacing,
  shadows
} from '../../theme/modernDesign';

// Styled Components
const GeneratorContainer = styled(Box)(({ theme }) => ({
  ...responsiveSpacing.sectionPadding,
}));

const FilterSection = styled(ModernCard)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: gradients.primary,
  color: 'white',
  '& .MuiFormControl-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.8)',
    },
    '& .MuiSelect-root': {
      color: 'white',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    }
  }
}));

const GenerateButton = styled(ModernButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-3px)',
  }
}));

const OutfitResultCard = styled(ModernCard)(({ theme }) => ({
  marginTop: theme.spacing(3),
  overflow: 'visible',
}));

const ClothingItemCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark' ? shadows.smallDark : shadows.small,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark' ? shadows.mediumDark : shadows.medium,
  }
}));

const OutfitPreview = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: gradients.accent,
  color: 'white',
  borderRadius: 20,
  marginBottom: theme.spacing(3),
  textAlign: 'center',
}));

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
    <GeneratorContainer>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <MagicIcon sx={{ fontSize: '3rem', color: modernBlue.primary, mb: 2 }} />
        <Typography variant="h4" sx={{ ...responsiveTypography.title, mb: 1 }}>
          AI Outfit Generator
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Let AI create perfect outfits based on your preferences and wardrobe
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Filter Section */}
      <FilterSection>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TuneIcon sx={{ fontSize: '1.5rem' }} />
          <Typography variant="h6" sx={{ ...responsiveTypography.subtitle }}>
            Customize Your Outfit
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Occasion</InputLabel>
              <Select
                value={filters.occasion}
                label="Occasion"
                onChange={(e) => setFilters({...filters, occasion: e.target.value})}
              >
                <MenuItem value="casual">🏠 Casual</MenuItem>
                <MenuItem value="business">💼 Business</MenuItem>
                <MenuItem value="formal">🎩 Formal</MenuItem>
                <MenuItem value="sport">🏃 Sport</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Weather</InputLabel>
              <Select
                value={filters.weather}
                label="Weather"
                onChange={(e) => setFilters({...filters, weather: e.target.value})}
              >
                <MenuItem value="hot">☀️ Hot</MenuItem>
                <MenuItem value="warm">🌤️ Warm</MenuItem>
                <MenuItem value="moderate">⛅ Moderate</MenuItem>
                <MenuItem value="cool">🌥️ Cool</MenuItem>
                <MenuItem value="cold">❄️ Cold</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
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
                <MenuItem value="minimalist">✨ Minimalist</MenuItem>
                <MenuItem value="streetwear">🎨 Streetwear</MenuItem>
                <MenuItem value="classic">👔 Classic</MenuItem>
                <MenuItem value="Fancy">💎 Fancy</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {/* Generate Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <GenerateButton 
            onClick={handleGenerate}
            disabled={generating || items.length === 0}
            startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <MagicIcon />}
            size="large"
          >
            {generating ? 'Creating Magic...' : 'Generate Outfit'}
          </GenerateButton>
        </Box>
      </FilterSection>
      
      {/* Generated Outfit Result */}
      {outfit && (
        <OutfitResultCard>
          <OutfitPreview>
            <Typography variant="h5" sx={{ ...responsiveTypography.subtitle, mb: 1 }}>
              ✨ Your Perfect Outfit
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Curated by AI for {filters.occasion} occasions in {filters.weather} weather
            </Typography>
          </OutfitPreview>
          
          <CardContent>
            <Grid container spacing={3}>
              {outfit.items.map((item, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <ClothingItemCard>
                    <CardMedia
                      component="img"
                      height="160"
                      image={getImageUrl(item.image) || getPlaceholderImage(150, 160)}
                      alt={item.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {item.name}
                      </Typography>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </CardContent>
                  </ClothingItemCard>
                </Grid>
              ))}
            </Grid>
            
            {/* Save Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <ModernButton
                variant="success"
                onClick={handleSave}
                disabled={generating}
                startIcon={<SaveIcon />}
                size="large"
              >
                Save This Outfit
              </ModernButton>
            </Box>
          </CardContent>
        </OutfitResultCard>
      )}
      
      {/* Empty State */}
      {items.length === 0 && (
        <ModernCard sx={{ textAlign: 'center', py: 6 }}>
          <MagicIcon sx={{ fontSize: '4rem', color: modernBlue.primary, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            No clothing items found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Add some clothing items to your wardrobe to start generating outfits
          </Typography>
        </ModernCard>
      )}
    </GeneratorContainer>
  );
};

export default OutfitGenerator;
