const db = require('../config/db');

const balanceModel = {
 
    getUserBalance: async (email) => {
        const query = 'SELECT balance FROM users WHERE email = $1';
        const values = [email];
        
        const result = await db.query(query, values);
        
        if (result.rows.length === 0) return null;

        return Number(result.rows[0].balance);
    }
};

module.exports = balanceModel;