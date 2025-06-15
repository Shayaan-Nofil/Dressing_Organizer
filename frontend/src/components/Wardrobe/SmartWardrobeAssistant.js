import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Lightbulb as LightbulbIcon,
  Palette as PaletteIcon,
  ExpandMore as ExpandMoreIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

import { analyzeWardrobeGaps, generateShoppingList } from '../../services/gemini';
import { getAllItems } from '../../services/clothing';

function SmartWardrobeAssistant() {
  const [userItems, setUserItems] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    budget: 'moderate',
    lifestyle: 'casual',
    priorities: []
  });
  const [shopDialogOpen, setShopDialogOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(500);

  useEffect(() => {
    fetchUserItems();
  }, []);

  const fetchUserItems = async () => {
    try {
      const items = await getAllItems();
      setUserItems(items);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const analyzeWardrobe = async () => {
    setLoading(true);
    try {
      const wardrobeAnalysis = await analyzeWardrobeGaps(userItems, preferences);
      setAnalysis(wardrobeAnalysis);
    } catch (error) {
      console.error('Error analyzing wardrobe:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateShoppingRecommendations = async () => {
    setLoading(true);
    try {
      const recommendations = await generateShoppingList(
        userItems, 
        { maxAmount: budgetAmount, priority: 'essentials' },
        'current'
      );
      setShoppingList(recommendations);
      setShopDialogOpen(true);
    } catch (error) {
      console.error('Error generating shopping list:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    if (typeof priority === 'number') {
      if (priority >= 4) return 'error';
      if (priority >= 3) return 'warning';
      return 'info';
    }
    
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'success';
    if (score >= 6) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Smart Wardrobe Assistant
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          AI-powered analysis and recommendations for your wardrobe
        </Typography>
      </Box>

      {/* Preferences Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Preferences
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Budget Level</InputLabel>
                <Select
                  value={preferences.budget}
                  label="Budget Level"
                  onChange={(e) => setPreferences({...preferences, budget: e.target.value})}
                >
                  <MenuItem value="tight">Tight Budget</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="flexible">Flexible</MenuItem>
                  <MenuItem value="luxury">Luxury</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Lifestyle</InputLabel>
                <Select
                  value={preferences.lifestyle}
                  label="Lifestyle"
                  onChange={(e) => setPreferences({...preferences, lifestyle: e.target.value})}
                >
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="social">Social</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="mixed">Mixed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Shopping Budget ($)"
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(parseInt(e.target.value))}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={analyzeWardrobe}
              disabled={loading || userItems.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <AssessmentIcon />}
            >
              {loading ? 'Analyzing...' : 'Analyze My Wardrobe'}
            </Button>
            <Button
              variant="outlined"
              onClick={generateShoppingRecommendations}
              disabled={loading || userItems.length === 0}
              startIcon={<ShoppingCartIcon />}
              sx={{ ml: 2 }}
            >
              Generate Shopping List
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Grid container spacing={3}>
          {/* Overall Score */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Wardrobe Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h3" color={getScoreColor(analysis.styleOptimization?.overallScore || 0)}>
                    {analysis.styleOptimization?.overallScore || 0}/10
                  </Typography>
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(analysis.styleOptimization?.overallScore || 0) * 10}
                      color={getScoreColor(analysis.styleOptimization?.overallScore || 0)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {analysis.styleOptimization?.colorPaletteAdvice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Overview
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Missing Essentials:</Typography>
                  <Chip
                    label={analysis.gapsAnalysis?.missingEssentials?.length || 0}
                    color="error"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Strategic Purchases:</Typography>
                  <Chip
                    label={analysis.strategicPurchases?.length || 0}
                    color="warning"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Redundant Items:</Typography>
                  <Chip
                    label={analysis.redundantItems?.length || 0}
                    color="info"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Detailed Analysis */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detailed Analysis
                </Typography>
                
                {/* Missing Essentials */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <WarningIcon color="error" sx={{ mr: 1 }} />
                    <Typography>Missing Essentials ({analysis.gapsAnalysis?.missingEssentials?.length || 0})</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {analysis.gapsAnalysis?.missingEssentials?.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <WarningIcon color="error" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                {/* Strategic Purchases */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <TrendingUpIcon color="warning" sx={{ mr: 1 }} />
                    <Typography>Strategic Purchase Recommendations</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {analysis.strategicPurchases?.map((purchase, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                              <Typography variant="subtitle2">{purchase.item}</Typography>
                              <Chip
                                label={purchase.priority}
                                color={getPriorityColor(purchase.priority)}
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {purchase.reasoning}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption">
                                Versatility: {purchase.versatilityScore}/10
                              </Typography>
                              <Typography variant="caption" color="primary">
                                {purchase.estimatedCost}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {/* Style Optimization */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <PaletteIcon color="info" sx={{ mr: 1 }} />
                    <Typography>Style Optimization Tips</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {analysis.styleOptimization?.versatilityTips?.map((tip, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <LightbulbIcon color="info" />
                          </ListItemIcon>
                          <ListItemText primary={tip} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {userItems.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Add some clothing items to your wardrobe first to get personalized analysis and recommendations.
        </Alert>
      )}

      {/* Shopping List Dialog */}
      <Dialog
        open={shopDialogOpen}
        onClose={() => setShopDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Smart Shopping Recommendations</DialogTitle>
        <DialogContent>
          {shoppingList && (
            <>
              <Typography variant="h6" gutterBottom>
                Potential Outfit Combinations: {shoppingList.maxOutfitPotential}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {Object.entries(shoppingList.budgetBreakdown || {}).map(([category, amount]) => (
                  <Grid item xs={4} key={category}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption">{category}</Typography>
                      <Typography variant="h6" color="primary">{amount}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <List>
                {shoppingList.shoppingList?.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">{item.item}</Typography>
                            <Chip
                              label={`Priority ${item.priority}`}
                              color={getPriorityColor(item.priority)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {item.reasoning}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Works with: {item.compatibleWith?.join(', ')}
                            </Typography>
                            <Typography variant="caption" color="primary">
                              Est. Price: {item.estimatedPrice}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < shoppingList.shoppingList.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShopDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SmartWardrobeAssistant;
