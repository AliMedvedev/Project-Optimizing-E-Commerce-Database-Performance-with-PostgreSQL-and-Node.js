const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ShopEase API',
            version: '1.0.0',
            description: 'E-Commerce Database API for ShopEase Kenya',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
    apis: ['./index.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of all products
 */
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM products ORDER BY product_id'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
            'SELECT * FROM products WHERE product_id = $1', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock_quantity:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 */
app.post('/products', async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category } = req.body;
        const result = await pool.query(
            `INSERT INTO products 
            (name, description, price, stock_quantity, category) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [name, description, price, stock_quantity, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock_quantity:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock_quantity, category } = req.body;
        const result = await pool.query(
            `UPDATE products SET 
            name=$1, description=$2, price=$3, 
            stock_quantity=$4, category=$5 
            WHERE product_id=$6 
            RETURNING *`,
            [name, description, price, stock_quantity, category, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM products WHERE product_id = $1 RETURNING *', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully', product: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =============================================
// PAYMENTS ENDPOINTS
// =============================================

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     responses:
 *       200:
 *         description: List of all payments
 */
app.get('/payments', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.payment_id, p.order_id, p.payment_method, 
             p.payment_status, p.amount, p.transaction_code, 
             p.payment_date
             FROM payments p
             ORDER BY p.payment_date DESC
             LIMIT 100`
        );
        res.json(result.rows);
    } catch (err) {
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
 *           type: integer
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
            'SELECT * FROM payments WHERE order_id = $1', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================
// DELIVERIES ENDPOINTS
// =============================================

/**
 * @swagger
 * /deliveries:
 *   get:
 *     summary: Get all deliveries
 *     responses:
 *       200:
 *         description: List of all deliveries
 */
app.get('/deliveries', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM deliveries
             ORDER BY created_at DESC
             LIMIT 100`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /deliveries/{id}:
 *   get:
 *     summary: Get delivery by order ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delivery found
 *       404:
 *         description: Delivery not found
 */
app.get('/deliveries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM deliveries WHERE order_id = $1', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Delivery not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /deliveries/{id}/status:
 *   put:
 *     summary: Update delivery status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               delivery_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Delivery status updated
 */
app.put('/deliveries/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { delivery_status } = req.body;
        const result = await pool.query(
            `UPDATE deliveries SET delivery_status = $1
             WHERE order_id = $2 RETURNING *`,
            [delivery_status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Delivery not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================
// RETURNS ENDPOINTS
// =============================================

/**
 * @swagger
 * /returns:
 *   get:
 *     summary: Get all returns
 *     responses:
 *       200:
 *         description: List of all returns
 */
app.get('/returns', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT r.return_id, r.order_id, 
             c.first_name, c.last_name,
             r.reason, r.return_status, 
             r.refund_amount, r.return_date
             FROM returns r
             JOIN customers c ON r.customer_id = c.customer_id
             ORDER BY r.return_date DESC`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /returns:
 *   post:
 *     summary: Create a new return request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: integer
 *               customer_id:
 *                 type: integer
 *               reason:
 *                 type: string
 *               refund_amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Return request created
 */
app.post('/returns', async (req, res) => {
    try {
        const { order_id, customer_id, reason, refund_amount } = req.body;
        const result = await pool.query(
            `INSERT INTO returns (order_id, customer_id, reason, refund_amount)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [order_id, customer_id, reason, refund_amount]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================
// SUPPLIERS ENDPOINTS
// =============================================

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Get all suppliers
 *     responses:
 *       200:
 *         description: List of all suppliers
 */
app.get('/suppliers', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM suppliers ORDER BY name'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================
// CATEGORIES ENDPOINTS
// =============================================

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of all categories
 */
app.get('/categories', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM categories ORDER BY name'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ShopEase server running on http://localhost:${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});