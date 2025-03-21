const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountHolderName: { type: String},
  accountNumber: { type: String },
  ifsc: { type: String },
  bankType : {
    type : String,
    enum : ["saving", "current"],
  }, 
  type : {
    type : String,
    enum : ["upi", "qr", "bank"],
  },
  upi: { type: String },
  upiNumber : { type: String},
  upiName: { type: String },
  upiMethod: { 
    type: String, 
    enum: [ "googlepay", "phonepe", "bhim", "paytm", "amazonpay"], 
  },
  qrImage: { type: String },
  qrName : { type: String },
  bankName: { type: String },
  amountRange: { type: mongoose.Schema.Types.ObjectId, ref: 'AmountRange', required: true },
  amountLimit: { type: Number, required: true },
  status : {  type: String, 
    enum: [ "active", "de-active"],default: "active" },
  isDeleted: { type: Boolean, default: false },
  balance : { type: Number, default: 0},
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
