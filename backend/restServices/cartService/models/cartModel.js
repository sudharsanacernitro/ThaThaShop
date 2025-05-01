const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  productId: { type: Schema.Types.ObjectId, ref: 'product' },
  quantity: { type: Number, required: true },

}, { timestamps: true });

module.exports = mongoose.model('cart', userSchema);