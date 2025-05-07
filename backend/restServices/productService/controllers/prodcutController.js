const Product = require('../models/productModel');
const {logging} = require('../utils/logging');

async function getProductsByCategory(req,res) {
  const { categoryName } = req.body;
  // console.log(req.body);
  try {
    const products = await Product.find({ category: categoryName });

    logging({ message: `[success]- ${categoryName} products fetched`,logLevel: 0});
    return res.status(200).json({ success: true, data: products });
  } catch (err) {

    logging({ message: `[error]- ${categoryName} products not fetched ${err}`,logLevel: 2});
    return res.status(500).json({ success: false, error: 'Something went wrong' });

  }
}

async function getProductById(req,res) {
  const itemID  = req.params.id;

  console.log(req.body);

  try {
    const products = await Product.findById(itemID);
    if (!products) {
      logging({ message: `[error]- ${itemID} product not found`,logLevel: 2});
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    logging({ message: `[success]- ${itemID} product fetched`,logLevel: 0});
    return res.status(200).json({ success: true, data: products });

  } catch (err) {

    logging({ message: `[error]- ${itemID} product not fetched ${err}`,logLevel: 2});
    return res.status(500).json({ success: false, error: 'Something went wrong' });
  }
}

module.exports = { getProductsByCategory,
                     getProductById  
                };
