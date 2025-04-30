// writeSecret.js
const vault = require('node-vault')({
  endpoint: 'http://127.0.0.1:8200',
  token: 'myroot'
});

async function writeSecret() {
  try {
    const secretPath = 'secret/data/myapp/config'; // KV v2 format
    const secretData = {
      data: {
        username: 'admin',
        password: 'p@ssw0rd'
      }
    };

    const result = await vault.write(secretPath, secretData);
    console.log('Secret written:', result);
  } catch (err) {
    console.error('Error writing secret:', err.message);
  }
}

writeSecret();
