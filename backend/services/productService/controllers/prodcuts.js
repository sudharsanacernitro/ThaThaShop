const Product = require('../models/productModel');

async function getProductsByCategory(categoryName) {
  try {
    const products = await Product.find({ category: categoryName });
    return { success: true, data: products };
  } catch (err) {
    return { success: false, error: 'Something went wrong' };
  }
}

module.exports = { getProductsByCategory };
