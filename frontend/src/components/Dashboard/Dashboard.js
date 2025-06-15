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
  Button, 
  IconButton, 
  Divider, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText,
  Chip,
  Stack,
  CircularProgress,
  LinearProgress,
  Alert,
  Fab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Services
import { getAllItems, getWearFrequencyStats } from '../../services/clothing';
import { getAllOutfits } from '../../services/outfits';

// Utils
import { getImageUrl, getOutfitImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

// Components
import TrendsFeed from './TrendsFeed';

// Icons
import CheckroomIcon from '@mui/icons-material/Checkroom';
import StyleIcon from '@mui/icons-material/Style';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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



const WeatherCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: 16,
  textAlign: 'center'
}));

const StatsItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'translateX(4px)',
    borderColor: theme.palette.primary.main
  }
}));

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState([]);
  const [allOutfits, setAllOutfits] = useState([]);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [location, setLocation] = useState('');

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsData, outfitsData] = await Promise.allSettled([
          getAllItems(),
          getAllOutfits()
        ]);

        setAllItems(itemsData.status === 'fulfilled' ? itemsData.value : []);
        setAllOutfits(outfitsData.status === 'fulfilled' ? outfitsData.value : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchWeather();
  }, []);

  // Fetch real weather data using One Call API 3.0
  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Using OpenWeatherMap One Call API 3.0
          const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'f5888a99ca0d0d22ef487a3a574db571';
          
          try {
            // Try One Call API 3.0 first (more comprehensive data)
            const onecallResponse = await fetch(
              `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&exclude=minutely,alerts`
            );
            
            if (onecallResponse.ok) {
              const data = await onecallResponse.json();
              setWeather({
                temp: Math.round(data.current.temp),
                condition: data.current.weather[0].main,
                description: data.current.weather[0].description,
                humidity: data.current.humidity,
                feelsLike: Math.round(data.current.feels_like),
                windSpeed: data.current.wind_speed,
                uvIndex: data.current.uvi,
                visibility: data.current.visibility
              });
              
              // Get location name from reverse geocoding or use coordinates
              setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
              
              // Try to get city name using basic weather API
              try {
                const locationResponse = await fetch(
                  `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
                );
                if (locationResponse.ok) {
                  const locationData = await locationResponse.json();
                  setLocation(locationData.name);
                }
              } catch (err) {
                console.log('Could not get location name, using coordinates');
              }
              
            } else {
              throw new Error('One Call API failed, trying basic weather API');
            }
          } catch (err) {
            console.log('One Call API failed, falling back to basic weather API:', err.message);
            
            // Fallback to basic weather API
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            
            if (response.ok) {
              const data = await response.json();
              setWeather({
                temp: Math.round(data.main.temp),
                condition: data.weather[0].main,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                feelsLike: Math.round(data.main.feels_like),
                windSpeed: data.wind?.speed || 0,
                uvIndex: 0,
                visibility: data.visibility || 0
              });
              setLocation(data.name);
            } else {
              throw new Error('Both weather APIs failed');
            }
          }
        }, () => {
          // Fallback if geolocation fails
          setFallbackWeather();
        });
      } else {
        setFallbackWeather();
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      setFallbackWeather();
    } finally {
      setWeatherLoading(false);
    }
  };

  const setFallbackWeather = () => {
    setWeather({
      temp: 22,
      condition: 'Clear',
      description: 'clear sky',
      humidity: 45,
      feelsLike: 24,
      windSpeed: 2.1,
      uvIndex: 5,
      visibility: 10000
    });
    setLocation('Your Location');
  };

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return <WbSunnyIcon sx={{ fontSize: 48 }} />;
      case 'clouds':
        return <CloudIcon sx={{ fontSize: 48 }} />;
      case 'rain':
        return <WaterDropIcon sx={{ fontSize: 48 }} />;
      default:
        return <WbSunnyIcon sx={{ fontSize: 48 }} />;
    }
  };

  // Calculate stats
  const stats = {
    totalItems: allItems.length,
    totalOutfits: allOutfits.length,
    favoriteItems: allItems.filter(item => item.favorite).length,
    categories: [...new Set(allItems.map(item => item.category))].length,
    recentlyAdded: allItems.filter(item => {
      const addedDate = new Date(item.dateAdded || item.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return addedDate > weekAgo;
    }).length
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3 }}>Loading your wardrobe...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's your wardrobe overview for today
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Weather Card */}
        <Grid item xs={12} md={4}>
          <WeatherCard>
            {weatherLoading ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                  <LocationOnIcon />
                  <Typography variant="body2">{location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {getWeatherIcon(weather?.condition)}
                </Box>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                  {weather?.temp}°C
                </Typography>
                <Typography variant="h6" sx={{ mb: 1, textTransform: 'capitalize' }}>
                  {weather?.description}
                </Typography>
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Feels like</Typography>
                      <Typography variant="body2" fontWeight="bold">{weather?.feelsLike}°</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Humidity</Typography>
                      <Typography variant="body2" fontWeight="bold">{weather?.humidity}%</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Wind</Typography>
                      <Typography variant="body2" fontWeight="bold">{weather?.windSpeed?.toFixed(1)} m/s</Typography>
                    </Box>
                  </Grid>
                  {weather?.uvIndex > 0 && (
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption">UV Index</Typography>
                        <Typography variant="body2" fontWeight="bold">{weather?.uvIndex}</Typography>
                      </Box>
                    </Grid>
                  )}
                  {weather?.visibility > 0 && (
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption">Visibility</Typography>
                        <Typography variant="body2" fontWeight="bold">{(weather?.visibility / 1000).toFixed(1)} km</Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </WeatherCard>
        </Grid>

        {/* Wardrobe Stats */}
        <Grid item xs={12} md={8}>
          <DashboardCard>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Wardrobe Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                    <CheckroomIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">{stats.totalItems}</Typography>
                  <Typography variant="body2" color="text.secondary">Items</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
                    <StyleIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">{stats.totalOutfits}</Typography>
                  <Typography variant="body2" color="text.secondary">Outfits</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                    <FavoriteIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">{stats.favoriteItems}</Typography>
                  <Typography variant="body2" color="text.secondary">Favorites</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold">{stats.categories}</Typography>
                  <Typography variant="body2" color="text.secondary">Categories</Typography>
                </Box>
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>

        {/* Recent Outfits */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Outfits
            </Typography>
            {allOutfits.length > 0 ? (
              <Box>
                {allOutfits.slice(0, 3).map((outfit, index) => (
                  <Box key={outfit._id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      component="img"
                      src={getOutfitImageUrl(outfit) || getPlaceholderImage(60, 60)}
                      alt={outfit.name}
                      sx={{ width: 60, height: 60, borderRadius: 2, objectFit: 'cover', mr: 2 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">{outfit.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {outfit.items?.length || 0} items • Created {new Date(outfit.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <Button fullWidth variant="outlined" onClick={() => navigate('/outfits')} sx={{ mt: 2 }}>
                  View All Outfits
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <StyleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No outfits created yet
                </Typography>
                <Button variant="contained" onClick={() => navigate('/outfits')}>
                  Create Your First Outfit
                </Button>
              </Box>
            )}
          </DashboardCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SmartToyIcon />}
                onClick={() => navigate('/wardrobe-assistant')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Smart Wardrobe Assistant
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<SmartToyIcon />}
                onClick={() => navigate('/social-advisor')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Social Context Advisor
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<SmartToyIcon />}
                onClick={() => navigate('/outfits')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Generate AI Outfit
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/clothes')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Add New Item
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<StyleIcon />}
                onClick={() => navigate('/outfits')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Create Outfit
              </Button>
            </Stack>
            
            {stats.recentlyAdded > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                You've added {stats.recentlyAdded} new item{stats.recentlyAdded > 1 ? 's' : ''} this week!
              </Alert>
            )}
          </DashboardCard>
        </Grid>

        {/* Trends Feed */}
        <Grid item xs={12}>
          <DashboardCard>
            <TrendsFeed userItems={allItems} />
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Floating Action Button for Quick Add */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/clothes')}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}

export default Dashboard;
