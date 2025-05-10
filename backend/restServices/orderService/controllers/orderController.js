const Order = require('../models/orderModel');
const {logging} = require('../utils/logging');
const {sendEmailMessage,emailTemplate} = require('../utils/emailHandler');

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
        contact:contact+","+email
    });

    try {

        const savedOrder = await order.save();
        logging({ message: `[success]${email}- order placed added`,logLevel: 0});
        console.log(savedOrder);
        const emailPayload = emailTemplate({
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
      const results = await Order.aggregate([
        {
          $group: {
            _id: "$userId",
            contact: { $first: "$contact" },
            orderDate: { $first: "$orderDate" },
            status: { $first: "$status" },
            totalAmount: {
              $sum: { $multiply: ["$price", "$quantity"] } 
            },
            orderCount: { $sum: 1 }
          }
        }
      ]);
  
      console.log("Aggregation results:", results);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error in aggregation:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  

module.exports = {
    placeOrder,
    getOrdersByUserId
};