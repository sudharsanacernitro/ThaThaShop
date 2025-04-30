// readSecret.js
const vault = require('node-vault')({
  endpoint: 'http://127.0.0.1:8200',
  token: 'myroot'
});

async function readSecret() {
  try {
    const secretPath = 'secret/data/myapp/config'; // KV v2 format
    const result = await vault.read(secretPath);
    const { username } = result.data.data;

    console.log('Retrieved secret:');
    console.log('Username:', username);
    // console.log('Password:', password);
  } catch (err) {
    console.error('Error reading secret:', err.message);
  }
}

readSecret();
