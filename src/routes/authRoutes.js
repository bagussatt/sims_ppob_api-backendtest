const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authController = require('../controllers/authController')
/**
 * @swagger
 * /health-check:
 *   get:
 *     summary: Cek koneksi API
 *     responses:
 *       200:
 *         description: OK
*       500:
 *         description: Koneksi database gagal
 */

router.get('/health-check', (req, res, next) => {
    authController.healthCheck(req, res, next);
});



module.exports = router;