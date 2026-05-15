const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

// Import Config & Middlewares
const swaggerSpec = require('./config/swagger');
const errorMiddleware = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const ErrorResponse = require('./utils/errorResponse');
const serviceRoutes = require('../src/routes/serviceRoutes');
const transactionRoutes = require('../src/routes/transactionRoutes');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes & Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', authRoutes,bannerRoutes,serviceRoutes,transactionRoutes);
app.get('/', (req, res) => res.redirect('/api-docs'));

app.use((req, res) => res.status(404).json({ status: 404, message: "Not Found", data: null }));
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log(`Dokumentasi Swagger: http://localhost:${PORT}/api-docs`);

module.exports = app;