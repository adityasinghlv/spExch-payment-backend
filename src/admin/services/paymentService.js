const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { statusCode, resMessage } = require("../../config/default.json");
const devConfig = require("../../config/dev.config");


const amountRangeModel = require("../../models/amountRangeModel.js");
const BankModel = require("../../models/accountModel.js");
const PaymentModel = require("../../models/paymentModel.js");
const userModel = require("../../models/userModel.js");
const paymentRoleModel = require("../../models/paymentroleModel.js");
/**
 * Handles the login process for admin users.
 *
 * @param {object} body - The request body containing user credentials.
 * @param {string} body.username - The username of the user.
 * @param {string} body.password - The password of the user.
 *
 * @returns {object} - An object containing the status code, success flag, message, and data.
 * @returns {number} statusCode - The HTTP status code.
 * @returns {boolean} success - Whether the operation was successful or not.
 * @returns {string} message - A message describing the result.
 * @returns {object} data - The user object with updated token and login date.
 */
exports.login = async (body) => {
  try {
    const checkUser = await userModel.findOne({
      username: body.username
    });
    if (!checkUser) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: "user not found",
      };
    }

    const isPasswordValid = await bcrypt.compare(body.password, checkUser.password);
    if (!isPasswordValid) {
      return {
        statusCode: statusCode.UNAUTHORIZED,
        success: false,
        message: "invalid password",
      };
    }

    const role = await paymentRoleModel.findById({_id :checkUser.paymentRole});
    if (!role) {
      return {
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Role not found",
      };
    }

    const token = jwt.sign(
      { userId: checkUser._id, role: role.payment_role_name },
      devConfig.JWT_KEY,
      { expiresIn: devConfig.TOKEN_EXP }
    );
    return {
      statusCode: statusCode.OK,
      success: true,
      message: `${role.payment_role} login successfully!`,
      data: {
        userId: checkUser._id,
        payment_token: token,
        role: role.payment_role,
      },
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};
exports.addAmountRange = async (body) => {
  try {
   
    const result = new amountRangeModel({
      minAmount: body.minAmount,
      maxAmount: body.maxAmount,
    });

    await result.save();

    return {
      statusCode: statusCode.CREATED,
      success: true,
      message: 'Amount range created successfully',
      data: result,
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};

exports.updateAmountRange = async (body) => {
  try {
    const updatedRange = await amountRangeModel.findByIdAndUpdate(
      body.amountRangeId,
      {
        minAmount: body.minAmount,
        maxAmount: body.maxAmount,
      },
      { new: true } 
    );

    if (!updatedRange) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.Data_Not_Found,
      };
    }

    return {
      statusCode: statusCode.OK,
      success: true,
      message: 'Amount range updated successfully',
      data: updatedRange,
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};

exports.getAmountRange = async () => {
  try {
    const ranges = await amountRangeModel.find();

    if (!ranges || ranges.length === 0) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.Data_Not_Found,
      };
    }

    return {
      statusCode: statusCode.OK,
      success: true,
      message: 'Amount ranges retrieved successfully',
      data: ranges,
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};

exports.deleteAmountRange = async (body) => {
  try {
    const deletedRange = await amountRangeModel.findByIdAndDelete(body.amountRangeId);

    if (!deletedRange) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.Data_Not_Found,
      };
    }

    return {
      statusCode: statusCode.OK,
      success: true,
      message: 'Amount range deleted successfully',
      data: deletedRange,
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};

exports.addBank = async (body) => {
  try {
    const bankData = new BankModel({
      accountHolderName : body.accountHolderName,
      bankName : body.bankName,
      ifsc : body.ifsc,
      accountNumber : body.accountNumber,
      type: "bank", 
      bankType : body.bankType,
      amountRange : body.amountRange,
      amountLimit : body.amountLimit,
      status: "active", 
    });

    const newBank = new BankModel(bankData);
    await newBank.save();

    return {
      statusCode: statusCode.CREATED,
      success: true,
      message: "Bank added successfully",
      data: newBank,
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message,
    };
  }
};
exports.addupi = async (body) => {
  try {
    const upiData = new BankModel({
      upi : body.upi,
      upiNumber : body.upiNumber,
      upiName : body.upiName,
      upiMethod : body.upiMethod,
      type: "upi", 
      amountRange : body.amountRange,
      amountLimit : body.amountLimit,
      status: "active", 
    });

    const upi = new BankModel(upiData);
    const newbank = await upi.save();

    return {
      statusCode: statusCode.CREATED,
      success: true,
      message: "Bank added successfully",
      data: newbank,
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message,
    };
  }
};

exports.getBanks = async (type, amount) => {
  try {
    const matchStage = { isDeleted: false }; 
    let amountInt = parseInt(amount);

    if (type) matchStage.type = type;

    const pipeline = [
      { $match: matchStage }, 
      {
        $lookup: {
          from: "amountranges",
          localField: "amountRange",
          foreignField: "_id",
          as: "amountRange",
        },
      },
      { $unwind: "$amountRange" },
      {
        $addFields: {
          minAmount: "$amountRange.minAmount",
          maxAmount: "$amountRange.maxAmount",
        },
      },
    ];

    if (amount !== undefined) {
      pipeline.push({
        $match: {
          minAmount: { $lte: amountInt },
          "amountRange.maxAmount": { $gte: amountInt },
          amountLimit: { $gte: amountInt },
        },
      });
    }

    console.log(JSON.stringify(pipeline));

    const banks = await BankModel.aggregate(pipeline);

    if (!banks || banks.length === 0) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: "No banks found for the given criteria",
      };
    }

    return {
      statusCode: statusCode.OK,
      success: true,
      message: "Banks retrieved successfully",
      data: banks,
    };
  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};



exports.getupi = async () => {
  try {
    const upi = await BankModel.find({type : 'upi'}).populate('amountRange');

    if (!upi || upi.length === 0) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.Data_Not_Found,
      };
    }

    return {
      statusCode: statusCode.OK,
      success: true,
      message: 'upi retrieved successfully',
      data: upi
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};

 exports.updateBank = async (body) => {
  try {
    const {
      bankId,
      bankName,
      ifsc,
      accountNumber,
      upi,
      upiName,
      qr,
      amountRange,
      amountLimit,
      accountHolderName
    } = body;

    if (!bankId) {
      return {
        statusCode: statusCode.BAD_REQUEST,
        success: false,
        message: "Bank ID is required",
      };
    }

    const updateFields = Object.fromEntries(
      Object.entries({
        bankName,
        ifsc,
        accountNumber,
        upi,
        upiName,
        qr,
        amountRange,
        amountLimit,
        accountHolderName
      }).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(updateFields).length === 0) {
      return {
        statusCode: statusCode.BAD_REQUEST,
        success: false,
        message: "No valid fields provided for update",
      };
    }

    // Fetch the amountRange document
    if (amountLimit !== undefined && amountRange) {
      const rangeDoc = await amountRangeModel.findById(amountRange);
      if (!rangeDoc) {
        return {
          statusCode: statusCode.NOT_FOUND,
          success: false,
          message: "Amount range not found",
        };
      }

      const { min, max } = rangeDoc; // Assuming min and max exist in the range document

      if (amountLimit < min || amountLimit > max) {
        return {
          statusCode: statusCode.BAD_REQUEST,
          success: false,
          message: `amountLimit (${amountLimit}) must be between ${min} and ${max}`,
        };
      }
    }

    // Update the bank record
    const updatedBank = await BankModel.findByIdAndUpdate(
      bankId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedBank) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.Data_Not_Found,
      };
    }

    return {
      statusCode: statusCode.OK,
      success: true,
      message: "Bank updated successfully",
      data: updatedBank,
    };

  } catch (error) {
    return {
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};



exports.updateupi = async (body) => {
  try {
    const {
      upiId,
      upi,
      upiNumber,
      upiName,
      upiMethod,
      amountRange,
      amountLimit,
      status
    } = body;

    if (!upiId) {
      return {
        statusCode: statusCode.BAD_REQUEST,
        success: false,
        message: "UPI ID is required",
      };
    }

    const updateFields = Object.fromEntries(
      Object.entries({
        upi,
        upiNumber,
        upiName,
        upiMethod,
        amountRange,
        amountLimit,
        status
      }).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(updateFields).length === 0) {
      return {
        statusCode: statusCode.BAD_REQUEST,
        success: false,
        message: "No valid fields provided for update",
      };
    }

    // Validate amountLimit against amountRange
    if (amountLimit !== undefined && amountRange) {
      const rangeDoc = await amountRangeModel.findById(amountRange);
      if (!rangeDoc) {
        return {
          statusCode: statusCode.NOT_FOUND,
          success: false,
          message: "Amount range not found",
        };
      }

      const { min, max } = rangeDoc; // Assuming min and max exist in the range document

      if (amountLimit < min || amountLimit > max) {
        return {
          statusCode: statusCode.BAD_REQUEST,
          success: false,
          message: `amountLimit (${amountLimit}) must be between ${min} and ${max}`,
        };
      }
    }

    // Update UPI record
    const updatedUpi = await BankModel.findByIdAndUpdate( // Assuming UpiModel is correct
      upiId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUpi) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.Data_Not_Found,
      };
    }

    return {
      statusCode: statusCode.OK,
      success: true,
      message: "UPI updated successfully",
      data: updatedUpi,
    };

  } catch (error) {
    return {
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};



exports.deleteBank = async (body) => {
  try {
    const updatedBank = await BankModel.findByIdAndUpdate(
      body.bankId,
      { $set: { isDeleted: true } }, 
      { new: true } 
    );

    if (!updatedBank) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.Data_Not_Found,
      };
    }

    return {
      statusCode: statusCode.OK,
      success: true,
      message: 'Bank marked as deleted successfully',
      data: updatedBank
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};



exports.deleteupi = async (body) => {
  try {
    const deletedupi = await BankModel.findByIdAndUpdate(
      body.bankId,
      { $set: { isDeleted: true } }, 
      { new: true } 
    );
    if (!deletedupi) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.Data_Not_Found,
      };
    }

    return {
      statusCode: statusCode.OK,
      success: true,
      message: 'UPI deleted successfully',
      data: deletedupi
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};


exports.userPayment = async (req, body) => {
  try {
    console.log(req.body);
    if (!req.body.userName || !req.file || !req.file.path) {
      return {
        statusCode: 400,
        success: false,
        message: "Invalid file",
      };
    }    
    const user = await userModel.findOne({ username: req.body.userName });
    console.log({ username: req.body.userName });
    console.log(user);
    if (!user) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: "User not found",
      };
    }

    const bank = await BankModel.findById(req.body.bankId);
    if (!bank) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.Data_Not_Found,
      };
    }

    if (bank.amountLimit < req.body.amount) {
      return {
        statusCode: statusCode.BAD_REQUEST,
        success: false,
        message: "Insufficient amount limit in the bank",
      };
    }
    const relativeFilePath = `paymentscreenshot/${req.body.userName}/${req.file.filename}`;

    const payment = new PaymentModel({
      username: req.body.userName,
      userId: user._id, 
      amount: req.body.amount,
      bank: req.body.bankId,
      screenshot: relativeFilePath,
    });

    await payment.save();

    bank.amountLimit -= req.body.amount;
    bank.balance += Number(req.body.amount);
    await bank.save();

    return {
      statusCode: statusCode.CREATED,
      success: true,
      message: 'Payment processed successfully',
      data: {
        payment,
        updatedBank: bank
      }
    };

  } catch (error) {
    console.log(error);
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};


