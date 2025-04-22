const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');



const app = express();
const PORT = 5000;
require('./config/db'); 
// require('dotenv').config();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true              
}));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'eren139',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 1000 * 60 * 60 
  }
}));


// Routes

app.use('/images', express.static(path.join(__dirname, 'images'))); // to host images

const authRoutes = require('./routes/login');
app.use('/api', authRoutes);

const signupRoutes =require('./routes/signup');
app.use('/api',signupRoutes);

const subProductRoutes =require('./routes/subProduct');
app.use('/api',subProductRoutes);



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
