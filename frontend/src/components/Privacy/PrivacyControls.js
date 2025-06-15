import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
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
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Security as PrivacyIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  People as FriendsIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
  Search as SearchIcon,
  Message as MessageIcon,
  Analytics as AnalyticsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  History as HistoryIcon
} from '@mui/icons-material';

import {
  getPrivacySettings,
  updatePrivacySettings,
  getSharingHistory,
  unshareContent
} from '../../services/social';

function PrivacyControls() {
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    allowItemSharing: true,
    allowOutfitSharing: true,
    showInDiscovery: true,
    allowMessaging: true,
    shareAnalytics: false
  });
  
  const [sharingHistory, setSharingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [privacyData, historyData] = await Promise.allSettled([
        getPrivacySettings(),
        getSharingHistory()
      ]);

      if (privacyData.status === 'fulfilled') {
        setSettings(privacyData.value);
      }
      if (historyData.status === 'fulfilled') {
        setSharingHistory(historyData.value);
      }
    } catch (error) {
      console.error('Error loading privacy data:', error);
      setAlert({
        show: true,
        message: 'Failed to load privacy settings',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    setSaving(true);
    try {
      await updatePrivacySettings(newSettings);
      setAlert({
        show: true,
        message: 'Privacy settings updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      setSettings(settings); // Revert on error
      setAlert({
        show: true,
        message: 'Failed to update privacy settings',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUnshareContent = async (type, id) => {
    try {
      await unshareContent(type, id);
      setSharingHistory(prev => prev.filter(item => !(item.type === type && item.id === id)));
      setAlert({
        show: true,
        message: 'Content unshared successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error unsharing content:', error);
      setAlert({
        show: true,
        message: 'Failed to unshare content',
        severity: 'error'
      });
    }
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public': return <PublicIcon color="success" />;
      case 'friends': return <FriendsIcon color="warning" />;
      case 'private': return <PrivateIcon color="error" />;
      default: return <PublicIcon />;
    }
  };

  const getVisibilityLabel = (visibility) => {
    switch (visibility) {
      case 'public': return 'Public';
      case 'friends': return 'Friends Only';
      case 'private': return 'Private';
      default: return 'Public';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box py={3}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <PrivacyIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Privacy & Sharing Controls
          </Typography>
        </Box>

        {alert.show && (
          <Alert 
            severity={alert.severity} 
            onClose={() => setAlert({ ...alert, show: false })}
            sx={{ mb: 3 }}
          >
            {alert.message}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Visibility */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <VisibilityIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Profile Visibility</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Control who can see your profile and wardrobe
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Profile Visibility</InputLabel>
                  <Select
                    value={settings.profileVisibility}
                    label="Profile Visibility"
                    onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                    disabled={saving}
                  >
                    <MenuItem value="public">
                      <Box display="flex" alignItems="center">
                        <PublicIcon sx={{ mr: 1 }} color="success" />
                        Public - Anyone can find and view your profile
                      </Box>
                    </MenuItem>
                    <MenuItem value="private">
                      <Box display="flex" alignItems="center">
                        <PrivateIcon sx={{ mr: 1 }} color="error" />
                        Private - Only you can see your profile
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Sharing Controls */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ShareIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Sharing Permissions</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Control what content can be shared
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <ShareIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Allow Item Sharing"
                      secondary="Let others see items you've shared publicly"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.allowItemSharing}
                        onChange={(e) => handleSettingChange('allowItemSharing', e.target.checked)}
                        disabled={saving}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <ShareIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Allow Outfit Sharing"
                      secondary="Let others see outfits you've shared publicly"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.allowOutfitSharing}
                        onChange={(e) => handleSettingChange('allowOutfitSharing', e.target.checked)}
                        disabled={saving}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Discovery & Communication */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <SearchIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Discovery & Communication</Typography>
                </Box>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <SearchIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Show in Discovery"
                      secondary="Allow your profile to appear in search results and recommendations"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.showInDiscovery}
                        onChange={(e) => handleSettingChange('showInDiscovery', e.target.checked)}
                        disabled={saving}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <MessageIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Allow Messaging"
                      secondary="Let other users send you messages"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.allowMessaging}
                        onChange={(e) => handleSettingChange('allowMessaging', e.target.checked)}
                        disabled={saving}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <AnalyticsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Share Analytics"
                      secondary="Include your data in anonymous usage analytics"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.shareAnalytics}
                        onChange={(e) => handleSettingChange('shareAnalytics', e.target.checked)}
                        disabled={saving}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Sharing History */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    <HistoryIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Sharing History</Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setHistoryDialogOpen(true)}
                    startIcon={<HistoryIcon />}
                  >
                    View All
                  </Button>
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Recently shared items and outfits
                </Typography>

                {sharingHistory.length === 0 ? (
                  <Alert severity="info">
                    You haven't shared any content yet
                  </Alert>
                ) : (
                  <List>
                    {sharingHistory.slice(0, 3).map((item) => (
                      <React.Fragment key={`${item.type}-${item.id}`}>
                        <ListItem>
                          <ListItemIcon>
                            {getVisibilityIcon(item.shares[0]?.privacy)}
                          </ListItemIcon>
                          <ListItemText
                            primary={`${item.name} (${item.type})`}
                            secondary={
                              <Box>
                                <Typography variant="caption" display="block">
                                  Shared {item.shares.length} time{item.shares.length !== 1 ? 's' : ''}
                                </Typography>
                                <Box display="flex" gap={1} mt={0.5}>
                                  {item.shares.map((share, index) => (
                                    <Chip
                                      key={index}
                                      label={share.platform}
                                      size="small"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              edge="end" 
                              onClick={() => handleUnshareContent(item.type, item.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sharing History Dialog */}
        <Dialog 
          open={historyDialogOpen} 
          onClose={() => setHistoryDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Complete Sharing History
          </DialogTitle>
          <DialogContent>
            {sharingHistory.length === 0 ? (
              <Alert severity="info">
                No sharing history found
              </Alert>
            ) : (
              <List>
                {sharingHistory.map((item) => (
                  <React.Fragment key={`${item.type}-${item.id}`}>
                    <ListItem>
                      <ListItemIcon>
                        {getVisibilityIcon(item.shares[0]?.privacy)}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${item.name} (${item.type})`}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              Created: {new Date(item.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Shared {item.shares.length} time{item.shares.length !== 1 ? 's' : ''}
                            </Typography>
                            <Box display="flex" gap={1} mt={0.5}>
                              {item.shares.map((share, index) => (
                                <Chip
                                  key={index}
                                  label={`${share.platform} (${getVisibilityLabel(share.privacy)})`}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleUnshareContent(item.type, item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default PrivacyControls;
