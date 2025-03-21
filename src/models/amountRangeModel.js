const mongoose = require('mongoose');

const amountRangeSchema = new mongoose.Schema({
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
//   range: { type: Number }
}, { timestamps: true }); 


module.exports = mongoose.model('AmountRange', amountRangeSchema);
