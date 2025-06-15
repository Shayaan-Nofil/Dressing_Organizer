// Utility function to get the correct image URL
const API_BASE_URL = 'http://localhost:5000';

export const getImageUrl = (imagePathOrUrl) => {
  if (!imagePathOrUrl) {
    return null;
  }
  
  // If it's already a full URL, return as is
  if (imagePathOrUrl.startsWith('http')) {
    return imagePathOrUrl;
  }
  
  // Convert Windows backslashes to forward slashes for URLs
  let cleanPath = imagePathOrUrl.replace(/\\/g, '/');
  
  // Remove any leading slashes and normalize the path
  cleanPath = cleanPath.replace(/^\/+/, '');
  
  // If it starts with uploads/, just prepend the base URL
  if (cleanPath.startsWith('uploads/')) {
    return `${API_BASE_URL}/${cleanPath}`;
  }
  
  // If it's just a filename, assume it's in uploads/
  return `${API_BASE_URL}/uploads/${cleanPath}`;
};

export const getOutfitImageUrl = (outfit) => {
  // If outfit has its own image, use it
  if (outfit.image) {
    return getImageUrl(outfit.image);
  }
  
  // If outfit has items and the first item has an image, use that
  if (outfit.items && outfit.items.length > 0 && outfit.items[0].image) {
    return getImageUrl(outfit.items[0].image);
  }
  
  // No image available
  return null;
};

export const getPlaceholderImage = (width = 200, height = 200) => {
  return `https://via.placeholder.com/${width}x${height}?text=No+Image`;
};
