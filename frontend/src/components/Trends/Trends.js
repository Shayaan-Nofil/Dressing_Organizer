import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getWearFrequencyStats, getAllItems } from '../../services/clothing';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';
import {
  ModernCard,
  ModernButton,
  modernBlue,
  gradients,
  responsiveContainer,
  responsiveTypography,
  responsiveSpacing,
  shadows
} from '../../theme/modernDesign';
import {
  TrendingUp as TrendingUpIcon,
  Style as StyleIcon,
  AutoAwesome as SparkleIcon,
  CheckCircle as CheckIcon,
  Brightness5 as SunIcon,
  AcUnit as SnowIcon
} from '@mui/icons-material';

// Styled Components
const TrendsContainer = styled(Container)(({ theme }) => ({
  ...responsiveContainer(theme),
  ...responsiveSpacing.sectionPadding,
  minHeight: 'calc(100vh - 100px)',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(5),
}));

const TrendCard = styled(ModernCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: gradients.primary,
  }
}));

const SeasonalCard = styled(ModernCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${modernBlue.primary}15, ${modernBlue.accent}15)`,
}));

const TrendImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  position: 'relative',
  overflow: 'hidden',
  '&:after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)',
  }
}));

const TipChip = styled(Chip)(({ theme }) => ({
  background: gradients.accent,
  color: 'white',
  fontWeight: 500,
  fontSize: '0.75rem',
  '&:hover': {
    background: gradients.primary,
  }
}));

const Trends = () => {
  const [trends] = useState([
    {
      title: 'Effortless Layering',
      description: "Layering lightweight pieces for a chic, adaptable look. Try a linen shirt over a tank top with relaxed trousers.",
      tips: ['Mix textures', 'Use neutral colors', 'Add a statement accessory'],
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
    },
    {
      title: 'Pop of Color',
      description: 'Brighten up your outfit with a bold accessory or a vibrant top. Color blocking is in!',
      tips: ['Choose one bold color', 'Keep the rest neutral'],
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
    },
    {
      title: 'Relaxed Tailoring',
      description: 'Loose blazers and wide-leg pants are trending for a comfortable yet polished look.',
      tips: ['Go for oversized fits', 'Pair with sneakers'],
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    },
  ]);

  const [seasonalRecommendations] = useState([
    {
      season: 'Summer',
      title: 'Breezy Summer Outfits',
      description: 'Opt for breathable fabrics like cotton and linen. Pair shorts with loose shirts and sandals.',
      image: 'https://images.unsplash.com/photo-1469398715555-76331a6c7c9b',
      combos: ['Shorts + Linen Shirt', 'Maxi Dress + Sandals', 'T-shirt + Skirt'],
    },
    {
      season: 'Winter',
      title: 'Cozy Winter Layers',
      description: "Layer up with knits, scarves, and boots. Don't forget a statement coat!",
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      combos: ['Sweater + Jeans + Boots', 'Turtleneck + Coat', 'Dress + Tights + Ankle Boots'],
    },
  ]);
  // Real analytics data
  const [analytics, setAnalytics] = useState({
    wearFrequency: [],
    combinationHistory: [],
    lifecycle: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [wearStats, allItems] = await Promise.all([
          getWearFrequencyStats(),
          getAllItems()
        ]);

        // Process wear frequency data
        const sortedByWears = wearStats.sort((a, b) => (b.timesWorn || 0) - (a.timesWorn || 0)).slice(0, 10);
        
        // Create lifecycle recommendations
        const lifecycle = allItems.map(item => {
          const wears = item.timesWorn || 0;
          let recommendation = 'New item';
          if (wears > 50) recommendation = 'Consider replacing soon';
          else if (wears > 30) recommendation = 'Well-worn, still good';
          else if (wears > 10) recommendation = 'Good condition';
          
          return {
            name: item.name,
            image: item.image,
            wears,
            recommendation
          };
        }).slice(0, 5);

        setAnalytics({
          wearFrequency: sortedByWears,
          combinationHistory: [], // This would need outfit history data
          lifecycle
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Keep fallback data if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);
  return (
    <TrendsContainer maxWidth="lg">
      {/* Header Section */}
      <HeaderSection>
        <TrendingUpIcon sx={{ fontSize: '4rem', color: modernBlue.primary, mb: 2 }} />
        <Typography variant="h3" sx={{ ...responsiveTypography.hero, mb: 1 }}>
          Fashion Trends & Insights
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Discover the latest trends and get personalized style recommendations
        </Typography>
      </HeaderSection>

      {/* Current Trends Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <SparkleIcon sx={{ color: modernBlue.primary, fontSize: '2rem' }} />
          <Typography variant="h4" sx={{ ...responsiveTypography.title }}>
            Trending Now
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {trends.map((trend, idx) => (
            <Grid item xs={12} md={6} lg={4} key={idx}>
              <TrendCard>
                <TrendImage
                  image={trend.image}
                  title={trend.title}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" sx={{ ...responsiveTypography.subtitle, mb: 2 }}>
                    {trend.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    {trend.description}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Style Tips:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {trend.tips.map((tip, i) => (
                      <TipChip key={i} label={tip} size="small" icon={<CheckIcon />} />
                    ))}
                  </Stack>
                </CardContent>
              </TrendCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Seasonal Recommendations Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <StyleIcon sx={{ color: modernBlue.primary, fontSize: '2rem' }} />
          <Typography variant="h4" sx={{ ...responsiveTypography.title }}>
            Seasonal Recommendations
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {seasonalRecommendations.map((rec, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <SeasonalCard>
                <Box sx={{ position: 'relative' }}>
                  <TrendImage
                    image={rec.image}
                    title={rec.title}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16,
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: 2,
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    {rec.season === 'Summer' ? <SunIcon /> : <SnowIcon />}
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {rec.season}
                    </Typography>
                  </Box>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" sx={{ ...responsiveTypography.subtitle, mb: 2 }}>
                    {rec.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    {rec.description}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Outfit Combinations:
                  </Typography>
                  <List dense>
                    {rec.combos.map((combo, i) => (
                      <ListItem key={i} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon sx={{ color: modernBlue.primary, fontSize: '1rem' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={combo} 
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </SeasonalCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Analytics & Insights Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <TrendingUpIcon sx={{ color: modernBlue.primary, fontSize: '2rem' }} />
          <Typography variant="h4" sx={{ ...responsiveTypography.title }}>
            Your Style Analytics
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <ModernCard sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Most Worn Items
                </Typography>
                <Grid container spacing={3}>
                  {analytics.wearFrequency.length > 0 ? (
                    analytics.wearFrequency.map((item, idx) => (
                      <Grid item xs={6} sm={4} md={3} key={item._id || idx}>
                        <Box sx={{ 
                          textAlign: 'center',
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(59, 130, 246, 0.05)',
                          border: '1px solid rgba(59, 130, 246, 0.1)'
                        }}>
                          <Box sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: 2, 
                            overflow: 'hidden',
                            mx: 'auto',
                            mb: 2
                          }}>
                            <img 
                              src={getImageUrl(item.image) || getPlaceholderImage(80, 80)} 
                              alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            {item.name}
                          </Typography>
                          <Chip 
                            label={`${item.wearCount} times`} 
                            size="small"
                            sx={{ 
                              background: gradients.primary,
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                        No wear data available yet. Start tracking your outfits to see insights!
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </ModernCard>
            </Grid>
          </Grid>
        )}
      </Box>    </TrendsContainer>
  );
};

export default Trends;