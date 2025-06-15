import axios from 'axios';

const API_URL = 'http://localhost:5000/api/clothing-items';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAllItems = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const addItem = async (itemData) => {
  const response = await axios.post(API_URL, itemData, getAuthHeader());
  return response.data;
};

export const deleteItem = async (itemId) => {
  const response = await axios.delete(`${API_URL}/${itemId}`, getAuthHeader());
  return response.data;
};

// Update tags for a clothing item
export const updateTags = async (itemId, tags) => {
  const response = await axios.patch(`${API_URL}/${itemId}/tags`, { tags }, getAuthHeader());
  return response.data;
};

// Mark or unmark as favorite
export const updateFavorite = async (itemId, favorite) => {
  const response = await axios.patch(`${API_URL}/${itemId}/favorite`, { favorite }, getAuthHeader());
  return response.data;
};

// Get unused clothing items (not worn for 30+ days)
export const getUnusedItems = async () => {
  const response = await axios.get(`${API_URL}/unused`, getAuthHeader());
  return response.data;
};

// Get least-worn clothing items
export const getLeastWornItems = async () => {
  const response = await axios.get(`${API_URL}/least-worn`, getAuthHeader());
  return response.data;
};

// Get wear frequency stats
export const getWearFrequencyStats = async () => {
  const response = await axios.get(`${API_URL}/stats/frequency`, getAuthHeader());
  return response.data;
};

// Search/filter clothing items
export const searchItems = async (params) => {
  const response = await axios.get(`${API_URL}/search`, { ...getAuthHeader(), params });
  return response.data;
};