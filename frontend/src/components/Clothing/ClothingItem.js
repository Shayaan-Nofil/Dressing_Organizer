import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box, TextField, Tooltip, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EditIcon from '@mui/icons-material/Edit';
import { updateTags, updateFavorite, deleteItem } from '../../services/clothing';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

function ClothingItem({ item, onUpdate }) {
  const [editingTags, setEditingTags] = useState(false);
  const [tagsInput, setTagsInput] = useState(item.tags ? item.tags.join(', ') : '');
  const [favorite, setFavorite] = useState(item.favorite || false);

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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={getImageUrl(item.image) || getPlaceholderImage(200, 200)}
        alt={item.name}
      />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Typography gutterBottom variant="h6" component="div">
            {item.name}
          </Typography>
          <Box>
            <Tooltip title={favorite ? 'Unmark Favorite' : 'Mark as Favorite'}>
              <IconButton onClick={handleFavoriteToggle} color={favorite ? 'warning' : 'default'} size="small">
                {favorite ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleDelete} color="error" size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Category: {item.category}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Color: {item.color}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Size: {item.size}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {editingTags ? (
            <>
              <TextField
                size="small"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                label="Tags (comma-separated)"
                sx={{ mr: 1 }}
              />
              <Button variant="outlined" size="small" onClick={handleTagsSave}>Save</Button>
              <Button variant="text" size="small" onClick={() => setEditingTags(false)}>Cancel</Button>
            </>
          ) : (
            <>
              {item.tags && item.tags.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Tags: {item.tags.join(', ')}
                </Typography>
              )}
              <Tooltip title="Edit Tags">
                <IconButton onClick={handleTagsEdit} size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ClothingItem;