const http = require('http');

http.get('http://localhost:5000/api/v1/flash-sales/active', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            console.log('Data:', JSON.stringify(JSON.parse(data), null, 2));
        } catch (e) {
            console.log('Raw Data:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
