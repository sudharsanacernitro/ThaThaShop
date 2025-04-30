require('dotenv').config();
const vault = require('node-vault')({
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN
});

async function writeSecret() {
  try {
    const secretPath = 'secret/data/myapp/config'; // KV v2 format
    const secretData = {
      data: {
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
      }
    };

    const result = await vault.write(secretPath, secretData);
    console.log('Secret written:', result);
  } catch (err) {
    console.error('Error writing secret:', err.message);
  }
}

writeSecret();
