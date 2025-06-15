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
  CardContent
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OutfitItem from './OutfitItem';
import OutfitGenerator from './OutfitGenerator';
import OutfitHistory from './OutfitHistory';
import './Outfits.css';

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with title and create button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Outfits</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create-outfit')}
        >
          Create New Outfit
        </Button>
      </Box>

      {/* Error message display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ width: '100%' }}>
        {/* Tabs navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tab} 
            onChange={handleTabChange}
            aria-label="outfits tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="My Outfits" {...a11yProps(0)} />
            <Tab label="AI Outfit Generator" {...a11yProps(1)} />
            <Tab label="Outfit History" {...a11yProps(2)} />
          </Tabs>
        </Box>

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
                <Typography variant="body1" color="textSecondary">
                  No outfits found. Create your first outfit!
                </Typography>
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
    </Container>
  );
};

export default Outfits;