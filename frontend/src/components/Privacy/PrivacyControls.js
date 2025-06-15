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
import { styled } from '@mui/material/styles';

import {
  getPrivacySettings,
  updatePrivacySettings,
  getSharingHistory,
  unshareContent
} from '../../services/social';

// Modern glassmorphism card
const ModernCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
  borderRadius: 24,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.3)'
    : '0 8px 32px rgba(0,0,0,0.08)',
  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
  overflow: 'hidden',
  minHeight: 320, // Ensure consistent minimum height
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(0,0,0,0.4)'
      : '0 12px 40px rgba(0,0,0,0.12)',
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
}));

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.1))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59,130,246,0.2)',
                color: theme => theme.palette.primary.main,
              }}
            >
              <PrivacyIcon sx={{ fontSize: '2rem' }} />
            </Box>
            <Typography variant="h3" fontWeight={700} 
              sx={{ 
                background: 'linear-gradient(135deg, #1F2937, #4B5563)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Privacy & Sharing Controls
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Manage your privacy, sharing, and discovery settings for your wardrobe
          </Typography>
        </Box>

        {alert.show && (
          <Alert 
            severity={alert.severity} 
            onClose={() => setAlert({ ...alert, show: false })}
            sx={{ mb: 3, borderRadius: 3 }}
          >
            {alert.message}
          </Alert>
        )}        <Grid container spacing={4}>
          {/* Profile Visibility */}
          <Grid item xs={12} md={6}>
            <ModernCard>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <SectionHeader>
                  <VisibilityIcon color="primary" />
                  <Typography variant="h5" fontWeight={600}>Profile Visibility</Typography>
                </SectionHeader>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Control who can see your profile and wardrobe
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end' }}>
                  <FormControl fullWidth>
                    <InputLabel>Profile Visibility</InputLabel>
                    <Select
                      value={settings.profileVisibility}
                      label="Profile Visibility"
                      onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                      disabled={saving}
                      sx={{ 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
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
                </Box>
              </CardContent>
            </ModernCard>
          </Grid>

          {/* Sharing Controls */}
          <Grid item xs={12} md={6}>
            <ModernCard>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <SectionHeader>
                  <ShareIcon color="primary" />
                  <Typography variant="h5" fontWeight={600}>Sharing Permissions</Typography>
                </SectionHeader>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Control what content can be shared
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <List sx={{ py: 0 }}>
                    <ListItem sx={{ px: 0 }}>
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
                    <ListItem sx={{ px: 0 }}>
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
                </Box>
              </CardContent>
            </ModernCard>
          </Grid>

          {/* Discovery & Communication */}
          <Grid item xs={12} md={6}>
            <ModernCard>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <SectionHeader>
                  <SearchIcon color="primary" />
                  <Typography variant="h5" fontWeight={600}>Discovery & Communication</Typography>
                </SectionHeader>
                <Box sx={{ flexGrow: 1 }}>
                  <List sx={{ py: 0 }}>
                    <ListItem sx={{ px: 0 }}>
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
                    <ListItem sx={{ px: 0 }}>
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
                    <ListItem sx={{ px: 0 }}>
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
                </Box>
              </CardContent>
            </ModernCard>
          </Grid>

          {/* Sharing History */}
          <Grid item xs={12} md={6}>
            <ModernCard>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <SectionHeader sx={{ justifyContent: 'space-between', borderBottom: 'none', pb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <HistoryIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>Sharing History</Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setHistoryDialogOpen(true)}
                    startIcon={<HistoryIcon />}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    View All
                  </Button>
                </SectionHeader>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Recently shared items and outfits
                </Typography>
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                  {sharingHistory.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      You haven't shared any content yet
                    </Alert>
                  ) : (
                    <List sx={{ py: 0 }}>
                      {sharingHistory.slice(0, 2).map((item) => (
                        <React.Fragment key={`${item.type}-${item.id}`}>
                          <ListItem sx={{ px: 0 }}>
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
                                    {item.shares.slice(0, 2).map((share, index) => (
                                      <Chip
                                        key={index}
                                        label={share.platform}
                                        size="small"
                                        variant="outlined"
                                        sx={{ 
                                          borderRadius: 1,
                                          fontSize: '0.7rem',
                                        }}
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
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {sharingHistory.indexOf(item) < Math.min(1, sharingHistory.length - 1) && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </Box>
              </CardContent>
            </ModernCard>
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
