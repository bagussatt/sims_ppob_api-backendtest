module.exports = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const errorCode = err.errorCode || statusCode;

    res.status(statusCode).json({
        status: errorCode,
        message: err.message || "Internal Server Error",
        data: null
    });
};