import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Fab,
  CircularProgress,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Sync as SyncIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as AccessTimeIcon,
  Checkroom as CheckroomIcon
} from '@mui/icons-material';

import {
  getNotificationSettings,
  updateNotificationSettings,
  createEventReminder,
  getUpcomingEvents,
  connectGoogleCalendar,
  syncCalendarEvents,
  getUnusedItemNotifications,
  snoozeUnusedItemAlert,
  registerForPushNotifications
} from '../../services/enhancedNotifications';

function EnhancedNotificationCenter() {
  const [settings, setSettings] = useState({
    unusedItemAlerts: true,
    unusedItemDays: 30,
    eventBasedSuggestions: true,
    advanceNoticeDays: 2,
    seasonalReminders: true,
    pushNotifications: false,
    emailNotifications: true
  });
  
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [unusedItems, setUnusedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'casual',
    location: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [settingsData, eventsData, unusedData] = await Promise.allSettled([
        getNotificationSettings(),
        getUpcomingEvents(),
        getUnusedItemNotifications()
      ]);

      if (settingsData.status === 'fulfilled') {
        setSettings(settingsData.value);
      }
      if (eventsData.status === 'fulfilled') {
        setUpcomingEvents(eventsData.value);
        setCalendarConnected(eventsData.value.length > 0);
      }
      if (unusedData.status === 'fulfilled') {
        setUnusedItems(unusedData.value);
      }
    } catch (error) {
      console.error('Error loading notification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await updateNotificationSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      // Revert on error
      setSettings(settings);
    }
  };

  const handleConnectCalendar = async () => {
    try {
      // This would typically open Google OAuth flow
      const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/calendar-callback')}&scope=https://www.googleapis.com/auth/calendar.readonly&response_type=code`;
      
      // For demo purposes, we'll simulate a successful connection
      setCalendarConnected(true);
      Alert('Calendar connection feature would open Google OAuth here');
    } catch (error) {
      console.error('Error connecting calendar:', error);
    }
  };

  const handleSyncCalendar = async () => {
    setLoading(true);
    try {
      await syncCalendarEvents();
      await loadData();
    } catch (error) {
      console.error('Error syncing calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      await createEventReminder(newEvent);
      setEventDialogOpen(false);
      setNewEvent({
        title: '',
        date: '',
        time: '',
        type: 'casual',
        location: '',
        description: ''
      });
      await loadData();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleSnoozeItem = async (itemId, days = 7) => {
    try {
      await snoozeUnusedItemAlert(itemId, days);
      await loadData();
    } catch (error) {
      console.error('Error snoozing alert:', error);
    }
  };

  const handleEnablePushNotifications = async () => {
    try {
      await registerForPushNotifications();
      await handleSettingChange('pushNotifications', true);
    } catch (error) {
      console.error('Error enabling push notifications:', error);
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'formal': return 'primary';
      case 'business': return 'secondary';
      case 'party': return 'warning';
      case 'wedding': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Enhanced Notification Center
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your wardrobe notifications and calendar integration
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <SettingsIcon sx={{ mr: 1 }} />
                Notification Settings
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2">Unused Item Alerts</Typography>
                  <Switch
                    checked={settings.unusedItemAlerts}
                    onChange={(e) => handleSettingChange('unusedItemAlerts', e.target.checked)}
                  />
                </Box>
                
                {settings.unusedItemAlerts && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Alert After (Days)</InputLabel>
                    <Select
                      value={settings.unusedItemDays}
                      label="Alert After (Days)"
                      onChange={(e) => handleSettingChange('unusedItemDays', e.target.value)}
                    >
                      <MenuItem value={14}>14 Days</MenuItem>
                      <MenuItem value={30}>30 Days</MenuItem>
                      <MenuItem value={60}>60 Days</MenuItem>
                      <MenuItem value={90}>90 Days</MenuItem>
                    </Select>
                  </FormControl>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2">Event-Based Suggestions</Typography>
                  <Switch
                    checked={settings.eventBasedSuggestions}
                    onChange={(e) => handleSettingChange('eventBasedSuggestions', e.target.checked)}
                  />
                </Box>
                
                {settings.eventBasedSuggestions && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Advance Notice (Days)</InputLabel>
                    <Select
                      value={settings.advanceNoticeDays}
                      label="Advance Notice (Days)"
                      onChange={(e) => handleSettingChange('advanceNoticeDays', e.target.value)}
                    >
                      <MenuItem value={1}>1 Day</MenuItem>
                      <MenuItem value={2}>2 Days</MenuItem>
                      <MenuItem value={3}>3 Days</MenuItem>
                      <MenuItem value={7}>1 Week</MenuItem>
                    </Select>
                  </FormControl>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2">Seasonal Reminders</Typography>
                  <Switch
                    checked={settings.seasonalReminders}
                    onChange={(e) => handleSettingChange('seasonalReminders', e.target.checked)}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2">Push Notifications</Typography>
                  <Button
                    size="small"
                    variant={settings.pushNotifications ? "outlined" : "contained"}
                    onClick={settings.pushNotifications ? () => handleSettingChange('pushNotifications', false) : handleEnablePushNotifications}
                  >
                    {settings.pushNotifications ? 'Enabled' : 'Enable'}
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Email Notifications</Typography>
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Calendar Integration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CalendarIcon sx={{ mr: 1 }} />
                Calendar Integration
              </Typography>
              
              {!calendarConnected ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CalendarIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Connect your calendar to get outfit suggestions for upcoming events
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleConnectCalendar}
                    startIcon={<CalendarIcon />}
                  >
                    Connect Google Calendar
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Calendar connected successfully!
                  </Alert>
                  <Button
                    variant="outlined"
                    onClick={handleSyncCalendar}
                    startIcon={loading ? <CircularProgress size={16} /> : <SyncIcon />}
                    disabled={loading}
                    sx={{ mb: 2 }}
                  >
                    {loading ? 'Syncing...' : 'Sync Events'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  <EventIcon sx={{ mr: 1 }} />
                  Upcoming Events ({upcomingEvents.length})
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setEventDialogOpen(true)}
                  startIcon={<AddIcon />}
                >
                  Add Event
                </Button>
              </Box>
              
              {upcomingEvents.length > 0 ? (
                <List>
                  {upcomingEvents.map((event, index) => (
                    <React.Fragment key={event.id || index}>
                      <ListItem>
                        <ListItemIcon>
                          <EventIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2">{event.title}</Typography>
                              <Chip
                                label={event.type}
                                color={getEventTypeColor(event.type)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2">
                                {event.date} at {event.time}
                              </Typography>
                              {event.location && (
                                <Typography variant="caption" color="text.secondary">
                                  📍 {event.location}
                                </Typography>
                              )}
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Button size="small" variant="outlined">
                            Get Outfit Suggestion
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < upcomingEvents.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  No upcoming events. Add an event or connect your calendar to get outfit suggestions.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Unused Items Alerts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <WarningIcon sx={{ mr: 1 }} />
                Unused Items Alert ({unusedItems.length})
              </Typography>
              
              {unusedItems.length > 0 ? (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Items not worn in {settings.unusedItemDays}+ days</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {unusedItems.map((item, index) => (
                        <React.Fragment key={item.id || index}>
                          <ListItem>
                            <ListItemIcon>
                              <CheckroomIcon color="warning" />
                            </ListItemIcon>
                            <ListItemText
                              primary={item.name}
                              secondary={`Last worn: ${item.lastWorn ? new Date(item.lastWorn).toLocaleDateString() : 'Never'} • ${item.daysSinceWorn} days ago`}
                            />
                            <ListItemSecondaryAction>
                              <Button
                                size="small"
                                onClick={() => handleSnoozeItem(item.id, 7)}
                                sx={{ mr: 1 }}
                              >
                                Snooze 7d
                              </Button>
                              <Button
                                size="small"
                                onClick={() => handleSnoozeItem(item.id, 30)}
                              >
                                Snooze 30d
                              </Button>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < unusedItems.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ) : (
                <Alert severity="success">
                  Great! All your items have been worn recently.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Event Dialog */}
      <Dialog
        open={eventDialogOpen}
        onClose={() => setEventDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={newEvent.type}
                  label="Event Type"
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                >
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="formal">Formal</MenuItem>
                  <MenuItem value="party">Party</MenuItem>
                  <MenuItem value="wedding">Wedding</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEventDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateEvent}
            variant="contained"
            disabled={!newEvent.title || !newEvent.date}
          >
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default EnhancedNotificationCenter;
