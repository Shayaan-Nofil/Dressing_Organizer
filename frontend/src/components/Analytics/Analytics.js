import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Stack,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LineChart,
  Line
} from 'recharts';
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
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Palette as PaletteIcon,
  Category as CategoryIcon,
  Timeline as TimelineIcon,
  Checkroom as CheckroomIcon
} from '@mui/icons-material';

// Styled Components
const AnalyticsContainer = styled(Container)(({ theme }) => ({
  ...responsiveContainer(theme),
  ...responsiveSpacing.sectionPadding,
  minHeight: 'calc(100vh - 100px)',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(5),
  position: 'relative',
}));

const StatsCard = styled(ModernCard)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  background: gradients.primary,
  color: 'white',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.05)',
  }
}));

const ChartCard = styled(ModernCard)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 800,
  marginBottom: theme.spacing(1),
  background: 'rgba(255, 255, 255, 0.9)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  }
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  opacity: 0.9,
}));

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalItems: 0,
    categoryBreakdown: {},
    colorBreakdown: {},
    mostWornItems: [],
    leastWornItems: [],
    seasonalUsage: {},
    combinationHistory: [], // New
    lifecycleRecommendations: [] // New
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Optionally set error state to show user feedback
      // setError('Failed to load analytics. Please try again later.');
    }
  };

  return (
    <AnalyticsContainer maxWidth="lg">
      {/* Header Section */}
      <HeaderSection>
        <AnalyticsIcon sx={{ fontSize: '4rem', color: modernBlue.primary, mb: 2 }} />
        <Typography variant="h3" sx={{ ...responsiveTypography.hero, mb: 1 }}>
          Wardrobe Analytics
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Insights into your fashion choices and wardrobe utilization
        </Typography>
      </HeaderSection>

      <Grid container spacing={4}>
        {/* Stats Overview */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CheckroomIcon sx={{ fontSize: '2.5rem', mb: 1, opacity: 0.8 }} />
                <StatValue>{analytics.totalItems}</StatValue>
                <StatLabel>Total Items</StatLabel>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <CategoryIcon sx={{ fontSize: '2.5rem', mb: 1, opacity: 0.8 }} />
                <StatValue>{Object.keys(analytics.categoryBreakdown || {}).length}</StatValue>
                <StatLabel>Categories</StatLabel>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <PaletteIcon sx={{ fontSize: '2.5rem', mb: 1, opacity: 0.8 }} />
                <StatValue>{Object.keys(analytics.colorBreakdown || {}).length}</StatValue>
                <StatLabel>Colors</StatLabel>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <TrendingUpIcon sx={{ fontSize: '2.5rem', mb: 1, opacity: 0.8 }} />
                <StatValue>{analytics.mostWornItems?.length || 0}</StatValue>
                <StatLabel>Tracked Items</StatLabel>
              </StatsCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Category Breakdown Chart */}
        <Grid item xs={12} md={6}>
          <ChartCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <CategoryIcon sx={{ color: modernBlue.primary }} />
              <Typography variant="h6" sx={{ ...responsiveTypography.subtitle }}>
                Category Breakdown
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(analytics.categoryBreakdown || {}).map(([category, count]) => ({ 
                    name: category, 
                    value: count 
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill={modernBlue.primary}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {Object.entries(analytics.categoryBreakdown || {}).map(([category], idx) => (
                    <Cell key={`cell-${category}`} fill={[
                      modernBlue.primary, 
                      modernBlue.secondary, 
                      modernBlue.accent, 
                      gradients.success, 
                      gradients.warning, 
                      gradients.error
                    ][idx % 6]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Color Distribution Chart */}
        <Grid item xs={12} md={6}>
          <ChartCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <PaletteIcon sx={{ color: modernBlue.primary }} />
              <Typography variant="h6" sx={{ ...responsiveTypography.subtitle }}>
                Color Distribution
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(analytics.colorBreakdown || {}).map(([color, count]) => ({ 
                color, 
                count 
              }))}>
                <XAxis dataKey="color" />
                <YAxis allowDecimals={false} />
                <Bar dataKey="count" fill={modernBlue.primary} radius={[4, 4, 0, 0]}>
                  {Object.entries(analytics.colorBreakdown || {}).map(([color], idx) => (
                    <Cell key={`cell-bar-${color}`} fill={[
                      modernBlue.primary, 
                      modernBlue.secondary, 
                      modernBlue.accent, 
                      gradients.success, 
                      gradients.warning, 
                      gradients.error
                    ][idx % 6]} />
                  ))}
                </Bar>
                <RechartsTooltip />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Most Worn Items */}
        <Grid item xs={12} md={6}>
          <ChartCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TrendingUpIcon sx={{ color: modernBlue.primary }} />
              <Typography variant="h6" sx={{ ...responsiveTypography.subtitle }}>
                Most Worn Items
              </Typography>
            </Box>
            <Stack spacing={2}>
              {analytics.mostWornItems?.length > 0 ? (
                analytics.mostWornItems.map((item, index) => (
                  <Box key={item._id} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: index % 2 === 0 ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
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
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  No wear data available yet
                </Typography>
              )}
            </Stack>
          </ChartCard>
        </Grid>

        {/* Seasonal Usage */}
        <Grid item xs={12} md={6}>
          <ChartCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TimelineIcon sx={{ color: modernBlue.primary }} />
              <Typography variant="h6" sx={{ ...responsiveTypography.subtitle }}>
                Seasonal Usage
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(analytics.seasonalUsage || {}).map(([season, count]) => ({ 
                season, 
                count 
              }))}>
                <XAxis dataKey="season" />
                <YAxis allowDecimals={false} />
                <Bar dataKey="count" fill={modernBlue.accent} radius={[4, 4, 0, 0]}>
                  {Object.entries(analytics.seasonalUsage || {}).map(([season], idx) => (
                    <Cell key={`cell-season-${season}`} fill={[
                      gradients.warning, // spring
                      gradients.error,   // summer  
                      gradients.accent,  // fall
                      modernBlue.primary // winter
                    ][idx % 4]} />
                  ))}
                </Bar>
                <RechartsTooltip />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>
    </AnalyticsContainer>
  );
};

export default Analytics;
