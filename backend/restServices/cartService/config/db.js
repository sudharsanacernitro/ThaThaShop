const mongoose = require('mongoose');


async function connectDB() {

    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.log('MongoDB connected');
    }).catch(err => {
      console.error('MongoDB connection failed:', err.message);
    });

}

module.exports = connectDB;