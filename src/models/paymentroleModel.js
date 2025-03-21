const mongoose = require("mongoose");

const paymentRoleSchema = new mongoose.Schema(
  {
    payment_role_name: {
      type: String,
      required: true,
      unique: true
    },
    admin_route_permission: {
      type: [String], 
      default: []
    },
    role_order: {
        type: Number,
        required: true,
        unique: true
    }
  },
  { timestamps: true } 
);

module.exports = mongoose.model("PaymentRole", paymentRoleSchema);
