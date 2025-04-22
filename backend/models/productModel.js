const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  available: Boolean,
  category: String
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;
