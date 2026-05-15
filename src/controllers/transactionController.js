const { success } = require("../utils/responseFormatter");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/asyncHandler");
const transaction = require("../models/transactionModel");

const getBalance = asyncHandler(async (req, res, next) => {
  const email = req.user.email;

  const currentBalance = await transaction.balanceModel.getUserBalance(email);

  if (currentBalance === null) {
    throw new ErrorResponse("User tidak ditemukan", 404, 101);
  }
  return success(res, "Get Balance Berhasil", {
    balance: currentBalance,
  });
});
const topUp = asyncHandler(async (req, res, next) => {
  const { top_up_amount } = req.body;
  const email = req.user.email;

  if (typeof top_up_amount !== "number" || top_up_amount <= 0) {
    throw new ErrorResponse(
      "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
      400,
      102,
    );
  }

  const invoiceNumber = `INV-${Date.now()}`;

  const newBalance = await transaction.balanceModel.topUp(
    email,
    top_up_amount,
    invoiceNumber,
  );

  return success(res, "Top Up Balance Berhasil", {
    balance: newBalance,
  });
});
const postTransaction = asyncHandler(async (req, res, next) => {
  const { service_code } = req.body;
  const email = req.user.email;

  if (!service_code) {
    throw new ErrorResponse("Service code harus diisi", 400, 102);
  }

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const invoiceNumber = `INV${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const result = await transaction.transactionModel.createPayment(
      email,
      service_code,
      invoiceNumber,
    );

    return success(res, "Transaksi berhasil", {
      invoice_number: result.invoice_number,
      service_code: result.service_code,
      service_name: result.service_name,
      transaction_type: result.transaction_type,
      total_amount: result.total_amount,
      created_on: result.created_on,
    });
  } catch (err) {
    if (err.customError) {
      throw new ErrorResponse(err.message, err.code, err.status);
    }
    throw err;
  }
});
const getTransactionHistory = asyncHandler(async (req, res, next) => {
  const email = req.user.email;
  const { limit } = req.query;

  const history = await transaction.transactionModel.getTransactionHistory(email, limit);

  return success(res, "Get History Berhasil", {
    offset: 0,
    limit: limit ? parseInt(limit) : history.length,
    records: history,
  });
});

module.exports = {
  getBalance,
  topUp,
  postTransaction,
  getTransactionHistory
};
