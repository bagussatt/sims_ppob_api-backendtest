module.exports = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let errorCode = err.errorCode || statusCode;

    res.status(statusCode).json({
        status: errorCode,
        message: err.message || "Internal Server Error",
        data: null
    });
};