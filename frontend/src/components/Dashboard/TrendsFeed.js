import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, Button, Chip, Avatar, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Refresh as RefreshIcon, TrendingUp as TrendingUpIcon, AutoAwesome as SparkleIcon } from '@mui/icons-material';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyCpIRHDrooZXfGiveOMQr40f5TFyjSZpsg');

// Styled components - Modern, minimalistic design matching Dashboard
const TrendCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 20,
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

const RefreshButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1, 2),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.875rem',
  border: 'none',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: 'white',
  boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 32px ${theme.palette.primary.main}50`,
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  },
  '&:disabled': {
    background: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0, 0, 0, 0.26)',
    transform: 'none',
    boxShadow: 'none'
  }
}));

const CategoryChip = styled(Chip)(({ theme, categorytype }) => {
  const getGradient = () => {
    switch (categorytype) {
      case 'seasonal': 
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'styling': 
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'colors': 
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'accessories': 
        return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
      default: 
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  return {
    background: getGradient(),
    color: 'white',
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 28,
    borderRadius: 14,
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    '& .MuiChip-label': {
      padding: '0 12px'
    }
  };
});

const TrendIcon = styled(Avatar)(({ theme, categorytype }) => {
  const getGradient = () => {
    switch (categorytype) {
      case 'seasonal': 
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'styling': 
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'colors': 
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'accessories': 
        return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
      default: 
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  return {
    background: getGradient(),
    width: 48,
    height: 48,
    marginBottom: theme.spacing(2),
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
  };
});

function TrendsFeed({ userItems = [] }) {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateTrends = async () => {
    setLoading(true);
    setError('');
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const currentSeason = getCurrentSeason();
      const userCategories = [...new Set(userItems.map(item => item.category))];
      const userColors = [...new Set(userItems.map(item => item.color))];
      
      const prompt = `Generate 4 fashion trends and styling tips for ${currentSeason} 2025. Consider these user preferences:
      
User's wardrobe categories: ${userCategories.join(', ') || 'general'}
User's color palette: ${userColors.join(', ') || 'various colors'}

Return a JSON array of trends with this structure:
[
  {
    "title": "Trend Name",
    "description": "Brief description with styling tips",
    "category": "one of: seasonal, styling, colors, accessories",
    "relevance": "how this applies to the user's wardrobe"
  }
]

Make the trends current, practical, and personalized to the user's existing wardrobe.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to extract JSON from markdown code block if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : text;
      
      const generatedTrends = JSON.parse(jsonString);
      setTrends(generatedTrends);
    } catch (error) {
      console.error('Error generating trends:', error);
      setError('Failed to generate trends');
      // Fallback to static trends
      setTrends(getStaticTrends());
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Summer';
    if (month >= 9 && month <= 11) return 'Fall';
    return 'Winter';
  };

  const getStaticTrends = () => [
    {
      title: 'Summer Essentials',
      description: 'Lightweight shirts, linen pants, and pastel colors are trending this summer!',
      category: 'seasonal',
      relevance: 'Perfect for hot weather styling'
    },
    {
      title: 'Layering Techniques',
      description: 'Master the art of layering with different textures and lengths.',
      category: 'styling',
      relevance: 'Works with your existing pieces'
    },
    {
      title: 'Color Coordination',
      description: 'Learn to mix and match colors from your wardrobe effectively.',
      category: 'colors',
      relevance: 'Maximize your outfit combinations'
    },
    {
      title: 'Statement Accessories',
      description: 'Transform basic outfits with bold accessories and jewelry.',
      category: 'accessories',
      relevance: 'Elevate your current wardrobe'
    }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'seasonal': return '🌸';
      case 'styling': return '✨';
      case 'colors': return '🎨';
      case 'accessories': return '💎';
      default: return '👗';
    }
  };

  useEffect(() => {
    generateTrends();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: 56, 
            height: 56,
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
          }}>
            <TrendingUpIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h5" 
              fontWeight={700}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 0.5
              }}
            >
              Fashion Trends & Tips
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Personalized recommendations for your wardrobe
            </Typography>
          </Box>
        </Box>
        <RefreshButton 
          size="medium" 
          onClick={generateTrends} 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
        >
          {loading ? 'Generating...' : 'Refresh'}
        </RefreshButton>
      </Box>
      
      {error && (
        <Box sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(211, 47, 47, 0.1))',
          border: '1px solid rgba(244, 67, 54, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <SparkleIcon sx={{ color: 'error.main' }} />
          <Typography color="error.main" variant="body2" fontWeight={500}>
            {error}
          </Typography>
        </Box>
      )}
      
      <Grid container spacing={3}>
        {trends.map((trend, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <TrendCard>
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <TrendIcon categorytype={trend.category}>
                    <Typography variant="h6">{getCategoryIcon(trend.category)}</Typography>
                  </TrendIcon>
                  <CategoryChip 
                    label={trend.category} 
                    size="small" 
                    categorytype={trend.category}
                  />
                </Box>
                
                <Typography 
                  variant="h6" 
                  fontWeight={700} 
                  sx={{ 
                    mb: 2,
                    background: 'linear-gradient(135deg, #333 0%, #666 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {trend.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2, 
                    flexGrow: 1,
                    lineHeight: 1.6,
                    fontWeight: 500
                  }}
                >
                  {trend.description}
                </Typography>
                
                {trend.relevance && (
                  <Box sx={{
                    mt: 'auto',
                    p: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                  }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'primary.main',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <SparkleIcon sx={{ fontSize: 16 }} />
                      {trend.relevance}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </TrendCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TrendsFeed;
