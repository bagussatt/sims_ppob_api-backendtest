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
const getProfile = asyncHandler(async (req, res, next) => {

    const email = req.user.email;
    const user = await userModel.validationEmail(email);

    if (!user) {
        throw new ErrorResponse("User tidak ditemukan", 404, 101);
    }

    return success(res, "Sukses", {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image || null
    });
});
const updateProfile = asyncHandler(async (req, res, next) => {
    const { first_name, last_name } = req.body;
    const email = req.user.email; 

    if (!first_name || !last_name) {
        throw new ErrorResponse("Parameter first_name dan last_name wajib diisi", 400, 102);
    }

    const updatedUser = await userModel.updateProfile(email, first_name, last_name);

    if (!updatedUser) {
        throw new ErrorResponse("User tidak ditemukan", 404, 101);
    }

    return success(res, "Update Pofile berhasil", {
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        profile_image: updatedUser.profile_image || null
    });
});
const updateImage = asyncHandler(async (req, res, next) => {
    const email = req.user.email; // Dari payload JWT

    if (!req.file) {
        throw new ErrorResponse("Image tidak boleh kosong", 400, 102);
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const updatedUser = await userModel.updateProfileImage(email, imageUrl);

    return success(res, "Update Profile Image berhasil", {
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        profile_image: updatedUser.profile_image
    });
});

module.exports = {
    healthCheck,
    registration,
    login,
    getProfile,
    updateProfile,
    updateImage
};