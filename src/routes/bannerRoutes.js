const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController')
/**
 * @swagger
 * /banner:
 *   get:
 *     summary: Mendapatkan list banner
 *     tags:
 *       - Module Information
 *     responses:
 *       200:
 *         description: Sukses
 */
router.get('/banner', bannerController.getBanners);

module.exports = router;