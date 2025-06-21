const Cart = require('../models/cartModel');
const fetch = require('node-fetch');
const {logging} = require('../utils/logging');

exports.addToCart = async (req, res) => {

  console.log(req.user);

  const userId = req.user.id;
  const email = req.user.email;

  const { productId , quantity , price} = req.body;

  try {
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({ userId, productId, quantity , price});
    }

    await cartItem.save();

    logging({ message: `[success]${email}- cart item added`,logLevel: 0});
    res.status(200).json({ message: 'Item added to cart', cartItem });

  } catch (err) {

    logging({ message: `[error]${email}- unable to add cart item`,logLevel: 2});
    res.status(500).json({ error: 'Failed to add to cart', details: err.message });
  }
};


exports.deleteFromCart = async (req, res) => {

  const userId = req.user.id;
  const email = req.user.email;

  const {  cartElementId } = req.body;

  try {
    const result = await Cart.findByIdAndDelete(cartElementId);

    if (!result) {

      logging({ message: `[404-Not found]${email}- Item not found in cart`,logLevel: 2});
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    logging({ message: `[success]${email}- cart item removed`,logLevel: 0});
    res.status(200).json({ message: 'Item removed from cart' });

  } catch (err) {

    logging({ message: `[failed]${email}- failed to remove ${err.message}`,logLevel: 2});
    res.status(500).json({ error: 'Failed to remove item', details: err.message });
  }
};


exports.listCartItems = async (req, res) => {
  const userId = req.user.id;
  const email = req.user.email;
  const token = req.cookies['token']; // get JWT from cookie

  if (!token) {

    logging({ message: `[unauthorized]${email}`,logLevel: 2});
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
          logging({ message: `[failed]${email} - failed to fetch product details from cart using fetch`,logLevel: 2});
          throw new Error(`Product service error: ${response.status}`);
        }

        const { data: product } = await response.json();

        return {
          ...item.toObject(),
          product,
        };
      } catch (err) {

        logging({ message: `[success]${email} - fetch product details `,logLevel: 0});
        return {
          ...item.toObject(),
          product: null,
        };
      }
    }));

    res.json(enrichedCart);
  } catch (err) {

    logging({ message: `[failed]${email} - failed to fetch product details `,logLevel: 2});
    res.status(500).json({ error: 'Failed to fetch cart items', details: err.message });
  }
};
