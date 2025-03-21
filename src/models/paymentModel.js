const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  username: { type: String, required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  amount: { type: Number, required: true },
  bank: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank', required: true },
  screenshot: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
