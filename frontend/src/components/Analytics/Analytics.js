import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
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
} from 'recharts';
import {
  ModernCard,
  ModernButton,
  modernBlue,
  gradients,
  responsiveTypography,
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

// Modern styled components
const GlassBg = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  background: gradients.background || `linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)`,
  padding: theme.spacing(0, 0, 6, 0),
}));

const ModernSectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2rem',
  marginBottom: theme.spacing(2),
  background: gradients.text,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

const StatCard = styled(ModernCard)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: gradients.primary,
  color: 'white',
  boxShadow: shadows.medium,
}));

const ChartCard = styled(ModernCard)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: shadows.medium,
}));

const Analytics = () => {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch('http://localhost:5000/api/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <GlassBg>
        <Container maxWidth="md" sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ModernCard sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress color="primary" sx={{ mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Loading Analytics...</Typography>
            <Typography variant="body2" color="text.secondary">Please wait while we gather your wardrobe insights.</Typography>
          </ModernCard>
        </Container>
      </GlassBg>
    );
  }

  return (
    <GlassBg>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <AnalyticsIcon sx={{ fontSize: '3.5rem', color: modernBlue.primary, mb: 2 }} />
          <ModernSectionHeader variant="h2">
            Wardrobe Analytics
          </ModernSectionHeader>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Insights into your fashion choices and wardrobe utilization
          </Typography>
        </Box>

        {/* Stats Row (Row 1) */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CheckroomIcon sx={{ fontSize: '2.5rem', mb: 1, opacity: 0.85 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{analytics.totalItems}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Total Items</Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CategoryIcon sx={{ fontSize: '2.5rem', mb: 1, opacity: 0.85 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{Object.keys(analytics.categoryBreakdown || {}).length}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Categories</Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <PaletteIcon sx={{ fontSize: '2.5rem', mb: 1, opacity: 0.85 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{Object.keys(analytics.colorBreakdown || {}).length}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Colors</Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <TrendingUpIcon sx={{ fontSize: '2.5rem', mb: 1, opacity: 0.85 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{analytics.mostWornItems?.length || 0}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Tracked Items</Typography>
            </StatCard>
          </Grid>
        </Grid>

        {/* Analytics Charts & Lists (Row 2, 2x2 grid) */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ChartCard>
              <ModernSectionHeader variant="h5">
                <CategoryIcon sx={{ color: modernBlue.primary }} />
                Category Breakdown
              </ModernSectionHeader>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={Object.entries(analytics.categoryBreakdown || {}).map(([category, count]) => ({ name: category, value: count }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill={modernBlue.primary}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
          <Grid item xs={12} md={6}>
            <ChartCard>
              <ModernSectionHeader variant="h5">
                <PaletteIcon sx={{ color: modernBlue.primary }} />
                Color Distribution
              </ModernSectionHeader>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={Object.entries(analytics.colorBreakdown || {}).map(([color, count]) => ({ color, count }))}>
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
          <Grid item xs={12} md={6}>
            <ChartCard>
              <ModernSectionHeader variant="h5">
                <TrendingUpIcon sx={{ color: modernBlue.primary }} />
                Most Worn Items
              </ModernSectionHeader>
              <Stack spacing={2}>
                {analytics.mostWornItems?.length > 0 ? (
                  analytics.mostWornItems.map((item, index) => (
                    <Box key={item._id} sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      background: index % 2 === 0 ? alpha(modernBlue.primary, 0.07) : 'transparent',
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
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No wear data available yet
                  </Typography>
                )}
              </Stack>
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartCard>
              <ModernSectionHeader variant="h5">
                <TimelineIcon sx={{ color: modernBlue.primary }} />
                Seasonal Usage
              </ModernSectionHeader>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={Object.entries(analytics.seasonalUsage || {}).map(([season, count]) => ({ season, count }))}>
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
      </Container>
    </GlassBg>
  );
};

export default Analytics;
