const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const roleModel = require("../models/roleModel");
const config = require("../config/dev.config");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ success: false, message: "Token Not Found", data: [] });
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token Missing", data: [] });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_KEY);
    } catch (err) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Invalid or Expired Token",
          data: [],
        });
    }

    const userId = new mongoose.Types.ObjectId(decoded.userId);
    let userAggregation;
    try {
      userAggregation = await userModel.aggregate([
        { $match: { _id: userId, isDeleted: false } },
        {
          $lookup: {
            from: "paymentroles",
            localField: "paymentRole",
            foreignField: "_id",
            as: "role_details",
          },
        },
        { $unwind: "$role_details" },
        {
          $project: {
            _id: 1,
            username: 1,
            name: 1,
            paymentRole: "$role_details._id",
            payment_role_name: "$role_details.payment_role_name",
            role_order: "$role_details.role_order",
            status: 1,
            totalBalance :1,
            creditReference: 1,
            openingBalance: 1,
            commission: 1,
            profitLossBalance: 1,
            createdBy: 1,
            exposer : 1,
            partnership :1,
            exposureLimit :1,
            isDeleted: 1,
          },
        },
      ]);
    } catch (err) {
      console.error("Aggregation Error:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Database Aggregation Failed",
          data: [],
        });
    }

    if (!userAggregation.length) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: User Not Found",
          data: [],
        });
    }

    const user = userAggregation[0];

    req.user = user;
    req.role = {
      _id: user.role,
      role_name: user.role_name,
      role_order: user.role_order,
    };

    next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", data: [] });
  }
};
