const db = require('../config/db');

const checkDatabaseConnection = async () => {
    const query = 'SELECT NOW() as server_time';
    const result = await db.query(query);
    return result.rows[0];
};

module.exports = {
    checkDatabaseConnection
};