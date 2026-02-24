const axios = require('axios');

const API_URL = "http://localhost:5000";

async function testActiveSale() {
    try {
        console.log(`Calling ${API_URL}/api/v1/flash-sales/active...`);
        const res = await axios.get(`${API_URL}/api/v1/flash-sales/active`);
        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.error('Error fetching active flash sale:', error.response ? error.response.data : error.message);
    }
}

testActiveSale();
