const ErrorResponse = require('../utils/errorResponse');


const validateAuthInput = (data, requiredFields = []) => {
    const { email, password } = data;

 
    for (const field of requiredFields) {
        if (!data[field] || data[field].toString().trim() === "") {
            throw new ErrorResponse("Parameter tidak lengkap atau kosong", 400, 102);
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        throw new ErrorResponse("Parameter email tidak sesuai format", 400, 102);
    }

    if (password && password.length < 8) {
        throw new ErrorResponse("Password minimal 8 karakter", 400, 102);
    }

    return true;
};

module.exports = { validateAuthInput };