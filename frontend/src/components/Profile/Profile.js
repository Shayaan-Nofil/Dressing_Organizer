import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Button, 
  TextField, 
  Grid, 
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  Height as HeightIcon, 
  Scale as ScaleIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Palette as StyleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  ModernCard,
  ModernButton,
  ModernAvatar,
  modernBlue,
  gradients,
  responsiveContainer,
  responsiveTypography,
  responsiveSpacing,
  shadows
} from '../../theme/modernDesign';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}


function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/user/me', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) {
          let errorText = '';
          try {
            errorText = await res.text();
          } catch {}
          console.error('Profile fetch error:', res.status, errorText);
          throw new Error(`Failed to fetch user info (status ${res.status}): ${errorText}`);
        }
        const data = await res.json();
        setUserData({
          ...data,
          measurements: data.measurements || {
            height: '',
            weight: '',
            bust: '',
            waist: '',
            hips: ''
          },
          stylePreferences: data.stylePreferences || [],
          joinDate: data.joinDate || new Date(data.createdAt).toLocaleDateString() || 'Unknown'
        });
        setEditData({
          ...data,
          measurements: data.measurements || {
            height: '',
            weight: '',
            bust: '',
            waist: '',
            hips: ''
          },
          stylePreferences: data.stylePreferences || []
        });
      } catch (err) {
        setError('Could not load user info. ' + (err.message || ''));
        setUserData(user ? { 
          name: user.name, 
          email: user.email, 
          stylePreferences: [],
          measurements: { height: '', weight: '', bust: '', waist: '', hips: '' }
        } : null);
        setEditData(user ? { 
          name: user.name, 
          email: user.email, 
          stylePreferences: [],
          measurements: { height: '', weight: '', bust: '', waist: '', hips: '' }
        } : null);
        // Also log error for debugging
        console.error('Profile fetch exception:', err);
      
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditData({ ...userData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handleStylePreferenceChange = (e) => {
    const { value } = e.target;
    if (!value) {
      setEditData(prev => ({
        ...prev,
        stylePreferences: []
      }));
      return;
    }
    const preferences = value.split(',').map(p => p.trim()).filter(Boolean);
    setEditData(prev => ({
      ...prev,
      stylePreferences: preferences
    }));
  };

  // Helper: get initials
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase();
  };

  // Render loading/error states
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6">Loading profile...</Typography>
      </Container>
    );
  }
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  if (!userData) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      measurements: {
        ...(prev?.measurements || {}),
        [name]: parseFloat(value) || 0
      }
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Profile
        </Typography>
        {isEditing ? (
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ mr: 1 }}
            >
              Save
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Button 
            variant="contained" 
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        )}
      </Box>
      
      {/* Success/Error Messages */}
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={3000} 
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={5000} 
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              fontSize: '3rem',
              mr: 4
            }}
          >
            {userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : (userData?.email ? userData.email[0].toUpperCase() : 'U')}
          </Avatar>
          <Box>
            {isEditing ? (
              <TextField
                name="name"
                value={editData?.name || ''}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
              />
            ) : (
              <Typography variant="h4" component="h2">
                {userData?.name || userData?.email || 'User Name'}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon color="action" fontSize="small" sx={{ mr: 1 }} />
              {isEditing ? (
                <TextField
                  name="email"
                  value={editData?.email || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  type="email"
                />
              ) : (
                <Typography color="text.secondary">
                  {userData?.email || 'No email'}
                </Typography>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Member since {userData?.joinDate || 'Unknown'}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
          >
            <Tab label="Measurements" {...a11yProps(0)} />
            <Tab label="Preferences" {...a11yProps(1)} />
            <Tab label="Activity" {...a11yProps(2)} />
            <Tab 
              label="Notifications" 
              {...a11yProps(3)} 
              icon={<NotificationsIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Body Measurements
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <HeightIcon color="action" sx={{ mr: 1 }} />
                      <Typography>Height:</Typography>
                      {isEditing ? (
                        <TextField
                          name="height"
                          value={editData?.measurements?.height || ''}
                          onChange={handleMeasurementChange}
                          type="number"
                          size="small"
                          sx={{ ml: 1, width: 80 }}
                          inputProps={{ min: 0 }}
                        />
                      ) : (
                        <Typography sx={{ ml: 1, fontWeight: 'medium' }}>
                          {userData?.measurements?.height || 0} cm
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ScaleIcon color="action" sx={{ mr: 1 }} />
                      <Typography>Weight:</Typography>
                      {isEditing ? (
                        <TextField
                          name="weight"
                          value={editData?.measurements?.weight || ''}
                          onChange={handleMeasurementChange}
                          type="number"
                          size="small"
                          sx={{ ml: 1, width: 80 }}
                          inputProps={{ min: 0, step: 0.1 }}
                        />
                      ) : (
                        <Typography sx={{ ml: 1, fontWeight: 'medium' }}>
                          {userData?.measurements?.weight || 0} kg
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Bust: </Typography>
                      {isEditing ? (
                        <TextField
                          name="bust"
                          value={editData?.measurements?.bust || ''}
                          onChange={handleMeasurementChange}
                          type="number"
                          size="small"
                          sx={{ width: 100 }}
                          inputProps={{ min: 0 }}
                        />
                      ) : (
                        <Typography>{userData?.measurements?.bust || 0} cm</Typography>
                      )}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Waist: </Typography>
                      {isEditing ? (
                        <TextField
                          name="waist"
                          value={editData?.measurements?.waist || ''}
                          onChange={handleMeasurementChange}
                          type="number"
                          size="small"
                          sx={{ width: 100 }}
                          inputProps={{ min: 0 }}
                        />
                      ) : (
                        <Typography>{userData?.measurements?.waist || 0} cm</Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Hips: </Typography>
                      {isEditing ? (
                        <TextField
                          name="hips"
                          value={editData?.measurements?.hips || ''}
                          onChange={handleMeasurementChange}
                          type="number"
                          size="small"
                          sx={{ width: 100 }}
                          inputProps={{ min: 0 }}
                        />
                      ) : (
                        <Typography>{userData?.measurements?.hips || 0} cm</Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Style Preferences
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {isEditing ? (
              <TextField
                fullWidth
                label="Style Preferences (comma-separated)"
                value={editData?.stylePreferences?.join(', ') || ''}
                onChange={handleStylePreferenceChange}
                placeholder="e.g. casual, formal, vintage, modern"
                multiline
                rows={2}
                sx={{ mb: 3 }}
                helperText="Enter your style preferences separated by commas"
              />
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {userData?.stylePreferences?.length > 0 ? (
                  userData.stylePreferences.map((style, index) => (
                    <Chip key={index} label={style} />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No style preferences set
                  </Typography>
                )}
              </Box>
            )}
            
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              More preference options (colors, brands, etc.) can be added in future updates.
            </Typography>
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Added new item"
                  secondary="Blue Denim Jacket was added to your wardrobe"
                />
                <ListItemSecondaryAction>
                  <Typography variant="caption" color="text.secondary">
                    2 hours ago
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Created new outfit"
                  secondary="Casual Friday outfit was created"
                />
                <ListItemSecondaryAction>
                  <Typography variant="caption" color="text.secondary">
                    1 day ago
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Updated profile"
                  secondary="Your profile information was updated"
                />
                <ListItemSecondaryAction>
                  <Typography variant="caption" color="text.secondary">
                    3 days ago
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h6">
                Notification Center
              </Typography>
              <Button
                variant="contained"
                startIcon={<NotificationsIcon />}
                onClick={() => navigate('/notifications')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3
                }}
              >
                Open Full Notification Center
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" mb={3}>
              Manage your notifications, calendar integration, and event reminders. 
              Click the button above to access the full notification management system.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => navigate('/notifications')}
                >
                  <NotificationsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Event Reminders
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Calendar integration and outfit suggestions
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => navigate('/notifications')}
                >
                  <NotificationsIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Unused Item Alerts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get notified about items you haven't worn
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => navigate('/notifications')}
                >
                  <NotificationsIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Notification Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customize your notification preferences
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </TabPanel>
      </Box>
    </Container>
  );
}

export default Profile;
