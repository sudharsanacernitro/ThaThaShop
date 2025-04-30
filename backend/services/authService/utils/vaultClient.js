// require('dotenv').config();
const vault = require('node-vault')({
  endpoint: 'http://127.0.0.1:8200',
  token: 'myroot'
});
// 
async function loadSecrets() {

  try {
    const secretPath = 'secret/data/myapp/config'; // KV v2 format
    const result = await vault.read(secretPath);
    cachedSecrets = result.data.data; // Cache the secrets

    process.env.MONGO_URI = cachedSecrets.MONGO_URI;
    process.env.JWT_SECRET = cachedSecrets.JWT_SECRET;
    process.env.JWT_REFRESH_SECRET = cachedSecrets.JWT_REFRESH_SECRET;

  } catch (err) {
    console.error('Error loading secrets from Vault:', err.message);
    throw err;
  }
}

module.exports = { loadSecrets };
