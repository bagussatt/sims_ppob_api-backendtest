const { success } = require('../utils/responseFormatter');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const balanceModel = require('../models/transactionModel');

const getBalance = asyncHandler(async (req, res, next) => {
    const email = req.user.email;

    const currentBalance = await balanceModel.getUserBalance(email);

    if (currentBalance === null) {
        throw new ErrorResponse("User tidak ditemukan", 404, 101);
    }
    return success(res, "Get Balance Berhasil", {
        balance: currentBalance
    });
});

module.exports = {
    getBalance
};