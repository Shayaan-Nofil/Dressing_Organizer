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
  Alert,
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
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  CardActions
} from '@mui/material';
import {
  Public as PublicIcon,
  Group as GroupIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Psychology as PsychologyIcon,
  Visibility as VisibilityIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';

import { getSocialContextAdvice, checkCulturalAppropriateness } from '../../services/gemini';
import { getAllItems } from '../../services/clothing';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

function SocialContextAdvisor() {
  const [userItems, setUserItems] = useState([]);
  const [contextForm, setContextForm] = useState({
    eventType: '',
    location: '',
    culturalContext: '',
    attendeeProfile: '',
    duration: '',
    timeOfDay: '',
    formality: 'casual'
  });
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState([]);
  const [culturalCheck, setCulturalCheck] = useState(null);
  const [culturalCheckOpen, setCulturalCheckOpen] = useState(false);

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

  const handleFormChange = (field, value) => {
    setContextForm(prev => ({ ...prev, [field]: value }));
  };

  const getContextAdvice = async () => {
    setLoading(true);
    try {
      const socialAdvice = await getSocialContextAdvice(contextForm, userItems);
      setAdvice(socialAdvice);
    } catch (error) {
      console.error('Error getting social context advice:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCulturalFit = async () => {
    if (selectedOutfit.length === 0) return;
    
    setLoading(true);
    try {
      const culturalContext = {
        country: contextForm.location,
        occasion: contextForm.eventType,
        customsInfo: contextForm.culturalContext
      };
      
      const result = await checkCulturalAppropriateness(selectedOutfit, culturalContext);
      setCulturalCheck(result);
      setCulturalCheckOpen(true);
    } catch (error) {
      console.error('Error checking cultural appropriateness:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (item) => {
    setSelectedOutfit(prev => {
      const isSelected = prev.find(selected => selected._id === item._id);
      if (isSelected) {
        return prev.filter(selected => selected._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  const getRecommendedItems = (itemIds) => {
    return userItems.filter(item => itemIds.includes(item._id));
  };

  const getConfidenceColor = (level) => {
    if (level >= 8) return 'success';
    if (level >= 6) return 'warning';
    return 'error';
  };

  const getAppropriatenessColor = (status) => {
    switch (status) {
      case 'appropriate': return 'success';
      case 'needs-modification': return 'warning';
      case 'inappropriate': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Social Context Advisor
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Get culturally appropriate outfit suggestions for any social situation
        </Typography>
      </Box>

      {/* Context Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Event Context
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Event Type"
                value={contextForm.eventType}
                onChange={(e) => handleFormChange('eventType', e.target.value)}
                placeholder="e.g., Wedding, Business Meeting, Dinner"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Location/Country"
                value={contextForm.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
                placeholder="e.g., Japan, Saudi Arabia, Paris"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Formality Level</InputLabel>
                <Select
                  value={contextForm.formality}
                  label="Formality Level"
                  onChange={(e) => handleFormChange('formality', e.target.value)}
                >
                  <MenuItem value="very-casual">Very Casual</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="smart-casual">Smart Casual</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="formal">Formal</MenuItem>
                  <MenuItem value="black-tie">Black Tie</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cultural Context"
                value={contextForm.culturalContext}
                onChange={(e) => handleFormChange('culturalContext', e.target.value)}
                placeholder="Religious setting, traditional ceremony, etc."
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Attendee Profile"
                value={contextForm.attendeeProfile}
                onChange={(e) => handleFormChange('attendeeProfile', e.target.value)}
                placeholder="Age group, profession, relationship to you"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Time of Day</InputLabel>
                <Select
                  value={contextForm.timeOfDay}
                  label="Time of Day"
                  onChange={(e) => handleFormChange('timeOfDay', e.target.value)}
                >
                  <MenuItem value="morning">Morning</MenuItem>
                  <MenuItem value="afternoon">Afternoon</MenuItem>
                  <MenuItem value="evening">Evening</MenuItem>
                  <MenuItem value="night">Night</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Duration"
                value={contextForm.duration}
                onChange={(e) => handleFormChange('duration', e.target.value)}
                placeholder="2 hours, all day, etc."
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={getContextAdvice}
              disabled={loading || userItems.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <PsychologyIcon />}
            >
              {loading ? 'Analyzing...' : 'Get Social Context Advice'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Advice Results */}
      {advice && (
        <Grid container spacing={3}>
          {/* Primary Recommendation */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Primary Recommendation
                  </Typography>
                  <Chip
                    label={`Confidence: ${advice.primaryRecommendation?.confidenceLevel}/10`}
                    color={getConfidenceColor(advice.primaryRecommendation?.confidenceLevel)}
                  />
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {getRecommendedItems(advice.primaryRecommendation?.items || []).map((item) => (
                    <Grid item xs={6} sm={4} md={3} key={item._id}>
                      <Card variant="outlined">
                        <Box
                          component="img"
                          src={getImageUrl(item.image) || getPlaceholderImage(150, 150)}
                          alt={item.name}
                          sx={{ width: '100%', height: 120, objectFit: 'cover' }}
                        />
                        <CardContent sx={{ p: 1 }}>
                          <Typography variant="caption" display="block">
                            {item.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  <strong>Why this works:</strong> {advice.primaryRecommendation?.reasoning}
                </Alert>
                
                <Alert severity="success">
                  <strong>Cultural Appropriateness:</strong> {advice.primaryRecommendation?.culturalAppropriatenesss}
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          {/* Cultural Considerations */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <PublicIcon sx={{ mr: 1 }} />
                  Cultural Considerations
                </Typography>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <Typography>Do Wear</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {advice.culturalConsiderations?.doWear?.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <WarningIcon color="error" sx={{ mr: 1 }} />
                    <Typography>Avoid</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {advice.culturalConsiderations?.avoid?.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>

          {/* Social Dynamics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <GroupIcon sx={{ mr: 1 }} />
                  Social Dynamics
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Fits Group Setting:</Typography>
                    {advice.socialDynamics?.fitsGroupSetting ? (
                      <ThumbUpIcon color="success" />
                    ) : (
                      <ThumbDownIcon color="error" />
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Attention Level:</strong> {advice.socialDynamics?.attentionLevel}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    <strong>Confidence Boost:</strong> {advice.socialDynamics?.confidenceBoost}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Alternative Options */}
          {advice.alternativeOptions && advice.alternativeOptions.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Alternative Options
                  </Typography>
                  <Grid container spacing={2}>
                    {advice.alternativeOptions.map((option, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {option.description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {option.whenToChoose}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {getRecommendedItems(option.items || []).map((item) => (
                              <Chip
                                key={item._id}
                                label={item.name}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Manual Outfit Cultural Check */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Check Your Own Outfit
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select items from your wardrobe to check cultural appropriateness
          </Typography>
          
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {userItems.slice(0, 12).map((item) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={item._id}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    border: selectedOutfit.find(selected => selected._id === item._id) ? 2 : 1,
                    borderColor: selectedOutfit.find(selected => selected._id === item._id) ? 'primary.main' : 'divider'
                  }}
                  onClick={() => toggleItemSelection(item)}
                >
                  <Box
                    component="img"
                    src={getImageUrl(item.image) || getPlaceholderImage(100, 100)}
                    alt={item.name}
                    sx={{ width: '100%', height: 80, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="caption" display="block" noWrap>
                      {item.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {selectedOutfit.length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Selected: {selectedOutfit.map(item => item.name).join(', ')}
              </Typography>
              <Button
                variant="outlined"
                onClick={checkCulturalFit}
                disabled={loading}
                startIcon={<VisibilityIcon />}
              >
                Check Cultural Appropriateness
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {userItems.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Add some clothing items to your wardrobe first to get personalized social context advice.
        </Alert>
      )}

      {/* Cultural Check Dialog */}
      <Dialog
        open={culturalCheckOpen}
        onClose={() => setCulturalCheckOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Cultural Appropriateness Assessment</DialogTitle>
        <DialogContent>
          {culturalCheck && (
            <>
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Chip
                  label={culturalCheck.overallAppropriateness}
                  color={getAppropriatenessColor(culturalCheck.overallAppropriateness)}
                  size="large"
                />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Confidence: {culturalCheck.confidenceScore}/10
                </Typography>
              </Box>

              {culturalCheck.specificIssues && culturalCheck.specificIssues.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Specific Issues</Typography>
                  {culturalCheck.specificIssues.map((issue, index) => (
                    <Alert severity={issue.severity === 'major' ? 'error' : issue.severity === 'moderate' ? 'warning' : 'info'} sx={{ mb: 1 }} key={index}>
                      <strong>{issue.item}:</strong> {issue.concern}
                      <br />
                      <em>Suggestion: {issue.suggestion}</em>
                    </Alert>
                  ))}
                </Box>
              )}

              {culturalCheck.positiveAspects && culturalCheck.positiveAspects.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>What Works Well</Typography>
                  <List>
                    {culturalCheck.positiveAspects.map((aspect, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={aspect} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {culturalCheck.learningPoints && culturalCheck.learningPoints.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Cultural Insights</Typography>
                  <List>
                    {culturalCheck.learningPoints.map((point, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <InfoIcon color="info" />
                        </ListItemIcon>
                        <ListItemText primary={point} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCulturalCheckOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SocialContextAdvisor;
