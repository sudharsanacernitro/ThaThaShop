const express = require('express');
const router = express.Router();
const Product = require('../models/productModel'); 

router.get('/category/:categoryName', async (req, res) => {
  const { categoryName } = req.params;

//   console.log(categoryName);

  try {
    const products = await Product.find({category:categoryName});

    // console.log(products);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
