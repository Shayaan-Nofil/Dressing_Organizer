import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  IconButton, 
  Box, 
  TextField, 
  Tooltip, 
  Button,
  Chip,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  LocalOffer as TagIcon
} from '@mui/icons-material';
import { updateTags, updateFavorite, deleteItem } from '../../services/clothing';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';
import SocialSharingDialog from '../Social/SocialSharingDialog';
import { 
  ModernCard, 
  modernBlue, 
  gradients, 
  shadows 
} from '../../theme/modernDesign';

// Styled Components
const ClothingCard = styled(ModernCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    '& .item-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  }
}));

const ItemImage = styled(CardMedia)(({ theme }) => ({
  height: 220,
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3) 100%)',
  }
}));

const ActionsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  opacity: 0.7,
  transform: 'translateY(5px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  fontSize: '0.7rem',
  height: 20,
}));

function ClothingItem({ item, onUpdate }) {
  const [editingTags, setEditingTags] = useState(false);
  const [tagsInput, setTagsInput] = useState(item.tags ? item.tags.join(', ') : '');
  const [favorite, setFavorite] = useState(item.favorite || false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteItem(item._id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      await updateFavorite(item._id, !favorite);
      setFavorite(!favorite);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleTagsEdit = () => {
    setEditingTags(true);
  };

  const handleTagsSave = async () => {
    try {
      const tagsArr = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      await updateTags(item._id, tagsArr);
      setEditingTags(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  return (
    <ClothingCard>
      <Box sx={{ position: 'relative' }}>
        <ItemImage
          component="img"
          image={getImageUrl(item.image) || getPlaceholderImage(220, 220)}
          alt={item.name}
        />
        {favorite && (
          <Box sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8,
            background: 'rgba(255, 193, 7, 0.9)',
            borderRadius: '50%',
            padding: 0.5
          }}>
            <StarIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
          </Box>
        )}
        <ActionsBox className="item-actions" sx={{ 
          position: 'absolute', 
          top: 8, 
          left: 8 
        }}>
          <Tooltip title="Share Item">
            <IconButton 
              onClick={() => setShareDialogOpen(true)} 
              size="small"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.9)', 
                '&:hover': { backgroundColor: 'white' } 
              }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={favorite ? 'Unmark Favorite' : 'Mark as Favorite'}>
            <IconButton 
              onClick={handleFavoriteToggle} 
              size="small"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.9)', 
                '&:hover': { backgroundColor: 'white' },
                color: favorite ? '#ff9800' : 'inherit'
              }}
            >
              {favorite ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Item">
            <IconButton 
              onClick={handleDelete} 
              size="small"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.9)', 
                '&:hover': { backgroundColor: 'white', color: '#f44336' } 
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ActionsBox>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {item.name}
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <InfoChip label={item.category} size="small" color="primary" />
          <InfoChip label={item.color} size="small" variant="outlined" />
          <InfoChip label={item.size} size="small" variant="outlined" />
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TagIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
          {editingTags ? (
            <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
              <TextField
                size="small"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                label="Tags (comma-separated)"
                fullWidth
              />
              <Button 
                variant="contained" 
                size="small" 
                onClick={handleTagsSave}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Save
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                {item.tags && item.tags.length > 0 ? item.tags.join(', ') : 'No tags'}
              </Typography>
              <IconButton onClick={handleTagsEdit} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>

      <SocialSharingDialog 
        open={shareDialogOpen} 
        onClose={() => setShareDialogOpen(false)} 
        itemData={item} 
      />
    </ClothingCard>
  );
}

export default ClothingItem;