const axios = require('axios');

async function testEndpoints() {
  try {
    console.log('Testing analytics endpoints...');
    
    // First get admin token
    console.log('\n1. Getting admin token...');
    const loginResponse = await axios.post('http://localhost:5000/api/admin/login', {
      email: 'admin@nasri-deco.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Token received:', token ? 'YES' : 'NO');
    
    if (!token) {
      console.log('No token received, cannot test protected endpoints');
      return;
    }
    
    // Test dashboard summary
    console.log('\n2. Testing dashboard summary...');
    const summaryResponse = await axios.get('http://localhost:5000/api/analytics/dashboard-summary', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Dashboard Summary Response:', summaryResponse.data);
    
    // Test top materials
    console.log('\n3. Testing top materials...');
    const materialsResponse = await axios.get('http://localhost:5000/api/analytics/top-used-materials', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Top Materials Response:', materialsResponse.data);
    
  } catch (error) {
    console.error('Error details:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

testEndpoints();
