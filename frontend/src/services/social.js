import axios from 'axios';

const API_URL = 'http://localhost:5000/api/social';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// Social sharing functions
export const shareOutfit = async (outfitId, platform, caption, privacy = 'public') => {
  const response = await axios.post(`${API_URL}/share-outfit`, {
    outfitId,
    platform,
    caption,
    privacy
  }, getAuthHeader());
  return response.data;
};

export const shareItem = async (itemId, platform, caption, privacy = 'public') => {
  const response = await axios.post(`${API_URL}/share-item`, {
    itemId,
    platform,
    caption,
    privacy
  }, getAuthHeader());
  return response.data;
};

export const generateShareImage = async (type, itemId, outfitId, template = 'modern') => {
  const formData = new FormData();
  formData.append('type', type);
  formData.append('template', template);
  
  if (itemId) formData.append('itemId', itemId);
  if (outfitId) formData.append('outfitId', outfitId);
  
  const response = await axios.post(`${API_URL}/generate-share-image`, formData, {
    ...getAuthHeader(),
    headers: {
      ...getAuthHeader().headers,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Privacy settings
export const getPrivacySettings = async () => {
  const response = await axios.get(`${API_URL}/privacy-settings`, getAuthHeader());
  return response.data;
};

export const updatePrivacySettings = async (settings) => {
  const response = await axios.put(`${API_URL}/privacy-settings`, settings, getAuthHeader());
  return response.data;
};

// Sharing history
export const getSharingHistory = async () => {
  const response = await axios.get(`${API_URL}/sharing-history`, getAuthHeader());
  return response.data;
};

export const unshareContent = async (type, id) => {
  const response = await axios.delete(`${API_URL}/unshare/${type}/${id}`, getAuthHeader());
  return response.data;
};

// Public shared content
export const getSharedOutfit = async (id) => {
  const response = await axios.get(`${API_URL}/shared/outfit/${id}`);
  return response.data;
};

export const getSharedItem = async (id) => {
  const response = await axios.get(`${API_URL}/shared/item/${id}`);
  return response.data;
};

// Utility functions for opening share dialogs
export const openShareDialog = (platform, shareUrl) => {
  let url;
  
  switch (platform) {
    case 'facebook':
      url = shareUrl;
      break;
    case 'twitter':
      url = shareUrl;
      break;
    case 'pinterest':
      url = shareUrl;
      break;
    default:
      return null;
  }
  
  window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

// Generate social media captions
export const generateCaption = (type, item, outfit, customText = '') => {
  let caption = customText;
  
  if (type === 'outfit' && outfit) {
    caption = caption || `Check out my ${outfit.occasion} outfit: ${outfit.name}! `;
    caption += `Perfect for ${outfit.weather} weather. `;
  } else if (type === 'item' && item) {
    caption = caption || `Loving my new ${item.category}: ${item.name}! `;
    if (item.brand) caption += `By ${item.brand}. `;
  }
  
  caption += '#OOTD #Fashion #Style #Wardrobe';
  
  return caption;
};

// Platform-specific sharing
export const shareToInstagram = (content) => {
  // Instagram doesn't support direct URL sharing
  // Return instructions for manual sharing
  return {
    type: 'manual',
    instruction: 'Copy the image and caption to share on Instagram',
    caption: content.caption,
    image: content.image
  };
};

export const shareToFacebook = (content) => {
  const baseUrl = 'https://www.facebook.com/sharer/sharer.php';
  const params = new URLSearchParams({
    u: content.shareUrl,
    quote: content.caption
  });
  return `${baseUrl}?${params.toString()}`;
};

export const shareToTwitter = (content) => {
  const baseUrl = 'https://twitter.com/intent/tweet';
  const params = new URLSearchParams({
    text: content.caption,
    url: content.shareUrl
  });
  return `${baseUrl}?${params.toString()}`;
};

export const shareToPinterest = (content) => {
  const baseUrl = 'https://pinterest.com/pin/create/button/';
  const params = new URLSearchParams({
    url: content.shareUrl,
    description: content.caption,
    media: content.image || ''
  });
  return `${baseUrl}?${params.toString()}`;
};
