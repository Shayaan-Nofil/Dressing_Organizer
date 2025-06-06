import axios from 'axios';

const API_URL = 'http://localhost:5000/api/outfits';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAllOutfits = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const createOutfit = async (outfitData) => {
  const response = await axios.post(API_URL, outfitData, getAuthHeader());
  return response.data;
};

export const deleteOutfit = async (outfitId) => {
  const response = await axios.delete(`${API_URL}/${outfitId}`, getAuthHeader());
  return response.data;
};