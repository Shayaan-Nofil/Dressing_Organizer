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
import { useNavigate } from 'react-router-dom';

// Icons
import AddIcon from '@mui/icons-material/Add';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import StyleIcon from '@mui/icons-material/Style';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import AcUnitIcon from '@mui/icons-material/AcUnit';
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

// Mock data
const mockOutfits = [
  {
    id: 1,
    name: 'Summer Casual',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    items: ['White T-shirt', 'Blue Jeans', 'Sneakers'],
    favorite: true,
    lastWorn: '2 days ago'
  },
  {
    id: 2,
    name: 'Business Meeting',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    items: ['Navy Blazer', 'White Shirt', 'Khaki Pants', 'Loafers'],
    favorite: false,
    lastWorn: '1 week ago'
  },
  {
    id: 3,
    name: 'Workout Ready',
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    items: ['Athletic Shirt', 'Running Shorts', 'Training Shoes'],
    favorite: true,
    lastWorn: 'Yesterday'
  }
];

const mockActivities = [
  { id: 1, action: 'Created new outfit', name: 'Summer Casual', time: '2 hours ago', icon: <StyleIcon color="primary" /> },
  { id: 2, action: 'Added new item', name: 'Blue Striped Shirt', time: 'Yesterday', icon: <CheckroomIcon color="secondary" /> },
  { id: 3, action: 'Wore outfit', name: 'Business Meeting', time: '3 days ago', icon: <StarIcon color="warning" /> },
  { id: 4, action: 'Added to favorites', name: 'Workout Ready', time: '1 week ago', icon: <FavoriteIcon color="error" /> }
];

const mockStats = [
  { label: 'Total Items', value: 48, color: '#3f51b5', icon: <CheckroomIcon />, increase: '+3 this month' },
  { label: 'Outfits Created', value: 12, color: '#f50057', icon: <StyleIcon />, increase: '+2 this week' },
  { label: 'Favorite Items', value: 8, color: '#ff9800', icon: <FavoriteIcon />, increase: 'Most worn: Blue Jeans' }
];

function Dashboard() {

  // ...existing state and logic...

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({
    temp: 36,
    condition: 'Sunny',
    humidity: 45,
    icon: <WbSunnyIcon sx={{ fontSize: 40 }} />
  });
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to handle quick actions
  const handleQuickAction = (action) => {
    if (action === 'create-outfit') {
      navigate('/outfits/create');
    } else if (action === 'add-item') {
      navigate('/wardrobe/add');
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
                  Today's Outfit Suggestion
                </Typography>
                <Chip 
                  label="Perfect for today's weather" 
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
                      image={mockOutfits[0].image}
                      alt={mockOutfits[0].name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="div">
                          {mockOutfits[0].name}
                        </Typography>
                        <IconButton size="small" color="error">
                          <FavoriteIcon />
                        </IconButton>
                      </Box>
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                        {mockOutfits[0].items.map((item, index) => (
                          <Chip key={index} label={item} size="small" variant="outlined" />
                        ))}
                      </Stack>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                          Last worn: {mockOutfits[0].lastWorn}
                        </Typography>
                        <Button 
                          size="small" 
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => navigate('/outfits/1')}
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
                    
                    {mockOutfits.slice(1, 3).map((outfit) => (
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
                          image={outfit.image}
                          alt={outfit.name}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2, flexGrow: 1 }}>
                          <Typography variant="subtitle1">{outfit.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {outfit.items.length} items
                          </Typography>
                          <Box sx={{ display: 'flex', mt: 'auto' }}>
                            <Button size="small" onClick={() => navigate(`/outfits/${outfit.id}`)}>View</Button>
                            <IconButton size="small" sx={{ ml: 'auto' }}>
                              {outfit.favorite ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteIcon color="disabled" fontSize="small" />}
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                    
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
                {mockStats.map((stat, index) => (
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
                    <Tooltip title={stat.increase} placement="top">
                      <IconButton size="small">
                        <TrendingUpIcon fontSize="small" sx={{ color: stat.color }} />
                      </IconButton>
                    </Tooltip>
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
                {mockActivities.map((activity) => (
                  <ActivityItem key={activity.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'background.paper', color: 'primary.main' }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {activity.action}: <strong>{activity.name}</strong>
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5 }} />
                          {activity.time}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ActivityItem>
                ))}
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
                  <Typography variant="body2" fontWeight="bold">85%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={85} color="success" sx={{ height: 8, borderRadius: 4 }} />
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Seasonal Items</Typography>
                  <Typography variant="body2" fontWeight="bold">60%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={60} color="primary" sx={{ height: 8, borderRadius: 4 }} />
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Accessories</Typography>
                  <Typography variant="body2" fontWeight="bold">40%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={40} color="warning" sx={{ height: 8, borderRadius: 4 }} />
              </Box>
              
              <Button 
                variant="text" 
                fullWidth 
                sx={{ mt: 3 }}
                onClick={() => navigate('/wardrobe')}
                endIcon={<ArrowForwardIcon />}
              >
                Manage Wardrobe
              </Button>
            </DashboardCard>
          </Zoom>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
