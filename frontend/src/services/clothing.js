import axios from 'axios';

const API_URL = 'http://localhost:5000/api/items';

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