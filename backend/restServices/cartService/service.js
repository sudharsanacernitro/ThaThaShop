const express = require('express');
const app = express();
const cors = require('cors');

const { loadSecrets } = require('./utils/vaultClient');
const connectDB = require('./config/db');

app.use(cors());
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser()); // 👈 Add this before your routes

const prodcutRoutes = require('./routes/cartRoutes');
app.use('/product', prodcutRoutes);




async function init() {
  try {
    // Step 1: Load secrets from Vault
    await loadSecrets();
    console.log('✅ Vault secrets loaded');

    // Step 2: Connect to the database using secrets
    await connectDB();
    console.log('✅ Database connected');

    // Step 3: Start your Express app
    app.listen(5002, () => {
      console.log('🚀 Auth service running at http://localhost:5002');
    });

  } catch (err) {
    console.error('❌ Initialization error:', err.message);
    process.exit(1);
  }
}

init();