exports.addQr = async (req, res) => {
  try {
   
    if (!req.body.qrName || !req.file || !req.file.path) {
      return {
        statusCode: 400,
        success: false,
        message: "Invalid file",
      };
    }
    if (!mongoose.Types.ObjectId.isValid(req.body.amountRange)) {
      return {
        statusCode: 400,
        success: false,
        message: "Invalid amountRange ID",
      };
    }
    const relativeFilePath = `uploads/${req.body.qrName}/${req.file.filename}`;

    const qr = new BankModel({
      qrName: req.body.qrName,
      qrImage: relativeFilePath, 
      amountLimit: req.body.amountLimit,
      amountRange: new mongoose.Types.ObjectId(req.body.amountRange),
      type: "qr",
    });
    const QrData = await qr.save();
   
    return {
      statusCode: 201,
      success: true,
      message: resMessage.Picture_Created_Successfully,
      data: QrData,
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message,
    };
  }
};

exports.getQr = async () => {
  try {
    const qrList  = await BankModel.find({type : 'qr'}).populate('amountRange');
     console.log(qrList )
    if (!qrList  || qrList .length === 0) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.Data_Not_Found,
      };
    }
    const baseUrl = `http://${devConfig.HOST}:${devConfig.PORT}`;

    const formattedQrList = qrList.map((qr) => ({
      ...qr.toObject(),
      qrImage: `${baseUrl}/${qr.qrImage.replace(/\\/g, "/")}`, 
    }));

    return {
      statusCode: statusCode.OK,
      success: true,
      message: 'upi retrieved successfully',
      data: formattedQrList
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};

