const db = require('../config/db');

const checkDatabaseConnection = async () => {
    const query = 'SELECT NOW() as server_time';
    const result = await db.query(query);
    return result.rows[0];
};

const validationEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result.rows[0];
};

const createUser = async(userData) => {
    const {email, first_name, last_name, password} = userData;
    const query = `
    INSERT INTO users (email, first_name, last_name, password, balance )
    VALUES ($1, $2, $3,$4,$5) 
    RETURNING user_id, email, first_name, last_name
    `;
    const values = [email, first_name, last_name, password, 0];
    const result = await db.query(query, values);
    return result.rows[0];
}
const updateProfile = async (email, first_name, last_name) => {
    const query = `
        UPDATE users 
        SET first_name = $1, last_name = $2 
        WHERE email = $3 
        RETURNING email, first_name, last_name, profile_image
    `;
    const values = [first_name, last_name, email];
    
    const result = await db.query(query, values);
    return result.rows[0];
};
const updateProfileImage = async (email, imageUrl) => {
    const query = 'UPDATE users SET profile_image = $1 WHERE email = $2 RETURNING *';
    const values = [imageUrl, email];
    
    const result = await db.query(query, values);
    return result.rows[0];
};


module.exports = {
    checkDatabaseConnection,
    validationEmail,
    createUser,
    updateProfile,
    updateProfileImage
};