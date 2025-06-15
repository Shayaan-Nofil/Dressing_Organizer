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
  Stack,
  Paper,
  Grid,
  Divider,
  IconButton,
  Fade,
  InputAdornment,
  Tooltip,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Icons
import CheckroomIcon from '@mui/icons-material/Checkroom';
import AddIcon from '@mui/icons-material/Add';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LabelIcon from '@mui/icons-material/Label';
import PaletteIcon from '@mui/icons-material/Palette';
import CategoryIcon from '@mui/icons-material/Category';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import StraightenIcon from '@mui/icons-material/Straighten';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NotesIcon from '@mui/icons-material/Notes';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

const ModernSelect = styled(FormControl)(({ theme }) => ({
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
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
  }
}));

const ImageUploadCard = styled(Card)(({ theme, hasImage }) => ({
  borderRadius: 20,
  border: hasImage 
    ? `2px solid ${theme.palette.primary.main}` 
    : `2px dashed ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
  backgroundColor: hasImage
    ? theme.palette.mode === 'dark' 
      ? 'rgba(59, 130, 246, 0.15)' 
      : 'rgba(59, 130, 246, 0.05)'
    : theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.02)' 
      : 'rgba(255, 255, 255, 0.5)',
  backdropFilter: 'blur(10px)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 12px 32px rgba(0, 0, 0, 0.3)' 
      : '0 12px 32px rgba(0, 0, 0, 0.15)',
    borderColor: theme.palette.primary.main,
  }
}));

const TagChip = styled(Chip)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 600,
  margin: theme.spacing(0.5),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.dark}20)`,
  border: `1px solid ${theme.palette.primary.main}30`,
  color: theme.palette.primary.main,
  '& .MuiChip-deleteIcon': {
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.dark,
    }
  },
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}30, ${theme.palette.primary.dark}30)`,
    transform: 'scale(1.05)',
  }
}));

const AddButton = styled(Button)(({ theme }) => ({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const types = ['Shirt', 'T-shirt', 'Blouse', 'Sweater', 'Jacket', 'Coat', 'Blazer', 'Pants', 'Jeans', 'Shorts', 'Skirt', 'Dress', 'Jumpsuit', 'Suit', 'Shoes', 'Sneakers', 'Boots', 'Sandals', 'Heels', 'Flats', 'Bag', 'Belt', 'Hat', 'Scarf', 'Gloves', 'Jewelry', 'Watch', 'Other'];
  const categories = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'];
  const seasons = ['spring', 'summer', 'fall', 'winter'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
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
      setError(error?.response?.data?.message || error.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
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
                <CheckroomIcon sx={{ fontSize: '2rem' }} />
              </Box>
              <Typography variant="h3" fontWeight={700} 
                sx={{ 
                  background: 'linear-gradient(135deg, #1F2937, #4B5563)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Add New Item
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Add a new clothing item to your wardrobe collection
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          {/* Main Form */}
          <FormCard elevation={0}>
            <Box component="form" onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <SectionHeader>
                <LabelIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Basic Information
                </Typography>
              </SectionHeader>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Item Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Blue Cotton T-Shirt"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LabelIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ModernSelect fullWidth required>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={formData.type}
                      label="Type"
                      placeholder="Select type"
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      startAdornment={
                        <InputAdornment position="start">
                          <CategoryIcon color="action" />
                          <text style={{ marginLeft: 8 }}>Type</text>
                        </InputAdornment>
                      }
                    >
                      {types.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </ModernSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ModernSelect fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      label="Category"
                      placeholder="Select category"
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      startAdornment={
                      <InputAdornment position="start">
                        <CategoryIcon color="action" />
                        <text style={{ marginLeft: 8 }}>Category</text>
                      </InputAdornment>
                    }
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </ModernSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g., Navy Blue, Red"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PaletteIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* Details Section */}
              <SectionHeader>
                <BrandingWatermarkIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Item Details
                </Typography>
              </SectionHeader>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g., Nike, Zara, H&M"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BrandingWatermarkIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g., M, L, XL, 32"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <StraightenIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ModernSelect fullWidth>
                    <InputLabel>Seasons</InputLabel>
                    <Select
                      multiple
                      value={formData.season}
                      label="Seasons"
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      startAdornment={
                        <InputAdornment position="start">
                          <WbSunnyIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      {seasons.map((season) => (
                        <MenuItem key={season} value={season}>
                          {season.charAt(0).toUpperCase() + season.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </ModernSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Condition"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    placeholder="e.g., New, Good, Fair"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Purchase Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MonetizationOnIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ModernTextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any additional notes about this item..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <NotesIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* Image Upload Section */}
              <SectionHeader>
                <PhotoCameraIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Item Photo
                </Typography>
              </SectionHeader>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <ImageUploadCard component="label" hasImage={!!formData.image}>
                    <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      {imagePreview ? (
                        <Box>
                          <Box
                            component="img"
                            src={imagePreview}
                            alt="Preview"
                            sx={{
                              width: '100%',
                              maxWidth: 200,
                              height: 'auto',
                              borderRadius: 2,
                              mb: 2
                            }}
                          />
                          <Typography variant="body2" color="primary" fontWeight={600}>
                            {formData.image.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Click to change image
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <CloudUploadIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            Upload Image
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Click to select an image file
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </ImageUploadCard>
                </Grid>
              </Grid>

              {/* Tags Section */}
              <SectionHeader>
                <LabelIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Tags
                </Typography>
              </SectionHeader>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                  <ModernTextField
                    fullWidth
                    label="Add Tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="e.g., casual, work, formal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LabelIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="outlined"
                    onClick={handleAddTag}
                    fullWidth
                    sx={{ 
                      height: '56px',
                      borderRadius: 2,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      }
                    }}
                    startIcon={<AddIcon />}
                  >
                    Add Tag
                  </Button>
                </Grid>
                {formData.tags.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.tags.map((tag) => (
                        <TagChip
                          key={tag}
                          label={tag}
                          onDelete={() => handleDeleteTag(tag)}
                          deleteIcon={<DeleteIcon />}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                <AddButton
                  type="submit"
                  size="large"
                  disabled={loading || !formData.name.trim() || !formData.type || !formData.category}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? 'Adding Item...' : 'Add to Wardrobe'}
                </AddButton>
              </Box>
            </Box>
          </FormCard>
        </Box>
      </Fade>
    </Container>
  );
}

export default AddClothingForm;