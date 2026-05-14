const success = (res, message, data = null) => {
    return res.status(200).json({
        status: 0,
        message: message,
        data: data
    });
};
module.exports = {
    success,
};