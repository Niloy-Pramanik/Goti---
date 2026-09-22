const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:8080/api/users/login', {
      email: 'nkthedecent2002@gmail.com',
      password: 'password'
    });
    const token = loginRes.data.token;
    console.log("Logged in:", token.substring(0, 20) + '...');
    
    const logsRes = await axios.get('http://localhost:8080/api/time-logs/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Logs:", logsRes.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

test();
