const mongoose = require('mongoose');

mongoose.connect("mongodb://mongo:27017/ThaThaShop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
});
