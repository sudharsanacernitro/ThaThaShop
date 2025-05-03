const Product = require('../models/productModel');


async function getProductsByCategory(req,res) {
  const { categoryName } = req.body;
  console.log(req.body);
  try {
    const products = await Product.find({ category: categoryName });
    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: 'Something went wrong' });
  }
}

async function getProductById(req,res) {
  const itemID  = req.params.id;

  console.log(req.body);

  return res.status(200).json({ success: true, data: itemID });
  // try {
  //   const products = await Product.findById(itemID);
  //   if (!products) {
  //     return res.status(404).json({ success: false, error: 'Product not found' });
  //   }
  //   return res.status(200).json({ success: true, data: products });
  // } catch (err) {
  //   console.log(err);
  //   return res.status(500).json({ success: false, error: 'Something went wrong' });
  // }
}

module.exports = { getProductsByCategory,
                     getProductById  
                };
