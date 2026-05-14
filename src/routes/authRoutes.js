const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /health-check:
 *   get:
 *     summary: Cek koneksi API dan Database
 *     tags:
 *       - Module System
 *     responses:
 *       200:
 *         description: Berhasil terhubung
 *       500:
 *         description: Koneksi database gagal
 *
 * /registration:
 *   post:
 *     summary: Pendaftaran User baru
 *     tags:
 *       - Module Membership
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "bagus@example.com"
 *               first_name:
 *                 type: string
 *                 example: "Bagus"
 *               last_name:
 *                 type: string
 *                 example: "Satrio"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Berhasil registrasi
 *       400:
 *         description: Validasi gagal (Status 102)
 */

router.post('/registration', authController.registration);
router.get('/health-check', authController.healthCheck);

module.exports = router;