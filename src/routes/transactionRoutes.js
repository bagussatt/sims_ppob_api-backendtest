const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const transactionControllerss = require("../controllers/transactionController");
const { transactionModel } = require("../models/transactionModel");

/**
 * @swagger
 * /balance:
 *   get:
 *     summary: Mendapatkan informasi saldo user
 *     tags:
 *       - Module Transaction
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get Balance Berhasil
 *       401:
 *         description: Token tidak valid atau kadaluwarsa
 */

/**
 * @swagger
 * /topup:
 *   post:
 *     summary: Melakukan top up saldo user
 *     tags:
 *       - Module Transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - top_up_amount
 *             properties:
 *               top_up_amount:
 *                 type: integer
 *                 example: 100000
 *     responses:
 *       200:
 *         description: Top Up Balance Berhasil
 *       400:
 *         description: Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0 (Status 102)
 *       401:
 *         description: Token tidak valid atau kadaluwarsa (Status 108)
 */

/**
 * @swagger
 * /transaction:
 *   post:
 *     summary: Melakukan transaksi layanan PPOB
 *     tags:
 *       - Module Transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service_code
 *             properties:
 *               service_code:
 *                 type: string
 *                 example: "PLN"
 *     responses:
 *       200:
 *         description: Transaksi berhasil
 *       400:
 *         description: Saldo tidak mencukupi / Service tidak ditemukan (Status 102)
 */

router.get("/balance", authMiddleware, transactionControllerss.getBalance);
router.post("/topup", authMiddleware, transactionControllerss.topUp);
router.post(
  "/transaction",
  authMiddleware,
  transactionControllerss.postTransaction,
);

module.exports = router;
