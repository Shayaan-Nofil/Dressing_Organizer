import React, { useState } from 'react';
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
  Chip
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  Height as HeightIcon, 
  Scale as ScaleIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

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

  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    joinDate: 'January 15, 2023',
    measurements: {
      height: 175, // cm
      weight: 68, // kg
      bust: 92, // cm
      waist: 76, // cm
      hips: 94, // cm
    },
    preferences: {
      style: ['Casual', 'Minimalist', 'Streetwear'],
      colors: ['Blue', 'Black', 'White', 'Grey'],
      brands: ['Zara', 'Uniqlo', 'H&M', 'Levi\'s']
    }
  });

  const [editData, setEditData] = useState({ ...userData });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditData({ ...userData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

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
        ...prev.measurements,
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
            {userData.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box>
            {isEditing ? (
              <TextField
                name="name"
                value={editData.name}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
              />
            ) : (
              <Typography variant="h4" component="h2">
                {userData.name}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon color="action" fontSize="small" sx={{ mr: 1 }} />
              {isEditing ? (
                <TextField
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  type="email"
                />
              ) : (
                <Typography color="text.secondary">
                  {userData.email}
                </Typography>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Member since {userData.joinDate}
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
                          value={editData.measurements.height}
                          onChange={handleMeasurementChange}
                          type="number"
                          size="small"
                          sx={{ ml: 1, width: 80 }}
                          inputProps={{ min: 0 }}
                        />
                      ) : (
                        <Typography sx={{ ml: 1, fontWeight: 'medium' }}>
                          {userData.measurements.height} cm
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ScaleIcon color="action" sx={{ mr: 1 }} />
                      <Typography>Weight:</Typography>
                      {isEditing ? (
                        <TextField
                          name="weight"
                          value={editData.measurements.weight}
                          onChange={handleMeasurementChange}
                          type="number"
                          size="small"
                          sx={{ ml: 1, width: 80 }}
                          inputProps={{ min: 0, step: 0.1 }}
                        />
                      ) : (
                        <Typography sx={{ ml: 1, fontWeight: 'medium' }}>
                          {userData.measurements.weight} kg
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
                          value={editData.measurements.bust}
                          onChange={handleMeasurementChange}
                          type="number"
                          size="small"
                          sx={{ width: 100 }}
                          inputProps={{ min: 0 }}
                        />
                      ) : (
                        <Typography>{userData.measurements.bust} cm</Typography>
                      )}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Waist: </Typography>
                      {isEditing ? (
                        <TextField
                          name="waist"
                          value={editData.measurements.waist}
                          onChange={handleMeasurementChange}
                          type="number"
                          size="small"
                          sx={{ width: 100 }}
                          inputProps={{ min: 0 }}
                        />
                      ) : (
                        <Typography>{userData.measurements.waist} cm</Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Hips: </Typography>
                      {isEditing ? (
                        <TextField
                          name="hips"
                          value={editData.measurements.hips}
                          onChange={handleMeasurementChange}
                          type="number"
                          size="small"
                          sx={{ width: 100 }}
                          inputProps={{ min: 0 }}
                        />
                      ) : (
                        <Typography>{userData.measurements.hips} cm</Typography>
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {userData.preferences.style.map((style, index) => (
                <Chip key={index} label={style} />
              ))}
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Preferred Colors
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {userData.preferences.colors.map((color, index) => (
                <Chip 
                  key={index} 
                  label={color} 
                  sx={{ 
                    backgroundColor: color.toLowerCase(),
                    color: ['white', 'yellow', 'lightblue', 'lightgreen'].includes(color.toLowerCase()) ? 'black' : 'white',
                    border: '1px solid #ddd'
                  }} 
                />
              ))}
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Favorite Brands
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {userData.preferences.brands.map((brand, index) => (
                <Chip key={index} label={brand} variant="outlined" />
              ))}
            </Box>
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
      </Box>
    </Container>
  );
}

export default Profile;
