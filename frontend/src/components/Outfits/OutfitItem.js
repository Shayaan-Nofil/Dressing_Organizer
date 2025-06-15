import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  IconButton, 
  Box, 
  Grid, 
  Button, 
  Tooltip,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Delete as DeleteIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  Style as StyleIcon
} from '@mui/icons-material';
import axios from 'axios';
import { getImageUrl, getOutfitImageUrl, getPlaceholderImage } from '../../utils/imageUtils';
import SocialSharingDialog from '../Social/SocialSharingDialog';
import { 
  ModernCard, 
  ModernButton, 
  modernBlue, 
  gradients,
  shadows,
  responsiveTypography 
} from '../../theme/modernDesign';

const OutfitCard = styled(ModernCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    '& .outfit-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  }
}));

const OutfitHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: gradients.primary,
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  }
}));

const ActionsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  opacity: 0.7,
  transform: 'translateY(5px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  zIndex: 1,
}));

const ItemCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark' ? shadows.smallDark : shadows.small,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.palette.mode === 'dark' ? shadows.mediumDark : shadows.medium,
  }
}));

const WornChip = styled(Chip)(({ theme }) => ({
  background: gradients.success,
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
}));

function OutfitItem({ outfit }) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/outfits/${outfit._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting outfit:', error);
    }
  };

  return (
    <OutfitCard>
      <OutfitHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative', zIndex: 1 }}>
          <StyleIcon sx={{ fontSize: '1.5rem' }} />
          <Typography variant="h6" sx={{ ...responsiveTypography.subtitle, fontWeight: 700 }}>
            {outfit.name}
          </Typography>
        </Box>
        <ActionsBox className="outfit-actions">
          <Tooltip title="Share Outfit">
            <IconButton 
              onClick={() => setShareDialogOpen(true)} 
              sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
              size="small"
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Outfit">
            <IconButton 
              onClick={handleDelete} 
              sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </ActionsBox>
      </OutfitHeader>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Outfit metadata */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {outfit.isWorn && (
            <WornChip 
              icon={<CheckCircleIcon />} 
              label="Worn" 
              size="small" 
            />
          )}
          <Chip 
            label={`${outfit.items?.length || 0} items`} 
            size="small" 
            variant="outlined"
            sx={{ color: modernBlue.primary, borderColor: modernBlue.primary }}
          />
        </Box>

        {/* Clothing items grid */}
        <Grid container spacing={1.5}>
          {outfit.items?.map((item) => (
            <Grid item xs={6} key={item._id}>
              <ItemCard>
                <CardMedia
                  component="img"
                  height="80"
                  image={getImageUrl(item.image) || getPlaceholderImage(100, 100)}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <Box sx={{ p: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>
              </ItemCard>
            </Grid>
          ))}
        </Grid>

        {/* Mark as worn button */}
        <Box sx={{ mt: 2 }}>
          <ModernButton
            variant="success"
            onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                await axios.patch(`http://localhost:5000/api/outfits/${outfit._id}/mark-worn`, {}, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                window.location.reload();
              } catch (error) {
                console.error('Error marking as worn:', error);
              }
            }}
            startIcon={<CheckCircleIcon />}
            fullWidth
            disabled={outfit.isWorn}
          >
            {outfit.isWorn ? 'Already Worn' : 'Mark as Worn'}
          </ModernButton>
        </Box>
      </CardContent>

      <SocialSharingDialog 
        open={shareDialogOpen} 
        onClose={() => setShareDialogOpen(false)} 
        outfitData={outfit} 
      />
    </OutfitCard>
  );
}

export default OutfitItem;