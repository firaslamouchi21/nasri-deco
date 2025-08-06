import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Admin authentication
export const adminLogin = async (email, password) => {
  const res = await api.post('/admin/login', { email, password });
  return res.data;
};

// Orders
export const fetchOrders = async () => {
  const res = await api.get('/orders/admin');
  return res.data;
};

// Gallery
export const fetchGallery = async () => {
  const res = await api.get('/gallery');
  return res.data;
};

// Admin data with authentication
export const fetchAdminData = async (token, endpoint) => {
  const res = await api.get(`/admin/${endpoint}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.data;
};

// Materials
export const fetchMaterials = async (token) => {
  const res = await api.get('/admin/materials', { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.data;
};

// Users
export const fetchUsers = async (token) => {
  const res = await api.get('/admin/users', { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.data;
};

// Messages
export const fetchMessages = async (token) => {
  const res = await api.get('/admin/messages', { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.data;
};

// Uploads
export const fetchUploads = async (token) => {
  const res = await api.get('/admin/uploads', { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.data;
};

// Financial data
export const fetchFinancialSummary = async (token) => {
  const res = await api.get('/admin/financial-summary', { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.data;
};

export const fetchFinancialRisk = async (token) => {
  const res = await api.get('/admin/financial-risk', { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.data;
};

export const fetchLowStock = async (token, threshold = 20) => {
  const res = await api.get(`/admin/low-stock?threshold=${threshold}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.data;
};

export const fetchMaterialUsage = async (token, material_id) => {
  const res = await api.get(`/admin/material-usage?material_id=${material_id}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.data;
};

export const fetchFinancialHistory = async (token) => {
  const res = await api.get('/admin/financial-history', { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.data;
};

export const fetchMaterialUsageProjection = async (token, material_id) => {
  const res = await api.get(`/admin/material-usage?material_id=${material_id}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.data;
};

export default api; 