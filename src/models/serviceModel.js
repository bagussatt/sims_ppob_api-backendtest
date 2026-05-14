const db = require('../config/db');

const serviceModel = {
  
    getAllServices: async () => {
        const query = `
            SELECT 
                service_code, 
                service_name, 
                service_icon, 
                service_tariff 
            FROM services
        `;
        
        const result = await db.query(query);

        return result.rows.map(service => ({
            ...service,
            service_tariff: Number(service.service_tariff)
        }));
    },

   
    getServiceByCode: async (serviceCode) => {
        const query = `
            SELECT 
                service_code, 
                service_name, 
                service_icon, 
                service_tariff 
            FROM services 
            WHERE service_code = $1
        `;
        
        const values = [serviceCode];
        
        const result = await db.query(query, values);
        
        if (result.rows.length === 0) return null;

        const service = result.rows[0];
        return {
            ...service,
            service_tariff: Number(service.service_tariff)
        };
    }
};

module.exports = serviceModel;