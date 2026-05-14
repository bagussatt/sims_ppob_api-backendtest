const { getAllBanners } = require('../models/bannerModel');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/responseFormatter');

const getBanners = asyncHandler(async (req, res, next) => {
    const banners = await getAllBanners();

    return success(res, "Sukses", banners);
});

module.exports = {
    getBanners
};