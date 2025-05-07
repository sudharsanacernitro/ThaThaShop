const Cart = require('../models/cartModel');
const fetch = require('node-fetch');

exports.addToCart = async (req, res) => {

  console.log(req.user);

  const userId = req.user.id;
  const { productId , quantity , price} = req.body;

  try {
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({ userId, productId, quantity , price});
    }

    await cartItem.save();
    res.status(200).json({ message: 'Item added to cart', cartItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart', details: err.message });
  }
};


exports.deleteFromCart = async (req, res) => {

  const userId = req.user.id;

  const {  cartElementId } = req.body;

  try {
    const result = await Cart.findByIdAndDelete(cartElementId);

    if (!result) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item', details: err.message });
  }
};


exports.listCartItems = async (req, res) => {
  const userId = req.user.id;
  const token = req.cookies['token']; // get JWT from cookie

  if (!token) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }

  try {
    const cartItems = await Cart.find({ userId });

    const enrichedCart = await Promise.all(cartItems.map(async (item) => {
      try {
        const response = await fetch(`http://productservice:5002/product/id/${item.productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `token=${token}` // forward JWT cookie
          }
        });

        if (!response.ok) {
          throw new Error(`Product service error: ${response.status}`);
        }

        const { data: product } = await response.json();

        return {
          ...item.toObject(),
          product,
        };
      } catch (err) {
        console.error(`Failed to fetch product ${item.productId}:`, err.message);
        return {
          ...item.toObject(),
          product: null,
        };
      }
    }));

    res.json(enrichedCart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart items', details: err.message });
  }
};
