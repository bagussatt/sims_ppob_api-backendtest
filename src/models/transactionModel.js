const db = require("../config/db");

const balanceModel = {
  getUserBalance: async (email) => {
    const query = "SELECT balance FROM users WHERE email = $1";
    const values = [email];

    const result = await db.query(query, values);

    if (result.rows.length === 0) return null;

    return Number(result.rows[0].balance);
  },
  topUp: async (email, amount, invoiceNumber) => {
    const client = await db.pool.connect();
    try {
      await client.query("BEGIN");

      const userQuery = "SELECT user_id FROM users WHERE email = $1";
      const userRes = await client.query(userQuery, [email]);
      const userId = userRes.rows[0].user_id;

      const updateBalanceQuery = `
                UPDATE users 
                SET balance = balance + $1 
                WHERE email = $2 
                RETURNING balance
            `;
      const balanceRes = await client.query(updateBalanceQuery, [
        amount,
        email,
      ]);

      const insertTransQuery = `
                INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount)
                VALUES ($1, $2, $3, $4, $5)
            `;
      await client.query(insertTransQuery, [
        userId,
        invoiceNumber,
        "TOPUP",
        "Top Up balance",
        amount,
      ]);

      await client.query("COMMIT");
      return Number(balanceRes.rows[0].balance);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

module.exports = balanceModel;
