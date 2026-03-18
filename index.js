const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ShopEase API',
            version: '1.0.0',
            description: 'E-Commerce API - Real Olist Dataset 451,464 Records',
        },
        servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    },
    apis: ['./index.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: API is running
 */
app.get('/', (req, res) => {
    res.json({ message: 'ShopEase API is running - Real Olist Dataset 451,464 Records' });
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products (Real Olist Data)
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of products to return (default 50, max 200)
 *     responses:
 *       200:
 *         description: List of products
 */
app.get('/products', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10) || 50;
        if (limit < 1) limit = 1;
        if (limit > 200) limit = 200;
        const result = await pool.query(
            'SELECT * FROM olist_products ORDER BY product_id LIMIT $1',
            [limit]
        );
        res.json({ count: result.rows.length, limit, data: result.rows });
    } catch (err) {
        console.error('GET /products error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID from the olist_products table
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM olist_products WHERE product_id = $1', [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('GET /products/:id error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers (Real Olist Data)
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of customers to return (default 50, max 200)
 *     responses:
 *       200:
 *         description: List of customers
 */
app.get('/customers', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10) || 50;
        if (limit < 1) limit = 1;
        if (limit > 200) limit = 200;
        const result = await pool.query(
            'SELECT * FROM olist_customers LIMIT $1', [limit]
        );
        res.json({ count: result.rows.length, limit, data: result.rows });
    } catch (err) {
        console.error('GET /customers error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer found
 *       404:
 *         description: Customer not found
 */
app.get('/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM olist_customers WHERE customer_id = $1', [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('GET /customers/:id error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (Real Olist Data)
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of orders to return (default 50, max 200)
 *     responses:
 *       200:
 *         description: List of orders
 */
app.get('/orders', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10) || 50;
        if (limit < 1) limit = 1;
        if (limit > 200) limit = 200;
        const result = await pool.query(
            'SELECT * FROM olist_orders LIMIT $1', [limit]
        );
        res.json({ count: result.rows.length, limit, data: result.rows });
    } catch (err) {
        console.error('GET /orders error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */
app.get('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM olist_orders WHERE order_id = $1', [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('GET /orders/:id error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments (Real Olist Data)
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of payments to return (default 50, max 200)
 *     responses:
 *       200:
 *         description: List of payments
 */
app.get('/payments', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10) || 50;
        if (limit < 1) limit = 1;
        if (limit > 200) limit = 200;
        const result = await pool.query(
            'SELECT * FROM olist_payments LIMIT $1', [limit]
        );
        res.json({ count: result.rows.length, limit, data: result.rows });
    } catch (err) {
        console.error('GET /payments error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get payment by order ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment found
 *       404:
 *         description: Payment not found
 */
app.get('/payments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM olist_payments WHERE order_id = $1', [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Payment not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('GET /payments/:id error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /sellers:
 *   get:
 *     summary: Get all sellers (Real Olist Data)
 *     responses:
 *       200:
 *         description: List of sellers
 */
app.get('/sellers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM olist_sellers LIMIT 100');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /sellers error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /order-items/{id}:
 *   get:
 *     summary: Get order items by order ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order items found
 *       404:
 *         description: Not found
 */
app.get('/order-items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM olist_order_items WHERE order_id = $1', [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Order items not found' });
        res.json(result.rows);
    } catch (err) {
        console.error('GET /order-items/:id error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`ShopEase server running on http://localhost:${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    try {
        await pool.query('SELECT 1');
        console.log('Connected to ShopEase PostgreSQL database!');
    } catch (err) {
        console.error('Database connection error:', err.message);
    }
});