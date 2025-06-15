import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea, 
  Button, 
  IconButton, 
  Divider, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  ListItemSecondaryAction,
  Chip,
  Stack,
  CircularProgress,
  LinearProgress,
  Tooltip,
  Zoom,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// Services
import { getAllItems, getWearFrequencyStats } from '../../services/clothing';
import { getAllOutfits, getOutfitSuggestions } from '../../services/outfits';

// Utils
import { getImageUrl, getOutfitImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

// Icons
import CheckroomIcon from '@mui/icons-material/Checkroom';
import StyleIcon from '@mui/icons-material/Style';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Styled components
const DashboardCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 16,
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.2)'
  }
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1.5, 3),
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: '0 4px 10px rgba(0,0,0,0.07)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)'
  }
}));

const StatsCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
  }
}));

const WeatherIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(2)
}));

const OutfitCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
  }
}));

const ActivityItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(5px)'
  }
}));

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [allOutfits, setAllOutfits] = useState([]);
  const [outfitSuggestions, setOutfitSuggestions] = useState([]);
  const [wearStats, setWearStats] = useState(null);
  
  // Weather state (could be connected to real weather API later)
  const [weather, setWeather] = useState({
    temp: 36,
    condition: 'Sunny',
    humidity: 45,
    icon: <WbSunnyIcon sx={{ fontSize: 40 }} />
  });

  // --- Analytics State ---
  const [analytics, setAnalytics] = useState({
    totalItems: 0,
    categoryBreakdown: {},
    colorBreakdown: {},
    mostWornItems: [],
    leastWornItems: [],
    seasonalUsage: {},
    combinationHistory: [],
    lifecycleRecommendations: []
  });

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch all data in parallel
        const [itemsData, outfitsData, activitiesData, analyticsData, suggestionsData, statsData] = await Promise.allSettled([
          getAllItems(),
          getAllOutfits(),
          fetch('http://localhost:5000/api/activity', {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.json()),
          fetch('http://localhost:5000/api/analytics', {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.json()),
          getOutfitSuggestions().catch(() => []), // Fallback to empty array if not implemented
          getWearFrequencyStats().catch(() => null) // Fallback to null if not implemented
        ]);

        // Set data with fallbacks
        setAllItems(itemsData.status === 'fulfilled' ? itemsData.value : []);
        setAllOutfits(outfitsData.status === 'fulfilled' ? outfitsData.value : []);
        setActivities(activitiesData.status === 'fulfilled' ? activitiesData.value : []);
        setAnalytics(analyticsData.status === 'fulfilled' ? analyticsData.value : {
          totalItems: 0,
          categoryBreakdown: {},
          colorBreakdown: {},
          mostWornItems: [],
          leastWornItems: [],
          seasonalUsage: {},
          combinationHistory: [],
          lifecycleRecommendations: []
        });
        setOutfitSuggestions(suggestionsData.status === 'fulfilled' ? suggestionsData.value : []);
        setWearStats(statsData.status === 'fulfilled' ? statsData.value : null);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculate dynamic stats from real data
  const calculateStats = () => {
    const totalItems = allItems.length;
    const totalOutfits = allOutfits.length;
    
    // Calculate category breakdown
    const categoryBreakdown = allItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    
    // Find most worn items (if wearCount is available)
    const mostWornItems = allItems
      .filter(item => item.wearCount > 0)
      .sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))
      .slice(0, 3);
    
    // Get top category
    const topCategory = Object.entries(categoryBreakdown)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      totalItems,
      totalOutfits,
      topCategory: topCategory ? topCategory[0] : 'N/A',
      topCategoryCount: topCategory ? topCategory[1] : 0,
      mostWornItem: mostWornItems[0] || null,
      categoryBreakdown
    };
  };

  const stats = calculateStats();

  // Create dynamic outfit suggestions from real outfits
  const dynamicOutfitSuggestions = allOutfits.length > 0 ? allOutfits.slice(0, 3).map((outfit, idx) => ({
    id: outfit._id || idx + 1,
    name: outfit.name || `Outfit ${idx + 1}`,
    image: outfit.image || '',
    items: outfit.items || [],
    favorite: outfit.favorite || false,
    lastWorn: outfit.lastWorn ? new Date(outfit.lastWorn).toLocaleDateString() : 'Never'
  })) : [];

  // Dynamic stats array
  const dynamicStatsArray = [
    { 
      label: 'Total Items', 
      value: stats.totalItems, 
      color: '#3f51b5', 
      icon: <CheckroomIcon />, 
      increase: `${stats.totalOutfits} outfits` 
    },
    { 
      label: 'Most Worn Item', 
      value: stats.mostWornItem?.name || 'N/A', 
      color: '#ff9800', 
      icon: <FavoriteIcon />, 
      increase: stats.mostWornItem ? `${stats.mostWornItem.wearCount || 0} wears` : '' 
    },
    { 
      label: 'Top Category', 
      value: stats.topCategory, 
      color: '#f50057', 
      icon: <StyleIcon />, 
      increase: stats.topCategoryCount > 0 ? `${stats.topCategoryCount} items` : '' 
    }
  ];
  
  // Function to handle quick actions
  const handleQuickAction = (action) => {
    if (action === 'create-outfit') {
      navigate('/create-outfit');
    } else if (action === 'add-item') {
      navigate('/clothes');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3 }}>Loading your wardrobe...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>

      {/* Welcome Header */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column' }}>
        <Fade in={true} timeout={800}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Welcome back to your Wardrobe
          </Typography>
        </Fade>
        <Fade in={true} timeout={1200}>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            Here's an overview of your wardrobe and outfit planning
          </Typography>
        </Fade>
      </Box>
      
      <Grid container spacing={2}>
        {/* Today's Outfit Suggestion */}
        <Grid item xs={12} md={8}>
          <Zoom in={true} style={{ transitionDelay: '300ms' }}>
            <DashboardCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {dynamicOutfitSuggestions.length > 0 ? "Today's Outfit Suggestion" : "Get Started"}
                </Typography>
                <Chip 
                  label={dynamicOutfitSuggestions.length > 0 ? "Perfect for today's weather" : "Create your first outfit"} 
                  size="small" 
                  color="primary" 
                  icon={<WbSunnyIcon />} 
                  sx={{ borderRadius: 2 }}
                />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <OutfitCard>
                    <CardMedia
                      component="img"
                      height="240"
                      image={getOutfitImageUrl(dynamicOutfitSuggestions[0]) || getPlaceholderImage(300, 240)}
                      alt={dynamicOutfitSuggestions[0]?.name || 'Outfit'}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="div">
                          {dynamicOutfitSuggestions[0]?.name || 'Create your first outfit!'}
                        </Typography>
                        <IconButton size="small" color="error">
                          <FavoriteIcon />
                        </IconButton>
                      </Box>
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                        {dynamicOutfitSuggestions[0]?.items?.slice(0, 3).map((item, index) => (
                          <Chip key={index} label={item.name || item} size="small" variant="outlined" />
                        )) || <Chip label="No items yet" size="small" variant="outlined" />}
                      </Stack>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                          Last worn: {dynamicOutfitSuggestions[0]?.lastWorn || 'Never'}
                        </Typography>
                        <Button 
                          size="small" 
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => navigate('/outfits')}
                        >
                          Details
                        </Button>
                      </Box>
                    </CardContent>
                  </OutfitCard>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Alternative Options
                    </Typography>
                    
                    {dynamicOutfitSuggestions.slice(1, 3).length > 0 ? dynamicOutfitSuggestions.slice(1, 3).map((outfit) => (
                      <Box 
                        key={outfit.id} 
                        sx={{
                          display: 'flex',
                          mb: 2,
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: 'background.paper',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          transition: 'all 0.2s',
                          '&:hover': { transform: 'translateX(5px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{ width: 80, height: 80, borderRadius: 1, objectFit: 'cover' }}
                          image={getOutfitImageUrl(outfit) || getPlaceholderImage(80, 80)}
                          alt={outfit.name || 'Outfit'}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2, flexGrow: 1 }}>
                          <Typography variant="subtitle1">{outfit.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {outfit.items?.length || 0} items
                          </Typography>
                          <Box sx={{ display: 'flex', mt: 'auto' }}>
                            <Button size="small" onClick={() => navigate('/outfits')}>View</Button>
                            <IconButton size="small" sx={{ ml: 'auto' }}>
                              <FavoriteIcon color="disabled" fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    )) : (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          No additional outfits yet. Create some outfits to see suggestions here!
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          sx={{ mt: 1 }}
                          onClick={() => navigate('/outfits')}
                        >
                          Create Outfit
                        </Button>
                      </Box>
                    )}
                    
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      onClick={() => navigate('/outfits')}
                      sx={{ mt: 'auto' }}
                    >
                      See All Outfits
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DashboardCard>
          </Zoom>
        </Grid>
        
        {/* Weather & Stats */}
        <Grid item xs={12} md={4}>
          <Zoom in={true} style={{ transitionDelay: '500ms' }}>
            <DashboardCard>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Today's Weather
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <WeatherIcon>
                  {weather.icon}
                </WeatherIcon>
                <Typography variant="h3" fontWeight="bold">
                  {weather.temp}°
                </Typography>
                <Typography variant="subtitle1">
                  {weather.condition}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <WaterDropIcon fontSize="small" color="primary" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {weather.humidity}% Humidity
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Wardrobe Stats
              </Typography>
              
              <Stack spacing={2}>
                {dynamicStatsArray.map((stat, index) => (
                  <StatsCard key={index} sx={{ backgroundColor: `${stat.color}15` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: stat.color, width: 40, height: 40 }}>
                        {stat.icon}
                      </Avatar>
                      <Box sx={{ ml: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>
                    {stat.increase && (
                      <Tooltip title={stat.increase} placement="top">
                        <IconButton size="small">
                          <TrendingUpIcon fontSize="small" sx={{ color: stat.color }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </StatsCard>
                ))}
              </Stack>
            </DashboardCard>
          </Zoom>
        </Grid>
        
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Zoom in={true} style={{ transitionDelay: '700ms' }}>
            <DashboardCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Activities
                </Typography>
                <Chip 
                  label="Last 7 days" 
                  size="small" 
                  variant="outlined" 
                  sx={{ borderRadius: 2 }}
                />
              </Box>
              
              <List sx={{ width: '100%' }}>
                {activities.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    No recent activities.
                  </Typography>
                ) : (
                  activities.map((activity) => {
                    let icon = <StyleIcon color="primary" />;
                    let actionText = '';
                    if (activity.type === 'outfit_created') {
                      icon = <StyleIcon color="primary" />;
                      actionText = 'Created new outfit';
                    } else if (activity.type === 'outfit_worn') {
                      icon = <StarIcon color="warning" />;
                      actionText = 'Wore outfit';
                    } else if (activity.type === 'item_added') {
                      icon = <CheckroomIcon color="secondary" />;
                      actionText = 'Added new item';
                    } else if (activity.type === 'outfit_deleted') {
                      icon = <StyleIcon color="error" />;
                      actionText = 'Deleted outfit';
                    } else {
                      actionText = activity.message;
                    }
                    // Format time
                    const date = new Date(activity.timestamp);
                    const now = new Date();
                    const diffMs = now - date;
                    let timeAgo = '';
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMs / 3600000);
                    const diffDays = Math.floor(diffMs / 86400000);
                    if (diffMins < 1) timeAgo = 'just now';
                    else if (diffMins < 60) timeAgo = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
                    else if (diffHours < 24) timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                    else timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

                    return (
                      <ActivityItem key={activity._id}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'background.paper', color: 'primary.main' }}>
                            {icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">
                              {actionText}{activity.relatedId ? ':' : ''} <strong>{activity.message.replace(/^(Created new outfit:|Wore outfit:|Deleted outfit:)/, '').trim()}</strong>
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5 }} />
                              {timeAgo}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ActivityItem>
                    );
                  })
                )}
              </List>
              
              <Button 
                variant="text" 
                fullWidth 
                sx={{ mt: 2 }}
                endIcon={<ArrowForwardIcon />}
              >
                View All Activities
              </Button>
            </DashboardCard>
          </Zoom>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Zoom in={true} style={{ transitionDelay: '900ms' }}>
            <DashboardCard>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <QuickActionButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<StyleIcon />}
                    onClick={() => handleQuickAction('create-outfit')}
                  >
                    Create Outfit
                  </QuickActionButton>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <QuickActionButton
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    startIcon={<CheckroomIcon />}
                    onClick={() => handleQuickAction('add-item')}
                  >
                    Add New Item
                  </QuickActionButton>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Wardrobe Completion
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Essentials</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.totalItems > 0 ? Math.min(100, Math.round((stats.totalItems / 20) * 100)) : 0}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.totalItems > 0 ? Math.min(100, Math.round((stats.totalItems / 20) * 100)) : 0} 
                  color="success" 
                  sx={{ height: 8, borderRadius: 4 }} 
                />
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Outfits Created</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.totalOutfits > 0 ? Math.min(100, Math.round((stats.totalOutfits / 10) * 100)) : 0}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.totalOutfits > 0 ? Math.min(100, Math.round((stats.totalOutfits / 10) * 100)) : 0} 
                  color="primary" 
                  sx={{ height: 8, borderRadius: 4 }} 
                />
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Category Coverage</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {Object.keys(stats.categoryBreakdown).length > 0 ? Math.min(100, Math.round((Object.keys(stats.categoryBreakdown).length / 8) * 100)) : 0}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Object.keys(stats.categoryBreakdown).length > 0 ? Math.min(100, Math.round((Object.keys(stats.categoryBreakdown).length / 8) * 100)) : 0} 
                  color="warning" 
                  sx={{ height: 8, borderRadius: 4 }} 
                />
              </Box>
              
              <Button 
                variant="text" 
                fullWidth 
                sx={{ mt: 3 }}
                onClick={() => navigate('/outfits')}
                endIcon={<ArrowForwardIcon />}
              >
                Manage Outfits
              </Button>
            </DashboardCard>
          </Zoom>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
