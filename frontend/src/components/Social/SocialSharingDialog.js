import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
  Snackbar
} from '@mui/material';
import {
  Share as ShareIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Pinterest as PinterestIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon,
  Public as PublicIcon,
  Lock as PrivateIcon,
  People as FriendsIcon,
  Image as ImageIcon
} from '@mui/icons-material';

import {
  shareOutfit,
  shareItem,
  generateShareImage,
  openShareDialog,
  copyToClipboard,
  generateCaption
} from '../../services/social';

function SocialSharingDialog({ open, onClose, type, item, outfit }) {
  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [shareUrls, setShareUrls] = useState({});
  const [loading, setLoading] = useState(false);
  const [shareComplete, setShareComplete] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (open && (item || outfit)) {
      // Generate default caption
      const defaultCaption = generateCaption(type, item, outfit);
      setCaption(defaultCaption);
    }
  }, [open, type, item, outfit]);

  const handleShare = async (platform) => {
    setLoading(true);
    try {
      let response;
      
      if (type === 'outfit' && outfit) {
        response = await shareOutfit(outfit.id, platform, caption, privacy);
      } else if (type === 'item' && item) {
        response = await shareItem(item._id, platform, caption, privacy);
      }
      
      if (response && response.platforms) {
        setShareUrls(response.platforms);
        
        // Open share dialog for the platform
        if (platform !== 'instagram' && response.platforms[platform]) {
          openShareDialog(platform, response.platforms[platform]);
        }
        
        setSnackbar({
          open: true,
          message: `Shared to ${platform} successfully!`,
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setSnackbar({
        open: true,
        message: 'Failed to share content',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = type === 'outfit' 
      ? `${window.location.origin}/shared/outfit/${outfit?.id}`
      : `${window.location.origin}/shared/item/${item?._id}`;
    
    const success = await copyToClipboard(shareUrl);
    setSnackbar({
      open: true,
      message: success ? 'Link copied to clipboard!' : 'Failed to copy link',
      severity: success ? 'success' : 'error'
    });
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const response = await generateShareImage(
        type,
        item?._id,
        outfit?.id,
        'modern'
      );
      
      setSnackbar({
        open: true,
        message: 'Share image generated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating share image:', error);
      setSnackbar({
        open: true,
        message: 'Failed to generate share image',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCaption('');
    setPrivacy('public');
    setSelectedPlatforms([]);
    setShareUrls({});
    setShareComplete(false);
    onClose();
  };

  const platformConfigs = [
    {
      name: 'instagram',
      label: 'Instagram',
      icon: <InstagramIcon />,
      color: '#E4405F',
      note: 'Image and caption will be copied for manual sharing'
    },
    {
      name: 'facebook',
      label: 'Facebook',
      icon: <FacebookIcon />,
      color: '#1877F2'
    },
    {
      name: 'twitter',
      label: 'Twitter',
      icon: <TwitterIcon />,
      color: '#1DA1F2'
    },
    {
      name: 'pinterest',
      label: 'Pinterest',
      icon: <PinterestIcon />,
      color: '#BD081C'
    }
  ];

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <ShareIcon sx={{ mr: 1 }} />
              Share {type === 'outfit' ? 'Outfit' : 'Item'}
            </Box>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {/* Preview */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                {type === 'outfit' && outfit && (
                  <>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {outfit.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{outfit.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {outfit.occasion} • {outfit.weather}
                      </Typography>
                    </Box>
                  </>
                )}
                {type === 'item' && item && (
                  <>
                    {item.image ? (
                      <Avatar src={item.image} sx={{ mr: 2, width: 56, height: 56 }} />
                    ) : (
                      <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                        {item.name.charAt(0)}
                      </Avatar>
                    )}
                    <Box>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.category} {item.brand && `• ${item.brand}`}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Caption */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            sx={{ mb: 3 }}
            placeholder="Write a caption for your post..."
          />

          {/* Privacy Settings */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Privacy</InputLabel>
            <Select
              value={privacy}
              label="Privacy"
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <MenuItem value="public">
                <Box display="flex" alignItems="center">
                  <PublicIcon sx={{ mr: 1 }} />
                  Public - Anyone can see this
                </Box>
              </MenuItem>
              <MenuItem value="friends">
                <Box display="flex" alignItems="center">
                  <FriendsIcon sx={{ mr: 1 }} />
                  Friends - Only friends can see this
                </Box>
              </MenuItem>
              <MenuItem value="private">
                <Box display="flex" alignItems="center">
                  <PrivateIcon sx={{ mr: 1 }} />
                  Private - Only you can see this
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Platform Selection */}
          <Typography variant="h6" gutterBottom>
            Choose Platforms
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {platformConfigs.map((platform) => (
              <Grid item xs={6} sm={3} key={platform.name}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: selectedPlatforms.includes(platform.name) ? '2px solid' : '1px solid',
                    borderColor: selectedPlatforms.includes(platform.name) ? platform.color : 'divider'
                  }}
                  onClick={() => {
                    setSelectedPlatforms(prev => 
                      prev.includes(platform.name)
                        ? prev.filter(p => p !== platform.name)
                        : [...prev, platform.name]
                    );
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Box sx={{ color: platform.color, mb: 1 }}>
                      {platform.icon}
                    </Box>
                    <Typography variant="body2">
                      {platform.label}
                    </Typography>
                    {platform.note && (
                      <Typography variant="caption" color="text.secondary">
                        {platform.note}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            <Button
              variant="outlined"
              startIcon={<LinkIcon />}
              onClick={handleCopyLink}
              size="small"
            >
              Copy Link
            </Button>
            <Button
              variant="outlined"
              startIcon={<ImageIcon />}
              onClick={handleGenerateImage}
              size="small"
              disabled={loading}
            >
              Generate Image
            </Button>
          </Box>

          {/* Share URLs Display */}
          {Object.keys(shareUrls).length > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Share URLs Generated:
              </Typography>
              {Object.entries(shareUrls).map(([platform, url]) => (
                <Box key={platform} display="flex" alignItems="center" mt={1}>
                  <Typography variant="body2" sx={{ mr: 1, textTransform: 'capitalize' }}>
                    {platform}:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    {typeof url === 'string' ? url.substring(0, 50) + '...' : 'Manual sharing required'}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => typeof url === 'string' && copyToClipboard(url)}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              selectedPlatforms.forEach(platform => handleShare(platform));
            }}
            disabled={loading || selectedPlatforms.length === 0}
            startIcon={loading ? <CircularProgress size={16} /> : <ShareIcon />}
          >
            {loading ? 'Sharing...' : `Share to ${selectedPlatforms.length} platform${selectedPlatforms.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SocialSharingDialog;