exports.updateQr = async (req) => {
  try {
    const { qrId, qrName, amountLimit, amountRange, status } = req.body; 

    if (!qrId) {
      return {
        statusCode: 400,
        success: false,
        message: "qrId is required",
      };
    }

    const existingQr = await BankModel.findById(qrId);
    if (!existingQr) {
      return {
        statusCode: 404,
        success: false,
        message: "QR not found",
      };
    }

    let updatedQrImage = existingQr.qrImage;

    if (req.file) {
      try {
        const oldFilePath = path.resolve(existingQr.qrImage);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }

        updatedQrImage = `uploads/${qrName}/${req.file.filename}`;
      } catch (error) {
        return {
          statusCode: 500,
          success: false,
          message: "Failed to upload QR image",
        };
      }
    }

    const updatedQr = await BankModel.findByIdAndUpdate(
      qrId,
      {
        qrName,
        qrImage: updatedQrImage,
        amountLimit,
        amountRange: amountRange ? new mongoose.Types.ObjectId(amountRange) : existingQr.amountRange,
        status: status || existingQr.status,
      },
      { new: true }
    );

    return {
      statusCode: 200,
      success: true,
      message: "QR updated successfully",
      data: updatedQr,
    };
  } catch (error) {
    return {
      statusCode: 400,
      success: false,
      message: error.message || "Server error",
    };
  }
};


