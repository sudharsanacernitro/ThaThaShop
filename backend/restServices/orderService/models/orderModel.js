const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema({

  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date ,default: null},
  deliveryAddress: { type: String, required: true },
  contact: { type: String, required: true }

}, { timestamps: true } );

const Order = mongoose.model('order', orderSchema);

module.exports = Order;