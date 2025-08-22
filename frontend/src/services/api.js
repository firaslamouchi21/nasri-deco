import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Admin authentication
export const adminLogin = async (email, password) => {
  try {
    const res = await api.post('/admin/login', { email, password });
    return res.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Orders
export const fetchOrders = async () => {
  try {
    const res = await api.get('/orders/admin');
    return res.data;
  } catch (error) {
    console.error('Fetch orders error:', error);
    throw error;
  }
};

// Gallery
export const fetchGallery = async () => {
  try {
    const res = await api.get('/gallery');
    return res.data;
  } catch (error) {
    console.error('Fetch gallery error:', error);
    throw error;
  }
};

// Admin data with authentication
export const fetchAdminData = async (token, endpoint) => {
  try {
    const res = await api.get(`/admin/${endpoint}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error(`Fetch ${endpoint} error:`, error);
    throw error;
  }
};

// Materials
export const fetchMaterials = async (token) => {
  try {
    const res = await api.get('/admin/materials', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    console.log('Materials data:', res.data);
    return res.data;
  } catch (error) {
    console.error('Fetch materials error:', error);
    throw error;
  }
};

// Users
export const fetchUsers = async (token) => {
  try {
    const res = await api.get('/admin/users', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch users error:', error);
    throw error;
  }
};

// Messages
export const fetchMessages = async (token) => {
  try {
    const res = await api.get('/admin/messages', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch messages error:', error);
    throw error;
  }
};

// Uploads
export const fetchUploads = async (token) => {
  try {
    const res = await api.get('/admin/uploads', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch uploads error:', error);
    throw error;
  }
};

// Financial data
export const fetchFinancialSummary = async (token) => {
  try {
    const res = await api.get('/admin/financial-summary', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    console.log('Financial summary data:', res.data);
    return res.data;
  } catch (error) {
    console.error('Fetch financial summary error:', error);
    throw error;
  }
};

export const fetchFinancialRisk = async (token) => {
  try {
    const res = await api.get('/admin/financial-risk', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch financial risk error:', error);
    throw error;
  }
};

export const fetchLowStock = async (token, threshold = 20) => {
  try {
    const res = await api.get(`/admin/low-stock?threshold=${threshold}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    console.log('Low stock data:', res.data);
    return res.data;
  } catch (error) {
    console.error('Fetch low stock error:', error);
    throw error;
  }
};

export const fetchMaterialUsage = async (token, material_id) => {
  try {
    const res = await api.get(`/admin/material-usage?material_id=${material_id}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch material usage error:', error);
    throw error;
  }
};

export const fetchMaterialUsageData = async (token) => {
  try {
    const res = await api.get('/admin/material-usage-data', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    console.log('Material usage data:', res.data);
    return res.data;
  } catch (error) {
    console.error('Fetch material usage data error:', error);
    throw error;
  }
};

export const fetchFinancialHistory = async (token) => {
  try {
    const res = await api.get('/admin/financial-history', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch financial history error:', error);
    throw error;
  }
};

export const fetchMaterialUsageProjection = async (token, material_id) => {
  try {
    const res = await api.get(`/admin/material-usage?material_id=${material_id}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch material usage projection error:', error);
    throw error;
  }
};

// Analytics API functions
export const fetchDashboardSummary = async (token) => {
  try {
    const res = await api.get('/analytics/dashboard-summary', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch dashboard summary error:', error);
    throw error;
  }
};

export const fetchTopUsedMaterials = async (token, limit = 10) => {
  try {
    const res = await api.get(`/analytics/top-used-materials?limit=${limit}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch top used materials error:', error);
    throw error;
  }
};

export const fetchRevenueEvolution = async (token, months = 12) => {
  try {
    const res = await api.get(`/analytics/revenue-evolution?months=${months}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch revenue evolution error:', error);
    throw error;
  }
};

export const fetchExpensesBySupplier = async (token) => {
  try {
    const res = await api.get('/analytics/expenses-by-supplier', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch expenses by supplier error:', error);
    throw error;
  }
};

export const fetchLowStockAlerts = async (token, threshold = 20) => {
  try {
    const res = await api.get(`/analytics/low-stock-alerts?threshold=${threshold}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch low stock alerts error:', error);
    throw error;
  }
};

export const fetchMonthlyMaterialCosts = async (token, months = 12) => {
  try {
    const res = await api.get(`/analytics/monthly-material-costs?months=${months}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch monthly material costs error:', error);
    throw error;
  }
};

export const fetchProjectStatusOverview = async (token) => {
  try {
    const res = await api.get('/analytics/project-status-overview', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch project status overview error:', error);
    throw error;
  }
};

export const fetchUsageByCategory = async (token) => {
  try {
    const res = await api.get('/analytics/usage-by-category', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch usage by category error:', error);
    throw error;
  }
};

export const fetchStockModifications = async (token, months = 12) => {
  try {
    const res = await api.get(`/analytics/stock-modifications?months=${months}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch stock modifications error:', error);
    throw error;
  }
};

export const fetchTopClients = async (token, limit = 10) => {
  try {
    const res = await api.get(`/analytics/top-clients?limit=${limit}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch top clients error:', error);
    throw error;
  }
};

export const fetchAdminActivity = async (token, days = 30) => {
  try {
    const res = await api.get(`/analytics/admin-activity?days=${days}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data;
  } catch (error) {
    console.error('Fetch admin activity error:', error);
    throw error;
  }
};

export default api; 