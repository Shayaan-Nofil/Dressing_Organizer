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
  Paper,
  IconButton,
  Fade,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

// Icons
import CheckroomIcon from '@mui/icons-material/Checkroom';
import StyleIcon from '@mui/icons-material/Style';
import AddIcon from '@mui/icons-material/Add';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Styled components following Dashboard's design philosophy
const FormCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  padding: theme.spacing(4),
  borderRadius: 24,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
    : '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
}));

const ModernTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(255, 255, 255, 1)',
      transform: 'translateY(-2px)',
      boxShadow: theme.palette.mode === 'dark' 
        ? '0 8px 25px rgba(0, 0, 0, 0.2)' 
        : '0 8px 25px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(255, 255, 255, 1)',
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 25px ${theme.palette.primary.main}20`,
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
  }
}));

const ItemCard = styled(Card)(({ theme, selected }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 20,
  overflow: 'hidden',
  backgroundColor: selected 
    ? theme.palette.mode === 'dark' 
      ? 'rgba(59, 130, 246, 0.15)' 
      : 'rgba(59, 130, 246, 0.1)'
    : theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.02)' 
      : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: selected 
    ? `2px solid ${theme.palette.primary.main}` 
    : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  boxShadow: selected
    ? theme.palette.mode === 'dark' 
      ? `0 12px 32px ${theme.palette.primary.main}30` 
      : `0 12px 32px ${theme.palette.primary.main}20`
    : theme.palette.mode === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
      : '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 20px 40px rgba(0, 0, 0, 0.4)' 
      : '0 20px 40px rgba(0, 0, 0, 0.12)',
  }
}));

const CreateButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1.1rem',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: 'white',
  boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: 56,
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 12px 32px ${theme.palette.primary.main}50`,
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  },
  '&:disabled': {
    background: 'linear-gradient(135deg, #94A3B8, #64748B)',
    color: 'white',
    opacity: 0.7,
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
}));

const SelectedItemsChip = styled(Chip)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 600,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.dark}20)`,
  border: `1px solid ${theme.palette.primary.main}30`,
  color: theme.palette.primary.main,
}));

function CreateOutfitForm() {
  const [formData, setFormData] = useState({
    name: '',
    items: [],
    notes: ''
  });
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/clothing-items', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvailableItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: theme => theme.palette.primary.main,
                }}
              >
                <StyleIcon sx={{ fontSize: '2rem' }} />
              </Box>
              <Typography variant="h3" fontWeight={700} 
                sx={{ 
                  background: 'linear-gradient(135deg, #1F2937, #4B5563)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Create New Outfit
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Combine your favorite clothing items to create the perfect outfit for any occasion
            </Typography>
          </Box>

          {/* Main Form */}
          <FormCard elevation={0}>
            <Box component="form" onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <SectionHeader>
                <CheckroomIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Outfit Details
                </Typography>
              </SectionHeader>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <ModernTextField
                    fullWidth
                    label="Outfit Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Summer Casual, Business Meeting, Date Night"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ModernTextField
                    fullWidth
                    label="Notes & Styling Tips"
                    multiline
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any notes about styling, occasions, or special instructions..."
                  />
                </Grid>
              </Grid>

              {/* Item Selection Section */}
              <SectionHeader>
                <AddIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Select Items
                </Typography>
                {formData.items.length > 0 && (
                  <SelectedItemsChip 
                    label={`${formData.items.length} item${formData.items.length !== 1 ? 's' : ''} selected`}
                    icon={<CheckCircleIcon />}
                  />
                )}
              </SectionHeader>              <Grid container spacing={3} sx={{ mb: 4 }}>
                {loading ? (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                      <CircularProgress size={60} thickness={4} />
                    </Box>
                  </Grid>
                ) : availableItems.length > 0 ? (
                  availableItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                      <ItemCard
                        selected={formData.items.includes(item._id)}
                        onClick={() => handleItemToggle(item._id)}
                      >
                        {formData.items.includes(item._id) && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              zIndex: 2,
                              backgroundColor: 'primary.main',
                              borderRadius: '50%',
                              p: 0.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CheckCircleIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
                          </Box>
                        )}
                        <CardMedia
                          component="img"
                          sx={{ 
                            height: 200, 
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                          image={getImageUrl(item.image) || getPlaceholderImage(300, 200)}
                          alt={item.name}
                        />
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.category}
                          </Typography>
                          {item.color && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  backgroundColor: item.color.toLowerCase(),
                                  border: '2px solid',
                                  borderColor: 'divider'
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {item.color}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </ItemCard>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: 8,
                        background: theme => theme.palette.mode === 'dark' 
                          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))' 
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
                        borderRadius: 3,
                        border: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                      }}
                    >
                      <CheckroomIcon sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No clothing items available
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add some clothing items to your wardrobe first to create outfits
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                <CreateButton
                  type="submit"
                  size="large"
                  disabled={formData.items.length === 0 || !formData.name.trim()}
                  startIcon={<AddIcon />}
                >
                  Create Outfit
                </CreateButton>
              </Box>
            </Box>
          </FormCard>
        </Box>
      </Fade>
    </Container>
  );
}

export default CreateOutfitForm;