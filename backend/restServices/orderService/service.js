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


const prodcutRoutes = require('./routes/orderRoutes');
app.use('/', prodcutRoutes);
app.get('/health', (req, res) => res.send('OK'));

const {readStream} =require('./redisStreamer');

async function init() {
  try {
    // Step 1: Load secrets from Vault
    await loadSecrets();
    console.log('✅ Vault secrets loaded');

    // Step 2: Connect to the database using secrets
    await connectDB();
    console.log('✅ Database connected');

    //step 3: read streams from redis streams
    // await readStream('$');

    // Step 4: Start your Express app
    app.listen(5004, () => {
      console.log('🚀 Auth service running at http://localhost:5004');
    });

  } catch (err) {
    console.error('❌ Initialization error:', err.message);
    process.exit(1);
  }
}

init();
readStream('$');





