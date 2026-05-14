const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

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
 *                 example: "password123SL"
 *     responses:
 *       200:
 *         description: Berhasil registrasi
 *       400:
 *         description: Validasi gagal (Status 102)
 * /login:
 *   post:
 *     summary: Masuk menggunakan akun yang sudah terdaftar
 *     description: Endpoint untuk autentikasi user dan mendapatkan JWT Token. Token berlaku selama 12 jam.
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
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email user yang sudah terdaftar
 *                 example: "bagus@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password akun (minimal 8 karakter)
 *                 example: "password123SL"
 *     responses:
 *       200:
 *         description: Login Berhasil
 *       400:
 *         description: Parameter email tidak sesuai format / Password kurang dari 8 karakter
 *       401:
 *         description: Email atau password salah
 * /profile:
 *   get:
 *     summary: Mendapatkan informasi profile user
 *     tags:
 *       - Module Membership
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sukses
 *       401:
 *         description: Token tidak tidak valid atau kadaluwarsa (Status 108)
 */

router.post("/registration", authController.registration);
router.get("/health-check", authController.healthCheck);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.getProfile);
module.exports = router;
