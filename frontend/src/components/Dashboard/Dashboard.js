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
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';

// Styled components - Modern, minimalistic design
const DashboardCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 24,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
    : '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 20px 40px rgba(0, 0, 0, 0.4)' 
      : '0 20px 40px rgba(0, 0, 0, 0.12)',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 1)',
  }
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  border: 'none',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: 'white',
  boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 12px 32px ${theme.palette.primary.main}50`,
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  }
}));

const StatsCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))' 
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 20px rgba(0, 0, 0, 0.2)' 
    : '0 4px 20px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '100%',
  minHeight: 120,
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 30px rgba(0, 0, 0, 0.3)' 
      : '0 8px 30px rgba(0, 0, 0, 0.1)',
  }
}));

const WeatherIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 80,
  height: 80,
  borderRadius: 24,
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem'
  }
}));

const OutfitCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 20,
  overflow: 'hidden',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.02)' 
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
    : '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 20px 40px rgba(0, 0, 0, 0.4)' 
      : '0 20px 40px rgba(0, 0, 0, 0.12)',
  }
}));

const ActivityItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  borderRadius: 16,
  marginBottom: theme.spacing(1.5),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))' 
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 20px rgba(0, 0, 0, 0.2)' 
    : '0 4px 20px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateX(8px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 30px rgba(0, 0, 0, 0.3)' 
      : '0 8px 30px rgba(0, 0, 0, 0.1)',
  }
}));

const WeatherCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(4),
  borderRadius: 24,
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.2), transparent 50%)',
    pointerEvents: 'none'
  }
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
    <Box sx={{ 
      minHeight: '100vh',
      background: (theme) => theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: (theme) => theme.palette.mode === 'dark'
          ? 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1), transparent 50%)'
          : 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.05), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.05), transparent 50%)',
        pointerEvents: 'none'
      }
    }}>
      <Container maxWidth="xl" sx={{ pt: 6, pb: 8, position: 'relative', zIndex: 1 }}>
        {/* Welcome Header */}
        <Box sx={{ 
          mb: 6, 
          textAlign: 'center',
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          p: 4,
          border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
          boxShadow: (theme) => theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px rgba(0, 0, 0, 0.08)',
        }}>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight={700} 
            gutterBottom
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 2
            }}
          >
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ fontWeight: 400, opacity: 0.8 }}
          >
            Here's your wardrobe overview for today
          </Typography>
        </Box>

        {/* Main Content Container - Centered and Width-Matched */}
        <Box sx={{ 
          maxWidth: '1200px', 
          mx: 'auto', 
          width: '100%',
          px: { xs: 2, sm: 3, md: 0 }
        }}>
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
            <Typography 
              variant="h5" 
              fontWeight={700} 
              gutterBottom
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 3
              }}
            >
              Wardrobe Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <StatsCard>
                  <Avatar sx={{ 
                    bgcolor: 'transparent',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    width: 56, 
                    height: 56,
                    mb: 2,
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                  }}>
                    <CheckroomIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Typography variant="h3" fontWeight={800} sx={{ color: 'primary.main', mb: 0.5 }}>
                    {stats.totalItems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Items
                  </Typography>
                </StatsCard>
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatsCard>
                  <Avatar sx={{ 
                    bgcolor: 'transparent',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    width: 56, 
                    height: 56,
                    mb: 2,
                    boxShadow: '0 8px 24px rgba(240, 147, 251, 0.3)'
                  }}>
                    <StyleIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Typography variant="h3" fontWeight={800} sx={{ color: 'secondary.main', mb: 0.5 }}>
                    {stats.totalOutfits}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Outfits
                  </Typography>
                </StatsCard>
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatsCard>
                  <Avatar sx={{ 
                    bgcolor: 'transparent',
                    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                    width: 56, 
                    height: 56,
                    mb: 2,
                    boxShadow: '0 8px 24px rgba(252, 182, 159, 0.3)'
                  }}>
                    <FavoriteIcon sx={{ fontSize: 28, color: '#d84315' }} />
                  </Avatar>
                  <Typography variant="h3" fontWeight={800} sx={{ color: 'warning.main', mb: 0.5 }}>
                    {stats.favoriteItems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Favorites
                  </Typography>
                </StatsCard>
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatsCard>
                  <Avatar sx={{ 
                    bgcolor: 'transparent',
                    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    width: 56, 
                    height: 56,
                    mb: 2,
                    boxShadow: '0 8px 24px rgba(168, 237, 234, 0.3)'
                  }}>
                    <TrendingUpIcon sx={{ fontSize: 28, color: '#2e7d32' }} />
                  </Avatar>
                  <Typography variant="h3" fontWeight={800} sx={{ color: 'success.main', mb: 0.5 }}>
                    {stats.categories}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Categories
                  </Typography>
                </StatsCard>
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>

        {/* Recent Outfits */}
        <Grid item xs={12} md={4}>
          <DashboardCard>
            <Typography 
              variant="h5" 
              fontWeight={700} 
              gutterBottom
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 3
              }}
            >
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

        {/* Quick Actions - Full Width Horizontal Layout */}
        <Grid item xs={12}>
          <DashboardCard sx={{ 
            py: 4, 
            minHeight: 'auto',
            height: 'auto'
          }}>
            <Typography 
              variant="h5" 
              fontWeight={700} 
              gutterBottom
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 4,
              }}
            >
              Quick Actions
            </Typography>
            
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {/* Column 1 */}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <Stack spacing={2}>
                  <QuickActionButton
                    variant="contained"
                    size="large"
                    startIcon={<SmartToyIcon />}
                    onClick={() => navigate('/ai-features')}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      minHeight: 56,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    AI Features Hub
                  </QuickActionButton>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<SmartToyIcon />}
                    onClick={() => navigate('/wardrobe-assistant')}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      borderRadius: 4,
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      color: 'primary.main',
                      fontWeight: 600,
                      minHeight: 56,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)'
                      }
                    }}
                  >
                    Smart Assistant
                  </Button>
                </Stack>
              </Grid>
              
              {/* Column 2 */}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<SmartToyIcon />}
                    onClick={() => navigate('/social-advisor')}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      borderRadius: 4,
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      color: 'primary.main',
                      fontWeight: 600,
                      minHeight: 56,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)'
                      }
                    }}
                  >
                    Social Advisor
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<SmartToyIcon />}
                    onClick={() => navigate('/outfits')}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      borderRadius: 4,
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      color: 'primary.main',
                      fontWeight: 600,
                      minHeight: 56,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)'
                      }
                    }}
                  >
                    Generate Outfit
                  </Button>
                </Stack>
              </Grid>
              
              {/* Column 3 */}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/clothes')}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      borderRadius: 4,
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      color: 'primary.main',
                      fontWeight: 600,
                      minHeight: 56,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)'
                      }
                    }}
                  >
                    Add New Item
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<StyleIcon />}
                    onClick={() => navigate('/outfits')}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      borderRadius: 4,
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      color: 'primary.main',
                      fontWeight: 600,
                      minHeight: 56,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)'
                      }
                    }}
                  >
                    Create Outfit
                  </Button>
                </Stack>
              </Grid>
              
              {/* Column 4 */}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<NotificationsIcon />}
                    onClick={() => navigate('/profile')}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      borderRadius: 4,
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      color: 'primary.main',
                      fontWeight: 600,
                      minHeight: 56,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)'
                      }
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<SecurityIcon />}
                    onClick={() => navigate('/privacy')}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      borderRadius: 4,
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      color: 'primary.main',
                      fontWeight: 600,
                      minHeight: 56,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)'
                      }
                    }}
                  >
                    Privacy Settings
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            
            {stats.recentlyAdded > 0 && (
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  '& .MuiAlert-icon': {
                    color: 'primary.main'
                  }
                }}
              >
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
      </Box>

      {/* Floating Action Button for Quick Add */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          borderRadius: 4,
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
          }
        }}
        onClick={() => navigate('/clothes')}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>
      </Container>
    </Box>
  );
}

export default Dashboard;
