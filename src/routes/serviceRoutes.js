const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const serviceController = require('../controllers/serviceController')

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Mendapatkan list Service/Layanan PPOB
 *     description: Endpoint ini digunakan untuk mengambil daftar layanan yang tersedia. Memerlukan Bearer Token.
 *     tags:
 *       - Module Information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sukses
 *       401:
 *         description: Token tidak valid atau kadaluwarsa
 *        
 */
router.get('/services', authMiddleware, serviceController.getServices );

module.exports = router;