import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchOrders = async () => {
  const res = await api.get('/orders/admin');
  return res.data;
};

export const fetchGallery = async () => {
  const res = await api.get('/gallery');
  return res.data;
};

export default api; 