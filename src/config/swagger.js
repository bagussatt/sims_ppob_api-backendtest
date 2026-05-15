const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SIMS PPOB API - Bagus Satrio",
      version: "1.0.1",
      description: "API Documentation sesuai kontrak Nutech Integrasi",
    },
    servers: [
      {
        url: process.env.APP_URL || "http://localhost:3000",
        description: "Dynamic Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
