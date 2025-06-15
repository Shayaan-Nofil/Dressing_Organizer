import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Paper,
  Tab,
  Tabs,
  Fade
} from '@mui/material';
import {
  SmartToy as SmartToyIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

import SmartWardrobeAssistant from '../Wardrobe/SmartWardrobeAssistant';
import SocialContextAdvisor from '../Social/SocialContextAdvisor';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ai-tabpanel-${index}`}
      aria-labelledby={`ai-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={500}>
          <Box sx={{ pt: 3 }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
}

function AIFeatures() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const aiFeatures = [
    {
      id: 'wardrobe-assistant',
      title: 'Smart Wardrobe Assistant',
      description: 'Get AI-powered insights into your wardrobe, discover gaps, and receive personalized shopping recommendations.',
      icon: <SmartToyIcon sx={{ fontSize: 40 }} />,
      features: ['Wardrobe Gap Analysis', 'Shopping Recommendations', 'Style Insights', 'Seasonal Planning'],
      color: '#2196F3'
    },
    {
      id: 'social-advisor',
      title: 'Social Context Advisor',
      description: 'Receive culturally appropriate outfit suggestions and event-based fashion advice powered by AI.',
      icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
      features: ['Cultural Appropriateness Check', 'Event-Based Suggestions', 'Social Context Analysis', 'Fashion Etiquette'],
      color: '#9C27B0'
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box py={4}>
        {/* Header Section */}
        <Box textAlign="center" mb={4}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <AutoAwesomeIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
            <Typography variant="h3" component="h1" fontWeight="bold">
              AI Features
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
            Harness the power of artificial intelligence to enhance your wardrobe management 
            and fashion decision-making with our advanced AI tools.
          </Typography>
        </Box>

        {/* AI Features Tabs */}
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={selectedTab} 
              onChange={handleTabChange} 
              aria-label="AI features tabs"
              centered
              sx={{
                '& .MuiTab-root': {
                  minHeight: 60,
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }
              }}
            >
              <Tab 
                icon={<SmartToyIcon />}
                label="Smart Wardrobe Assistant" 
                id="ai-tab-0"
                aria-controls="ai-tabpanel-0"
                iconPosition="start"
                sx={{ color: aiFeatures[0].color }}
              />
              <Tab 
                icon={<PsychologyIcon />}
                label="Social Context Advisor" 
                id="ai-tab-1"
                aria-controls="ai-tabpanel-1"
                iconPosition="start"
                sx={{ color: aiFeatures[1].color }}
              />
            </Tabs>
          </Box>
          
          {/* Tab Panels */}
          <TabPanel value={selectedTab} index={0}>
            <SmartWardrobeAssistant />
          </TabPanel>
          
          <TabPanel value={selectedTab} index={1}>
            <SocialContextAdvisor />
          </TabPanel>
        </Paper>

        {/* AI Benefits Section */}
        <Box mt={6} textAlign="center">
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Why Use AI for Fashion?
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box>
                <TrendingUpIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Data-Driven Insights
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Make informed fashion decisions based on AI analysis of your wardrobe patterns and preferences.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <AutoAwesomeIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Personalized Recommendations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive tailored suggestions that match your style, budget, and lifestyle needs.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <PsychologyIcon sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Cultural Awareness
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ensure your outfit choices are appropriate for different cultural contexts and social situations.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default AIFeatures;
