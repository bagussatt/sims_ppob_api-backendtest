const userModel = require('../models/userModel');

const healthCheck = async (req, res, next) => {
    try {
        const dbStatus = await userModel.checkDatabaseConnection();
        return res.status(200).json({
            status: 0,
            message: "Koneksi database berhasil",
            data: {
                db_server_time: dbStatus.server_time
            }
        });
    } catch (error) {  
        error.statusCode = 500;
        error.errorCode = 500;
        next(error); 
    }
};

module.exports = {
    healthCheck
};