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

export const fetchFinancialSummary = async (token) => {
  const res = await api.get('/admin/financial-summary', { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const fetchFinancialRisk = async (token) => {
  const res = await api.get('/admin/financial-risk', { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const fetchLowStock = async (token, threshold = 20) => {
  const res = await api.get(`/admin/low-stock?threshold=${threshold}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const fetchMaterialUsage = async (token, material_id) => {
  const res = await api.get(`/admin/material-usage?material_id=${material_id}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const fetchFinancialHistory = async (token) => {
  const res = await api.get('/admin/financial-history', { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const fetchMaterialUsageProjection = async (token, material_id) => {
  const res = await api.get(`/admin/material-usage?material_id=${material_id}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export default api; 