const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const transactionControllerss = require('../controllers/transactionController')

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
router.get('/balance', authMiddleware, transactionControllerss.getBalance);

module.exports = router;