const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

const healthCheck = asyncHandler(async (req, res, next) => {
    const dbStatus = await userModel.checkDatabaseConnection();
    return res.status(200).json({
        status: 0,
        message: "Koneksi database berhasil",
        data: {
            db_server_time: dbStatus.server_time
        }
    });
});

const registration = asyncHandler(async (req, res, next) => {
    const { email, first_name, last_name, password } = req.body;

    if (!email || !password || !first_name || !last_name) {
        throw new ErrorResponse('Ada data yang tidak Lengkap', 400, 102);
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ErrorResponse("Parameter email tidak sesuai format", 400, 102);
    }
    
    if (password.length < 8) {
        throw new ErrorResponse("Password minimal 8 karakter", 400, 102);
    }
    
    const existingUser = await userModel.validationEmail(email);
    if (existingUser) {
        throw new ErrorResponse("Email sudah terdaftar", 400, 102);
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await userModel.createUser({
        email,
        first_name,
        last_name,
        password: hashedPassword
    });

    res.status(200).json({
        status: 0,
        message: "Berhasil registrasi silakan login",
        data: null
    });
});

module.exports = {
    healthCheck,
    registration
};