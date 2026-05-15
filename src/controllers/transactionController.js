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
const topUp = asyncHandler(async (req, res, next) => {
    const { top_up_amount } = req.body;
    const email = req.user.email;

    if (typeof top_up_amount !== 'number' || top_up_amount < 0) {
        throw new ErrorResponse("Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0", 400, 102);
    }

    const invoiceNumber = `INV-${Date.now()}`;

    const newBalance = await balanceModel.topUp(email, top_up_amount, invoiceNumber);

    return success(res, "Top Up Balance Berhasil", {
        balance: newBalance
    });
});

module.exports = {
    getBalance,
    topUp
};