const vault = require('node-vault')({
  endpoint: 'http://vault:8200',
  token: 'myroot'
});

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadSecrets(retries = 5, interval = 3000) {
  const secretPath = 'secret/data/myapp/config'; // KV v2 path

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await vault.read(secretPath);
      const cachedSecrets = result.data.data;
      console.log('✅ Secrets loaded from Vault:', cachedSecrets);

      process.env.MONGO_URI = cachedSecrets.MONGO_URI;
      process.env.JWT_SECRET = cachedSecrets.JWT_SECRET;
      process.env.JWT_REFRESH_SECRET = cachedSecrets.JWT_REFRESH_SECRET;

      return cachedSecrets; // success
    } catch (err) {
      console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);

      if (attempt === retries) {
        console.error('❌ Failed to load secrets from Vault after retries.');
        throw err;
      }

      console.log(`⏳ Retrying in ${interval / 1000}s...`);
      await delay(interval);
    }
  }
}

module.exports = { loadSecrets };
