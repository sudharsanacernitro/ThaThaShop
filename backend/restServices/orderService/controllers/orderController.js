const Order = require('../models/orderModel');
const {logging} = require('../utils/logging');


const placeOrder = async (req, res) => {

    const userId = req.user.id;
    const email = req.user.email;
    const { productId, quantity , price , deliveryAddr , contact } = req.body;

    const order=new Order({
        userId,
        productId,
        quantity,
        price,
        deliveryAddress: deliveryAddr,
        contact
    });

    try {
        const savedOrder = await order.save();
        logging({ message: `[success]${email}- order placed added`,logLevel: 0});
        res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
    } catch (error) {
        logging({ message: `[failed]${email}- couldn't place orders`,logLevel: 2});
        res.status(500).json({ message: 'Error placing order', error });
    }
}


module.exports = {
    placeOrder
};