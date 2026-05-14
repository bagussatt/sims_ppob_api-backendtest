const db = require('../config/db');

const getAllBanners = async () => {
    const query = 'SELECT banner_name, banner_image, description FROM banners';
    
    const result = await db.query(query);
    return result.rows;
};

module.exports = {
    getAllBanners
};