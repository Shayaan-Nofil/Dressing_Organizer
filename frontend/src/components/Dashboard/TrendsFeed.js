import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, Button, Chip } from '@mui/material';
import { Refresh as RefreshIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyCpIRHDrooZXfGiveOMQr40f5TFyjSZpsg');

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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'seasonal': return 'primary';
      case 'styling': return 'secondary';
      case 'colors': return 'success';
      case 'accessories': return 'warning';
      default: return 'default';
    }
  };

  useEffect(() => {
    generateTrends();
  }, []);

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="primary" />
          Fashion Trends & Tips
        </Typography>
        <Button 
          size="small" 
          onClick={generateTrends} 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
        >
          {loading ? 'Generating...' : 'Refresh'}
        </Button>
      </Box>
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Grid container spacing={2}>
        {trends.map((trend, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {trend.title}
                  </Typography>
                  <Chip 
                    label={trend.category} 
                    size="small" 
                    color={getCategoryColor(trend.category)}
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {trend.description}
                </Typography>
                {trend.relevance && (
                  <Typography variant="caption" color="primary" sx={{ fontStyle: 'italic' }}>
                    💡 {trend.relevance}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TrendsFeed;
