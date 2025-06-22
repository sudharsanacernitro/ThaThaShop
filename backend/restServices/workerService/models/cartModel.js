const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  productId: { type: Schema.Types.ObjectId, ref: 'products' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },

}, { timestamps: true });

module.exports = mongoose.model('cart', userSchema);