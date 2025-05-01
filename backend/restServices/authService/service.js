const express = require('express');
const app = express();
const cors = require('cors');

const { loadSecrets } = require('./utils/vaultClient');
const connectDB = require('./config/db');

app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);


async function init() {
  try {
    // Step 1: Load secrets from Vault
    await loadSecrets();
    console.log('✅ Vault secrets loaded');

    // Step 2: Connect to the database using secrets
    await connectDB();
    console.log('✅ Database connected');

    // Step 3: Start your Express app
    app.listen(5001, () => {
      console.log('🚀 Auth service running at http://localhost:5001');
    });

  } catch (err) {
    console.error('❌ Initialization error:', err.message);
    process.exit(1);
  }
}

init();