exports.getPayment = async (req, res) => {
  try {
    const { fromDate, toDate, userName, bankId, amount, type, upiMethod, page = 1, limit = 10 } = req.query;
    const matchStage = {};

    if (userName) matchStage.username = userName;
    if (bankId) matchStage.bank = new mongoose.Types.ObjectId(bankId);
    if (amount) matchStage.amount = parseFloat(amount);

    if (fromDate && toDate) {
      matchStage.createdAt = {
        $gte: moment(fromDate).startOf('day').toDate(),
        $lte: moment(toDate).endOf('day').toDate(),
      };
    } else if (fromDate) {
      matchStage.createdAt = {
        $gte: moment(fromDate).startOf('day').toDate(),
      };
    } else if (toDate) {
      matchStage.createdAt = {
        $lte: moment(toDate).endOf('day').toDate(),
      };
    }

    const payments = await PaymentModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'accounts',
          localField: 'bank',
          foreignField: '_id',
          as: 'accountDetails',
        },
      },
      { $unwind: '$accountDetails' },
      {
        $match: {
          ...(type && { 'accountDetails.type': type }),
          ...(upiMethod && { 'accountDetails.upiMethod': upiMethod })
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          amount: 1,
          type: '$accountDetails.type',
          bankName: '$accountDetails.bankName',
          accountHolderName: '$accountDetails.accountHolderName',
          accountNumber: '$accountDetails.accountNumber',
          ifsc: '$accountDetails.ifsc',
          bankType: '$accountDetails.bankType',
          upi: '$accountDetails.upi',
          upiNumber: '$accountDetails.upiNumber',
          upiName: '$accountDetails.upiName',
          upiMethod: '$accountDetails.upiMethod',
          qrName: '$accountDetails.qrName',
          balance: '$accountDetails.balance',
          amountLimit: '$accountDetails.amountLimit',
          status: '$accountDetails.status',
          createdAt: 1,
          screenshot: 1,
        },
      },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    ]);
    //  console.log(JSON.stringify(payments));
    if (!payments || payments.length === 0) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: 'No payments found',
      };
    }

    return {
      statusCode: statusCode.OK,
      success: true,
      message: 'Payments retrieved successfully',
      data: payments,
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Internal server error',
    };
  }
};


exports.deleteQr = async (body) => {
  try {
    const deletedQr = await BankModel.findByIdAndUpdate(
      body.bankId,
      { $set: { isDeleted: true } }, 
      { new: true } 
    );
    if (!deletedQr) {
      return {
        statusCode: statusCode.NOT_FOUND,
        success: false,
        message: resMessage.Data_Not_Found,
      };
    }

    return {
      statusCode: statusCode.OK,
      success: true,
      message: 'upi deleted successfully',
      data: deletedQr
    };

  } catch (error) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      success: false,
      message: error.message || resMessage.Server_error,
    };
  }
};