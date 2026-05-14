const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { validateAuthInput } = require('../middlewares/validator');
const jwt = require('jsonwebtoken');
const { success } = require('../utils/responseFormatter');

const healthCheck = asyncHandler(async (req, res, next) => {
    const dbStatus = await userModel.checkDatabaseConnection();
    return success(res,"Koneksi database berhasil",dbStatus.server_time)
});

const registration = asyncHandler(async (req, res, next) => {
    const { email, first_name, last_name, password } = req.body;

    validateAuthInput(req.body, ['email', 'first_name', 'last_name', 'password']);
    
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

    return success (res, "Registrasi berhasil silahkan login")
});

const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    validateAuthInput(req.body, ['email', 'password']);

    const user = await userModel.validationEmail(email);
    if (!user) {
        throw new ErrorResponse("Email atau password salah", 401, 103);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ErrorResponse("Email atau password salah", 401, 103);
    }

    const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    );

    return success(res, "Login Berhasil", { token });
});

module.exports = {
    healthCheck,
    registration,
    login
};