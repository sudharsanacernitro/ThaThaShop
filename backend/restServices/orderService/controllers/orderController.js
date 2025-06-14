const Order = require('../models/orderModel');
const {logging} = require('../utils/logging');
const {sendEmailMessage,confirmationEmailTemplate,orderUpdateEmailTemplate} = require('../utils/emailHandler');
const { json } = require('express');

const placeOrder =  async (req, res) => {

    console.log("Place order called");
    const userId = req.user.id;
    const email = req.user.email;
    const { productId, quantity , price , deliveryAddr , contact , productName} = req.body;

    const order=new Order({
        userId,
        productId,
        quantity,
        price,
        deliveryAddress: deliveryAddr,
        userEmail:email,
        userContact:contact,
    });

    try {

        const savedOrder = await order.save();
        logging({ message: `[success]${email}- order placed added`,logLevel: 0});
        console.log(savedOrder);
        const emailPayload = confirmationEmailTemplate({
            to: email,
            itemname: productName,
            quantity: quantity
        });
        await sendEmailMessage(emailPayload);
        logging({ message: `[success]${email}- order placed email sent`,logLevel: 0});
        res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
    } catch (error) {
        logging({ message: `[failed]${email}- couldn't place orders`,logLevel: 2});
        res.status(500).json({ message: 'Error placing order', error });
    }
}
const getOrdersByUserId = async (req, res) => {
    try {
      const results = await Order.find();
  
      console.log("Aggregation results:", results);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error in aggregation:", error);
      res.status(500).json({ error: "Server error" });
    }
  };


// const getByUserId = async (req, res) => {
//     const {userId} = req.body;
//     try {
//         const order = await Order.find({userId:userId});
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         res.status(200).json(order);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching order', error });
//     }
// };


// const updateOrderStatus = async (req, res) => {
//     const { orderId, status } = req.body;
//     try {
//         const updatedOrder = await Order.findandUpdate(
//             { _id: orderId },
//             { status: status },
//             { new: true }
//         );
  
const displayOrder = async (req, res) => {

  const orderId = req.body.orderId;
  const token = req.cookies['token']; // get JWT from cookie

  if (!token) {

    logging({ message: `[unauthorized]`,logLevel: 2});
    return res.status(401).json({ error: 'Authentication token missing' });
  }

  try {
    const orderItem = await Order.findById(orderId);
    if (!orderItem) {
      logging({ message: `[404-Not found]- Item not found in cart`,logLevel: 2});
      return res.status(404).json({ message: 'Item not found in cart' });
    }

      try {
        const response = await fetch(`http://productservice:5002/product/id/${orderItem.productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `token=${token}` // forward JWT cookie
          }
        });

        if (!response.ok) {
          logging({ message: `[failed] - failed to fetch product details from cart using fetch`,logLevel: 2});
          throw new Error(`Product service error: ${response.status}`);
        }

        const { data: product } = await response.json();

        console.log("Product details:", product);
        return res.json(
          product,
        );

      } catch (err) {

        logging({ message: `[success] - fetch product details `,logLevel: 0});
        console.log("Product details:", product,err);
        return res.json({
          product: null,
      });
      }

  } catch (err) {

    logging({ message: `[failed] - failed to fetch product details `,logLevel: 2});
    res.status(500).json({ error: 'Failed to fetch cart items', details: err.message });
  }
};


const updateOrder = async(req,res) => {

  console.log("Update order called",req.body);
  const orderId= req.body.id;
  const status = req.body.status;
  const deliveryDate = req.body.deliveryDate;
  const userEmail = req.body.email;
  const productName = req.body.name;
  const quantity = req.body.quantity;

  const emailPayload = orderUpdateEmailTemplate({
    to: userEmail,
    itemname: productName,
    quantity: quantity,
    date: deliveryDate,
    status: status
  });

  await sendEmailMessage(emailPayload);
  logging({ message: `[success]${userEmail}- order update email sent`,logLevel: 0});
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status , deliveryDate: deliveryDate},
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }


    res.status(200).json(updatedOrder);
  }
  catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }

  res.status(200).json({ message: 'Order updated successfully' });
}


module.exports = {
    placeOrder,
    getOrdersByUserId,
    displayOrder,
    updateOrder,

};