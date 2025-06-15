import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Grid, 
  Button, 
  CircularProgress, 
  Alert,
  Container,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add as AddIcon, Style as StyleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OutfitItem from './OutfitItem';
import OutfitGenerator from './OutfitGenerator';
import OutfitHistory from './OutfitHistory';
import { 
  ModernCard, 
  ModernButton, 
  modernBlue, 
  gradients, 
  responsiveContainer,
  responsiveTypography,
  responsiveSpacing
} from '../../theme/modernDesign';

// Styled Components - Modern glassmorphism design
const ModernContainer = styled(Container)(({ theme }) => ({
  ...responsiveContainer(theme),
  ...responsiveSpacing.sectionPadding,
  minHeight: 'calc(100vh - 100px)',
}));

const ModernTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    background: gradients.primary,
    height: 3,
    borderRadius: 1.5,
  },
  '& .MuiTab-root': {
    ...responsiveTypography.subtitle,
    textTransform: 'none',
    fontWeight: 600,
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&.Mui-selected': {
      background: gradients.primary,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700,
    },
    '&:hover': {
      color: modernBlue.primary,
    }
  }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    gap: 0,
  }
}));

const EmptyStateCard = styled(ModernCard)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6),
  maxWidth: 500,
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
  }
}));

// TabPanel component for the tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`outfits-tabpanel-${index}`}
      aria-labelledby={`outfits-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Accessibility props for tabs
function a11yProps(index) {
  return {
    id: `outfits-tab-${index}`,
    'aria-controls': `outfits-tabpanel-${index}`,
  };
}

const Outfits = () => {
  const [tab, setTab] = useState(0);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch outfits when component mounts
  useEffect(() => {
    fetchOutfits();
  }, []);

  // Fetch all outfits from the API
  const fetchOutfits = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/outfits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOutfits(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching outfits:', err);
      setError('Failed to load outfits. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle saving a new outfit
  const handleSaveOutfit = async (outfitData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/outfits', outfitData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOutfits();
      return { success: true };
    } catch (error) {
      console.error('Error saving outfit:', error);
      return { success: false, error: 'Failed to save outfit' };
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Show loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ModernContainer maxWidth="lg">
      {/* Header with title and create button */}
      <HeaderSection>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <StyleIcon sx={{ fontSize: '2rem', color: modernBlue.primary }} />
          <Typography variant="h4" sx={{ ...responsiveTypography.title }}>
            My Outfits
          </Typography>
        </Box>
        <ModernButton
          variant="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create-outfit')}
        >
          Create New Outfit
        </ModernButton>
      </HeaderSection>

      {/* Error message display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ width: '100%' }}>
        {/* Modern Tabs navigation */}
        <ModernTabs 
          value={tab} 
          onChange={handleTabChange}
          aria-label="outfits tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab label="My Outfits" {...a11yProps(0)} />
          <Tab label="AI Generator" {...a11yProps(1)} />
          <Tab label="History" {...a11yProps(2)} />
        </ModernTabs>

        {/* Tab Panels */}
        <TabPanel value={tab} index={0}>
          <Grid container spacing={3}>
            {outfits.length > 0 ? (
              outfits.map((outfit) => (
                <Grid item xs={12} sm={6} md={4} key={outfit._id}>
                  <OutfitItem outfit={outfit} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <EmptyStateCard>
                  <StyleIcon sx={{ fontSize: '4rem', color: modernBlue.primary, mb: 2 }} />
                  <Typography variant="h6" sx={{ ...responsiveTypography.subtitle, mb: 2 }}>
                    No outfits found
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Create your first outfit and start building your digital wardrobe.
                  </Typography>
                  <ModernButton
                    variant="primary"
                    onClick={() => navigate('/create-outfit')}
                    startIcon={<AddIcon />}
                  >
                    Create New Outfit
                  </ModernButton>
                </EmptyStateCard>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <OutfitGenerator onSaveOutfit={handleSaveOutfit} />
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <OutfitHistory />
        </TabPanel>
      </Box>
    </ModernContainer>
  );
};

export default Outfits;