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

const transactionModel = {
  createPayment: async (email, serviceCode, invoiceNumber) => {
    const client = await db.pool.connect();
    try {
      await client.query("BEGIN");

      const userRes = await client.query(
        "SELECT user_id, balance FROM users WHERE email = $1 FOR UPDATE",
        [email],
      );
      const user = userRes.rows[0];

      const serviceRes = await client.query(
        "SELECT service_name, service_tariff FROM services WHERE service_code = $1",
        [serviceCode],
      );

      if (serviceRes.rows.length === 0) {
        throw {
          customError: true,
          message: "Service atau Layanan tidak ditemukan",
          status: 102,
          code: 400,
        };
      }

      const service = serviceRes.rows[0];
      const tariff = Number(service.service_tariff);

      if (Number(user.balance) < tariff) {
        throw {
          customError: true,
          message: "Saldo tidak mencukupi",
          status: 102,
          code: 400,
        };
      }

      await client.query(
        "UPDATE users SET balance = balance - $1 WHERE email = $2",
        [tariff, email],
      );

      const insertTransQuery = `
                INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING invoice_number, transaction_type, total_amount, created_on
            `;
      const transRes = await client.query(insertTransQuery, [
        user.user_id,
        invoiceNumber,
        "PAYMENT",
        service.service_name,
        tariff,
      ]);

      await client.query("COMMIT");

      return {
        ...transRes.rows[0],
        service_code: serviceCode,
        service_name: service.service_name,
        total_amount: Number(transRes.rows[0].total_amount),
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  getTransactionHistory: async (email, limit) => {
    let query = `
            SELECT 
                t.invoice_number, 
                t.transaction_type, 
                t.description, 
                t.total_amount, 
                t.created_on
            FROM transactions t
            JOIN users u ON t.user_id = u.user_id
            WHERE u.email = $1
            ORDER BY t.created_on DESC
        `;

    const values = [email];

    if (limit && !isNaN(limit)) {
      query += ` LIMIT $2`;
      values.push(parseInt(limit));
    }

    const result = await db.pool.query(query, values);
    return result.rows.map((row) => ({
      ...row,
      total_amount: Number(row.total_amount),
    }));
  },
};
module.exports = {
  balanceModel,
  transactionModel,
};
