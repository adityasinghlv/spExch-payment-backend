const services = require('../services/paymentService');
const { statusCode } = require('../../config/default.json');
/** 
 * Function to handle user login.
 *
 * @param {Object} req - The function parameter object.
 * @param {Object} req.body - The request body containing user credentials.
 * @returns {Object} - An object containing the status code, success flag, and message or the user data.
 * @throws Will throw an error if there is a problem with the database or input validation.
 */
exports.login = async ({ body }) => {
    try {
        return await services.login(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};
exports.addAmountRange = async ({ body }) => {
    try {
        return await services.addAmountRange(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};
exports.updateAmountRange = async ({ body }) => {
  try {
      return await services.updateAmountRange(body);
  } catch (error) {
      return {
          statusCode: statusCode.BAD_REQUEST,
          success: false,
          message: error.message
      };
  }
};

exports.getAmountRange = async ({ body }) => {
    try {
        return await services.getAmountRange(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
  };

exports.deleteAmountRange = async ({ body }) => {
    try {
        return await services.deleteAmountRange(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
  };  

exports.addBank = async ({body}) => {
    try {
        return await services.addBank(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};
exports.addupi = async ({body}) => {
    try {
        return await services.addupi(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};

exports.updateBank = async ({ body }) => {
    try {
        return await services.updateBank(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};
exports.updateupi = async ({ body }) => {
    try {
        return await services.updateupi(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};

exports.getBanks = async (req, res) => {
    try {
        const { type,amount } = req.query
        return await services.getBanks(type,amount);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
}

exports.getupi = async ({ body }) => {
    try {
        return await services.getupi(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
}

exports.getQr = async ({ body }) => {
    try {
        return await services.getQr(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
}

exports.deleteBank = async ({ body }) => {
    try {
        return await services.deleteBank(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
}
exports.deleteupi = async ({ body }) => {
    try {
        return await services.deleteupi(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
}
exports.deleteQr = async ({ body }) => {
    try {
        return await services.deleteQr(body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
}

exports.userPayment = async (req,{ body }) => {
    try {
        return await services.userPayment(req,body);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};

exports.addQr = async (req) => {
    try {
        return await services.addQr(req);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};

exports.updateQr = async (req, res) => {
    try {
        return await services.updateQr(req);
    } catch (error) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};

exports.getPayment = async (req,{ body }) => {
    try {
        return await services.getPayment(req,body);
    } catch (error) {
        console.log(error);
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
}

exports.getUser = async (req) => {
    try {
        return await services.getUser(req);
    } catch (error) {
        console.log(error);
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
}