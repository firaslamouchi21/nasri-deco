const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('Testing API endpoints...\n');

  try {
    // Test admin login
    console.log('1. Testing admin login...');
    const loginResponse = await axios.post(`${API_BASE}/admin/login`, {
      email: 'admin@nasrideco.com',
      password: 'admin123'
    });
    console.log('✅ Login successful');
    const token = loginResponse.data.token;

    // Test materials endpoint
    console.log('\n2. Testing materials endpoint...');
    const materialsResponse = await axios.get(`${API_BASE}/admin/materials`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Materials loaded:', materialsResponse.data.length, 'materials');

    // Test financial summary
    console.log('\n3. Testing financial summary...');
    const financialResponse = await axios.get(`${API_BASE}/admin/financial-summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Financial summary:', financialResponse.data);

    // Test low stock
    console.log('\n4. Testing low stock...');
    const lowStockResponse = await axios.get(`${API_BASE}/admin/low-stock`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Low stock materials:', lowStockResponse.data.length);

    // Test material usage data
    console.log('\n5. Testing material usage data...');
    const usageResponse = await axios.get(`${API_BASE}/admin/material-usage-data`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Material usage data:', usageResponse.data.length, 'materials');

    console.log('\n🎉 All API tests passed!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testAPI(); 