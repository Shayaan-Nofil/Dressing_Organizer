import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Box, 
  Chip, 
  Modal,
  Paper,
  IconButton,
  Fade,
  Stack,
  Divider,
  Backdrop,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ClothingItem from './ClothingItem';
import { useNavigate } from 'react-router-dom';
import { searchItems, getUnusedItems, getLeastWornItems, getWearFrequencyStats } from '../../services/clothing';

// Icons
import CheckroomIcon from '@mui/icons-material/Checkroom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BarChartIcon from '@mui/icons-material/BarChart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CategoryIcon from '@mui/icons-material/Category';
import PaletteIcon from '@mui/icons-material/Palette';
import LabelIcon from '@mui/icons-material/Label';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Styled components following Dashboard's design philosophy
const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const HeaderCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  padding: theme.spacing(4),
  borderRadius: 24,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
    : '0 8px 32px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
}));

const FilterCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  padding: theme.spacing(3),
  borderRadius: 20,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 20px rgba(0, 0, 0, 0.2)' 
    : '0 4px 20px rgba(0, 0, 0, 0.06)',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
  }
}));

const ActionButton = styled(Button)(({ theme, variant: buttonVariant = 'primary' }) => {
  const getVariantStyles = () => {
    switch (buttonVariant) {
      case 'secondary':
        return {
          background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
          boxShadow: `0 8px 24px ${theme.palette.secondary.main}40`,
          '&:hover': {
            boxShadow: `0 12px 32px ${theme.palette.secondary.main}50`,
          }
        };
      case 'accent':
        return {
          background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
          boxShadow: '0 8px 24px #06B6D440',
          '&:hover': {
            boxShadow: '0 12px 32px #06B6D450',
          }
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          boxShadow: '0 8px 24px #F59E0B40',
          '&:hover': {
            boxShadow: '0 12px 32px #F59E0B50',
          }
        };
      default:
        return {
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
          '&:hover': {
            boxShadow: `0 12px 32px ${theme.palette.primary.main}50`,
          }
        };
    }
  };

  return {
    borderRadius: 16,
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '0.95rem',
    color: 'white',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-3px)',
    },
    ...getVariantStyles()
  };
});

const StatsModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  borderRadius: 24,
  padding: theme.spacing(4),
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflow: 'auto',
  position: 'relative',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 20px 60px rgba(0, 0, 0, 0.5)' 
    : '0 20px 60px rgba(0, 0, 0, 0.15)',
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 600,
  margin: theme.spacing(0.5),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.dark}20)`,
  border: `1px solid ${theme.palette.primary.main}30`,
  color: theme.palette.primary.main,
  '& .MuiChip-deleteIcon': {
    color: theme.palette.primary.main,
  }
}));

function ClothingList() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ tags: '', type: '', color: '', category: '', favorite: '', lastWornBefore: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const navigate = useNavigate();

  const fetchFilteredItems = async () => {
    try {
      setSearchLoading(true);
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
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchFilteredItems();
      setLoading(false);
    };
    loadInitialData();
    // eslint-disable-next-line
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchFilteredItems();
  };

  const handleShowUnused = async () => {
    try {
      setSearchLoading(true);
      const data = await getUnusedItems();
      setModalTitle('Unused Items (30+ days)');
      setModalContent(data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching unused items:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleShowLeastWorn = async () => {
    try {
      setSearchLoading(true);
      const data = await getLeastWornItems();
      setModalTitle('Least Worn Items');
      setModalContent(data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching least worn items:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleShowFrequency = async () => {
    try {
      setSearchLoading(true);
      const data = await getWearFrequencyStats();
      setModalTitle('Wear Frequency Stats');
      setModalContent(data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching frequency stats:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ tags: '', type: '', color: '', category: '', favorite: '', lastWornBefore: '' });
  };

  const getActiveFilters = () => {
    return Object.entries(filters).filter(([key, value]) => value !== '').length;
  };

  return (
    <PageContainer maxWidth="xl">
      <Fade in timeout={800}>
        <Box>
          {/* Header Section */}
          <HeaderCard elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
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
                <Box>
                  <Typography variant="h3" fontWeight={700} 
                    sx={{ 
                      background: 'linear-gradient(135deg, #1F2937, #4B5563)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}
                  >
                    My Wardrobe
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Manage and organize your clothing collection
                  </Typography>
                  {items.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {items.length} item{items.length !== 1 ? 's' : ''} in your collection
                    </Typography>
                  )}
                </Box>
              </Box>
              <ActionButton
                startIcon={<AddIcon />}
                onClick={() => navigate('/add-clothing')}
                size="large"
              >
                Add New Item
              </ActionButton>
            </Box>

            {/* Quick Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Tooltip title="Show items not worn in 30+ days">
                <ActionButton
                  variant="warning"
                  startIcon={<VisibilityOffIcon />}
                  onClick={handleShowUnused}
                  disabled={searchLoading}
                >
                  Unused Items
                </ActionButton>
              </Tooltip>
              <Tooltip title="Show your least worn items">
                <ActionButton
                  variant="secondary"
                  startIcon={<TrendingUpIcon />}
                  onClick={handleShowLeastWorn}
                  disabled={searchLoading}
                >
                  Least Worn
                </ActionButton>
              </Tooltip>
              <Tooltip title="View wear frequency statistics">
                <ActionButton
                  variant="accent"
                  startIcon={<BarChartIcon />}
                  onClick={handleShowFrequency}
                  disabled={searchLoading}
                >
                  Analytics
                </ActionButton>
              </Tooltip>
            </Box>
          </HeaderCard>

          {/* Filter Section */}
          <FilterCard elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FilterListIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Filters & Search
                </Typography>
                {getActiveFilters() > 0 && (
                  <Badge badgeContent={getActiveFilters()} color="primary">
                    <FilterChip
                      label="Active"
                      onDelete={clearFilters}
                      deleteIcon={<CloseIcon />}
                    />
                  </Badge>
                )}
              </Box>
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  backgroundColor: theme => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme => theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.1)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <AutoAwesomeIcon />
              </IconButton>
            </Box>

            <Fade in={showFilters || getActiveFilters() > 0} timeout={300}>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <ModernTextField
                    fullWidth
                    label="Search Tags"
                    name="tags"
                    value={filters.tags}
                    onChange={handleFilterChange}
                    size="small"
                    placeholder="e.g., casual, formal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LabelIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ModernTextField
                    fullWidth
                    label="Type"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    size="small"
                    placeholder="e.g., shirt, pants"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ModernTextField
                    fullWidth
                    label="Color"
                    name="color"
                    value={filters.color}
                    onChange={handleFilterChange}
                    size="small"
                    placeholder="e.g., blue, red"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PaletteIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ModernTextField
                    fullWidth
                    label="Category"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    size="small"
                    placeholder="e.g., tops, bottoms"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ModernSelect size="small" fullWidth>
                    <InputLabel>Favorites</InputLabel>
                    <Select
                      label="Favorites"
                      name="favorite"
                      value={filters.favorite}
                      onChange={handleFilterChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <FavoriteIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">All Items</MenuItem>
                      <MenuItem value="true">Favorites Only</MenuItem>
                      <MenuItem value="false">Non-Favorites</MenuItem>
                    </Select>
                  </ModernSelect>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ModernTextField
                    fullWidth
                    label="Last Worn Before"
                    name="lastWornBefore"
                    type="date"
                    value={filters.lastWornBefore}
                    onChange={handleFilterChange}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ActionButton
                    fullWidth
                    startIcon={searchLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                    onClick={handleSearch}
                    disabled={searchLoading}
                    sx={{ height: '40px' }}
                  >
                    {searchLoading ? 'Searching...' : 'Search'}
                  </ActionButton>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={clearFilters}
                    sx={{ 
                      height: '40px',
                      borderRadius: 2,
                      borderColor: 'divider',
                      color: 'text.secondary',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'primary.main',
                        color: 'white',
                      }
                    }}
                  >
                    Clear All
                  </Button>
                </Grid>
              </Grid>
            </Fade>
          </FilterCard>

          {/* Items Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {items.length > 0 ? (
                items.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                    <ClothingItem item={item} onUpdate={fetchFilteredItems} />
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
                      No items found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {getActiveFilters() > 0 
                        ? 'Try adjusting your filters to find more items' 
                        : 'Start building your wardrobe by adding some clothing items'
                      }
                    </Typography>
                    <ActionButton
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/add-clothing')}
                    >
                      Add Your First Item
                    </ActionButton>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}

          {/* Statistics Modal */}
          <StatsModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
          >
            <Fade in={modalOpen}>
              <ModalContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h4" fontWeight={600}>
                    {modalTitle}
                  </Typography>
                  <IconButton
                    onClick={() => setModalOpen(false)}
                    sx={{
                      backgroundColor: theme => theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: theme => theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(0, 0, 0, 0.1)',
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                {modalContent.length > 0 ? (
                  <Grid container spacing={3}>
                    {modalContent.map((item, idx) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={item._id || idx}>
                        <ClothingItem item={item} onUpdate={fetchFilteredItems} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <AutoAwesomeIcon sx={{ fontSize: '3rem', color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No data available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      There are no items matching this criteria.
                    </Typography>
                  </Box>
                )}
              </ModalContent>
            </Fade>
          </StatsModal>
        </Box>
      </Fade>
    </PageContainer>
  );
}

export default ClothingList;