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
  Stack,
  alpha
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
  Palette as StyleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon
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

// Styled components for modern design
const ModernTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: alpha(theme.palette.background.paper, 0.9),
      transform: 'translateY(-1px)',
    },
    '&.Mui-focused': {
      background: alpha(theme.palette.background.paper, 1),
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 32px ${alpha(modernBlue.primary, 0.3)}`,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(modernBlue.primary, 0.3),
    borderWidth: '1px',
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.primary,
    fontWeight: 500,
  },
}));

const ModernTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-root': {
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(20px)',
    borderRadius: '16px 16px 0 0',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    transition: 'all 0.3s ease',
    '&:hover': {
      color: modernBlue.primary,
      transform: 'translateY(-2px)',
    },
    '&.Mui-selected': {
      color: modernBlue.primary,
      fontWeight: 700,
    },
  },
  '& .MuiTabs-indicator': {
    background: gradients.primary,
    height: 3,
    borderRadius: '3px 3px 0 0',
  },
}));

const ProfileHeaderCard = styled(ModernCard)(({ theme }) => ({
  background: `linear-gradient(145deg, 
    ${alpha(theme.palette.background.paper, 0.9)}, 
    ${alpha(theme.palette.background.paper, 0.7)}
  )`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginBottom: theme.spacing(3),
  overflow: 'visible',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: gradients.primary,
    borderRadius: '16px 16px 0 0',
  },
}));

const MeasurementCard = styled(ModernCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const ActivityListItem = styled(ListItem)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.5),
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  marginBottom: theme.spacing(1),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha(theme.palette.background.paper, 0.8),
    transform: 'translateX(8px)',
    boxShadow: shadows.modern,
  },
}));

const NotificationFeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(145deg, 
    ${alpha(theme.palette.background.paper, 0.8)}, 
    ${alpha(theme.palette.background.paper, 0.6)}
  )`,
  backdropFilter: 'blur(15px)',
  borderRadius: '16px',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:hover': {
    background: `linear-gradient(145deg, 
      ${alpha(theme.palette.background.paper, 0.9)}, 
      ${alpha(theme.palette.background.paper, 0.7)}
    )`,
    transform: 'translateY(-8px)',
    boxShadow: shadows.modern,
  },
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: gradients.text,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

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

  // Render loading/error states
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: gradients.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}>
        <ModernCard sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Box sx={{ 
            width: 60, 
            height: 60, 
            borderRadius: '50%',
            background: gradients.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            animation: 'pulse 2s infinite'
          }}>
            <PersonIcon sx={{ fontSize: '2rem', color: 'white' }} />
          </Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            background: gradients.text,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Loading your profile...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we fetch your information
          </Typography>
        </ModernCard>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: gradients.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}>
        <ModernCard sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
          <Box sx={{ 
            width: 60, 
            height: 60, 
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem'
          }}>
            <PersonIcon sx={{ fontSize: '2rem', color: 'white' }} />
          </Box>
          <Typography variant="h6" color="error" sx={{ fontWeight: 600, mb: 1 }}>
            Unable to Load Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <ModernButton 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{
              background: gradients.primary,
              '&:hover': {
                background: gradients.primary,
                transform: 'translateY(-2px)',
                boxShadow: shadows.modern,
              }
            }}
          >
            Try Again
          </ModernButton>
        </ModernCard>
      </Box>
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
    <Box sx={{ 
      minHeight: '100vh',
      background: gradients.background,
      py: 4
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <SectionHeader variant="h3" component="h1">
            <AccountIcon sx={{ fontSize: '2rem', color: modernBlue.primary }} />
            My Profile
          </SectionHeader>
          {isEditing ? (
            <Stack direction="row" spacing={2}>
              <ModernButton 
                variant="contained" 
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saveLoading}
                sx={{
                  background: gradients.success,
                  '&:hover': {
                    background: gradients.success,
                    transform: 'translateY(-2px)',
                    boxShadow: shadows.modern,
                  }
                }}
              >
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </ModernButton>
              <ModernButton 
                variant="outlined" 
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{
                  borderColor: alpha(modernBlue.primary, 0.3),
                  color: modernBlue.primary,
                  '&:hover': {
                    borderColor: modernBlue.primary,
                    background: alpha(modernBlue.primary, 0.1),
                  }
                }}
              >
                Cancel
              </ModernButton>
            </Stack>
          ) : (
            <ModernButton 
              variant="contained" 
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                background: gradients.primary,
                '&:hover': {
                  background: gradients.primary,
                  transform: 'translateY(-2px)',
                  boxShadow: shadows.modern,
                }
              }}
            >
              Edit Profile
            </ModernButton>
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
        
        {/* Profile Header Card */}
        <ProfileHeaderCard>
          <Box sx={{ p: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
            <ModernAvatar 
              sx={{ 
                width: 120, 
                height: 120, 
                fontSize: '3rem',
                background: gradients.primary,
                boxShadow: shadows.modern,
              }}
            >
              {userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : (userData?.email ? userData.email[0].toUpperCase() : 'U')}
            </ModernAvatar>
            <Box sx={{ flex: 1, minWidth: '300px' }}>
              {isEditing ? (
                <ModernTextField
                  name="name"
                  label="Full Name"
                  value={editData?.name || ''}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="h4" component="h2" sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  background: gradients.text,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {userData?.name || userData?.email || 'User Name'}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                <EmailIcon sx={{ color: modernBlue.primary, fontSize: '1.2rem' }} />
                {isEditing ? (
                  <ModernTextField
                    name="email"
                    label="Email Address"
                    value={editData?.email || ''}
                    onChange={handleInputChange}
                    variant="outlined"
                    type="email"
                    sx={{ flex: 1, minWidth: '250px' }}
                  />
                ) : (
                  <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                    {userData?.email || 'No email'}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" sx={{ 
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <PersonIcon sx={{ fontSize: '1rem' }} />
                Member since {userData?.joinDate || 'Unknown'}
              </Typography>
            </Box>
          </Box>
        </ProfileHeaderCard>
        
        {/* Tabs Section */}
        <ModernCard sx={{ overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <ModernTabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="profile tabs"
              variant="fullWidth"
            >
              <Tab 
                label="Measurements" 
                icon={<HeightIcon />}
                iconPosition="start"
                {...a11yProps(0)} 
              />
              <Tab 
                label="Preferences" 
                icon={<StyleIcon />}
                iconPosition="start"
                {...a11yProps(1)} 
              />
              <Tab 
                label="Activity" 
                icon={<AssessmentIcon />}
                iconPosition="start"
                {...a11yProps(2)} 
              />
              <Tab 
                label="Notifications" 
                icon={<NotificationsIcon />}
                iconPosition="start"
                {...a11yProps(3)} 
              />
            </ModernTabs>
          </Box>
          
          {/* Measurements Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MeasurementCard>
                  <Box sx={{ p: 3 }}>
                    <SectionHeader variant="h6">
                      <HeightIcon sx={{ color: modernBlue.primary }} />
                      Body Measurements
                    </SectionHeader>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          p: 2, 
                          background: alpha('#fff', 0.1),
                          borderRadius: 2,
                          mb: 2 
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HeightIcon sx={{ color: modernBlue.primary, fontSize: '1.2rem' }} />
                            <Typography fontWeight={600}>Height:</Typography>
                          </Box>
                          {isEditing ? (
                            <ModernTextField
                              name="height"
                              value={editData?.measurements?.height || ''}
                              onChange={handleMeasurementChange}
                              type="number"
                              size="small"
                              sx={{ width: 100 }}
                              inputProps={{ min: 0 }}
                              InputProps={{
                                endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>cm</Typography>
                              }}
                            />
                          ) : (
                            <Typography sx={{ fontWeight: 'bold', color: modernBlue.primary }}>
                              {userData?.measurements?.height || 0} cm
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          p: 2, 
                          background: alpha('#fff', 0.1),
                          borderRadius: 2,
                          mb: 2 
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScaleIcon sx={{ color: modernBlue.primary, fontSize: '1.2rem' }} />
                            <Typography fontWeight={600}>Weight:</Typography>
                          </Box>
                          {isEditing ? (
                            <ModernTextField
                              name="weight"
                              value={editData?.measurements?.weight || ''}
                              onChange={handleMeasurementChange}
                              type="number"
                              size="small"
                              sx={{ width: 100 }}
                              inputProps={{ min: 0, step: 0.1 }}
                              InputProps={{
                                endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>kg</Typography>
                              }}
                            />
                          ) : (
                            <Typography sx={{ fontWeight: 'bold', color: modernBlue.primary }}>
                              {userData?.measurements?.weight || 0} kg
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {['bust', 'waist', 'hips'].map((measurement) => (
                          <Box 
                            key={measurement}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              p: 2, 
                              background: alpha('#fff', 0.1),
                              borderRadius: 2,
                              mb: 2 
                            }}
                          >
                            <Typography fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                              {measurement}:
                            </Typography>
                            {isEditing ? (
                              <ModernTextField
                                name={measurement}
                                value={editData?.measurements?.[measurement] || ''}
                                onChange={handleMeasurementChange}
                                type="number"
                                size="small"
                                sx={{ width: 100 }}
                                inputProps={{ min: 0 }}
                                InputProps={{
                                  endAdornment: <Typography variant="body2" sx={{ ml: 1 }}>cm</Typography>
                                }}
                              />
                            ) : (
                              <Typography sx={{ fontWeight: 'bold', color: modernBlue.primary }}>
                                {userData?.measurements?.[measurement] || 0} cm
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Grid>
                    </Grid>
                  </Box>
                </MeasurementCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <MeasurementCard>
                  <Box sx={{ p: 3 }}>
                    <SectionHeader variant="h6">
                      <SettingsIcon sx={{ color: modernBlue.primary }} />
                      Measurement Tips
                    </SectionHeader>
                    <Box sx={{ 
                      p: 3, 
                      background: alpha(modernBlue.primary, 0.1),
                      borderRadius: 2,
                      border: `1px solid ${alpha(modernBlue.primary, 0.2)}`
                    }}>
                      <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                        📏 <strong>Accurate measurements help us:</strong>
                      </Typography>
                      <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                        <li><Typography variant="body2" sx={{ mb: 1 }}>Suggest better fitting clothes</Typography></li>
                        <li><Typography variant="body2" sx={{ mb: 1 }}>Recommend appropriate sizes</Typography></li>
                        <li><Typography variant="body2" sx={{ mb: 1 }}>Create more accurate outfit combinations</Typography></li>
                        <li><Typography variant="body2">Provide personalized style advice</Typography></li>
                      </ul>
                    </Box>
                  </Box>
                </MeasurementCard>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Preferences Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <ModernCard sx={{ height: 'fit-content' }}>
                  <Box sx={{ p: 3 }}>
                    <SectionHeader variant="h6">
                      <StyleIcon sx={{ color: modernBlue.primary }} />
                      Style Preferences
                    </SectionHeader>
                    
                    {isEditing ? (
                      <ModernTextField
                        fullWidth
                        label="Style Preferences"
                        value={editData?.stylePreferences?.join(', ') || ''}
                        onChange={handleStylePreferenceChange}
                        placeholder="e.g. casual, formal, vintage, modern"
                        multiline
                        rows={3}
                        sx={{ mb: 3 }}
                        helperText="Enter your style preferences separated by commas"
                      />
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 1.5, 
                        mb: 3,
                        minHeight: '60px',
                        alignItems: 'flex-start'
                      }}>
                        {userData?.stylePreferences?.length > 0 ? (
                          userData.stylePreferences.map((style, index) => (
                            <Chip 
                              key={index} 
                              label={style} 
                              sx={{
                                background: gradients.primary,
                                color: 'white',
                                fontWeight: 600,
                                '&:hover': {
                                  background: gradients.primary,
                                  transform: 'translateY(-2px)',
                                  boxShadow: shadows.modern,
                                }
                              }}
                            />
                          ))
                        ) : (
                          <Box sx={{ 
                            p: 3, 
                            background: alpha('#f5f5f5', 0.5),
                            borderRadius: 2,
                            width: '100%',
                            textAlign: 'center'
                          }}>
                            <StyleIcon sx={{ fontSize: '3rem', color: 'text.disabled', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              No style preferences set yet
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Click "Edit Profile" to add your style preferences
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </ModernCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <ModernCard sx={{ height: 'fit-content' }}>
                  <Box sx={{ p: 3 }}>
                    <SectionHeader variant="h6">
                      <SettingsIcon sx={{ color: modernBlue.primary }} />
                      Style Tips
                    </SectionHeader>
                    <Box sx={{ 
                      p: 3, 
                      background: alpha(modernBlue.primary, 0.1),
                      borderRadius: 2,
                      border: `1px solid ${alpha(modernBlue.primary, 0.2)}`
                    }}>
                      <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                        🎨 <strong>Style preferences help us:</strong>
                      </Typography>
                      <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                        <li><Typography variant="body2" sx={{ mb: 1 }}>Suggest matching outfits</Typography></li>
                        <li><Typography variant="body2" sx={{ mb: 1 }}>Filter clothing recommendations</Typography></li>
                        <li><Typography variant="body2" sx={{ mb: 1 }}>Personalize your wardrobe</Typography></li>
                        <li><Typography variant="body2">Create cohesive looks</Typography></li>
                      </ul>
                    </Box>
                  </Box>
                </ModernCard>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Activity Tab */}
          <TabPanel value={tabValue} index={2}>
            <ModernCard>
              <Box sx={{ p: 3 }}>
                <SectionHeader variant="h6">
                  <AssessmentIcon sx={{ color: modernBlue.primary }} />
                  Recent Activity
                </SectionHeader>
                <List sx={{ '& .MuiListItem-root': { mb: 2 } }}>
                  <ActivityListItem>
                    <ListItemAvatar>
                      <ModernAvatar sx={{ background: gradients.success }}>
                        <PersonIcon />
                      </ModernAvatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={600}>
                          Added new item
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Blue Denim Jacket was added to your wardrobe
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip 
                        label="2 hours ago" 
                        size="small"
                        sx={{ 
                          background: alpha(modernBlue.primary, 0.1),
                          color: modernBlue.primary,
                          fontWeight: 600
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ActivityListItem>
                  
                  <ActivityListItem>
                    <ListItemAvatar>
                      <ModernAvatar sx={{ background: gradients.primary }}>
                        <StyleIcon />
                      </ModernAvatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={600}>
                          Created new outfit
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Casual Friday outfit was created
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip 
                        label="1 day ago" 
                        size="small"
                        sx={{ 
                          background: alpha(modernBlue.primary, 0.1),
                          color: modernBlue.primary,
                          fontWeight: 600
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ActivityListItem>
                  
                  <ActivityListItem>
                    <ListItemAvatar>
                      <ModernAvatar sx={{ background: gradients.warning }}>
                        <SettingsIcon />
                      </ModernAvatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={600}>
                          Updated profile
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Your profile information was updated
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip 
                        label="3 days ago" 
                        size="small"
                        sx={{ 
                          background: alpha(modernBlue.primary, 0.1),
                          color: modernBlue.primary,
                          fontWeight: 600
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ActivityListItem>
                </List>
                
                <Box sx={{ 
                  mt: 3, 
                  p: 2, 
                  background: alpha('#f5f5f5', 0.3),
                  borderRadius: 2,
                  textAlign: 'center'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    🎯 Activity tracking helps you understand your wardrobe usage patterns
                  </Typography>
                </Box>
              </Box>
            </ModernCard>
          </TabPanel>
          
          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ mb: 4 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
                <SectionHeader variant="h6">
                  <NotificationsIcon sx={{ color: modernBlue.primary }} />
                  Notification Center
                </SectionHeader>
                <ModernButton
                  variant="contained"
                  startIcon={<NotificationsIcon />}
                  onClick={() => navigate('/notifications')}
                  sx={{
                    background: gradients.primary,
                    '&:hover': {
                      background: gradients.primary,
                      transform: 'translateY(-2px)',
                      boxShadow: shadows.modern,
                    }
                  }}
                >
                  Open Full Center
                </ModernButton>
              </Box>
              
              <Typography variant="body1" color="text.secondary" mb={4} sx={{ fontWeight: 500 }}>
                Manage your notifications, calendar integration, and event reminders. 
                Click the button above to access the full notification management system.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <NotificationFeatureCard
                    onClick={() => navigate('/notifications')}
                  >
                    <NotificationsIcon sx={{ fontSize: 48, color: modernBlue.primary, mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Event Reminders
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calendar integration and outfit suggestions for upcoming events
                    </Typography>
                  </NotificationFeatureCard>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <NotificationFeatureCard
                    onClick={() => navigate('/notifications')}
                  >
                    <NotificationsIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Unused Item Alerts
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get notified about items you haven't worn recently
                    </Typography>
                  </NotificationFeatureCard>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <NotificationFeatureCard
                    onClick={() => navigate('/notifications')}
                  >
                    <SettingsIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Notification Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Customize your notification preferences and frequency
                    </Typography>
                  </NotificationFeatureCard>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </ModernCard>
      </Container>
    </Box>
  );
}

export default Profile;
