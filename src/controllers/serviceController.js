const serviceModel = require('../models/serviceModel');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/responseFormatter');

const getServices = asyncHandler(async (req, res, next) => {
    const services = await serviceModel.getAllServices();

    return success(res, "Sukses", services);
});

module.exports = {
    getServices
}