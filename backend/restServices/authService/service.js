const express = require('express');
const app = express();
const cors = require('cors');

const { loadSecrets } = require('./utils/vaultClient');
const connectDB = require('./config/db');

app.use(cors({
  origin: ['http://localhost:3000','https://frontend.localhost'], // Replace with your frontend URL
  credentials: true,
}));

app.use(express.json());
app.set('trust proxy', 1); // Or 'loopback', or true
const cookieParser = require('cookie-parser');
app.use(cookieParser()); // 👈 Add this before your routes


const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);
app.get('/auth/health', (req, res) => res.send('OK'));


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




