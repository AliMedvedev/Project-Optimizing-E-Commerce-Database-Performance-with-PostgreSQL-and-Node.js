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
    res.json({ message: 'ShopEase API is running' });
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get products with optional limit
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
            `SELECT 
                product_id,
                product_category_name,
                product_name_length,
                product_description_length,
                product_photos_qty,
                product_weight_g,
                product_length_cm,
                product_height_cm,
                product_width_cm
             FROM products
             ORDER BY product_id
             LIMIT $1`,
            [limit]
        );

        res.json({
            count: result.rows.length,
            limit,
            data: result.rows,
        });
    } catch (err) {
        console.error('GET /products error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by product_id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID from the products table
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
            `SELECT 
                product_id,
                product_category_name,
                product_name_length,
                product_description_length,
                product_photos_qty,
                product_weight_g,
                product_length_cm,
                product_height_cm,
                product_width_cm
             FROM products
             WHERE product_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('GET /products/:id error:', err.message);
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
 *             required:
 *               - product_id
 *             properties:
 *               product_id:
 *                 type: string
 *               product_category_name:
 *                 type: string
 *               product_name_length:
 *                 type: integer
 *               product_description_length:
 *                 type: integer
 *               product_photos_qty:
 *                 type: integer
 *               product_weight_g:
 *                 type: integer
 *               product_length_cm:
 *                 type: integer
 *               product_height_cm:
 *                 type: integer
 *               product_width_cm:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: product_id is required
 */
app.post('/products', async (req, res) => {
    try {
        const {
            product_id,
            product_category_name,
            product_name_length,
            product_description_length,
            product_photos_qty,
            product_weight_g,
            product_length_cm,
            product_height_cm,
            product_width_cm,
        } = req.body;

        if (!product_id) {
            return res.status(400).json({ error: 'product_id is required' });
        }

        const result = await pool.query(
            `INSERT INTO products (
                product_id,
                product_category_name,
                product_name_length,
                product_description_length,
                product_photos_qty,
                product_weight_g,
                product_length_cm,
                product_height_cm,
                product_width_cm
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                product_id,
                product_category_name || null,
                product_name_length ?? null,
                product_description_length ?? null,
                product_photos_qty ?? null,
                product_weight_g ?? null,
                product_length_cm ?? null,
                product_height_cm ?? null,
                product_width_cm ?? null,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /products error:', err.message);
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
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_category_name:
 *                 type: string
 *               product_name_length:
 *                 type: integer
 *               product_description_length:
 *                 type: integer
 *               product_photos_qty:
 *                 type: integer
 *               product_weight_g:
 *                 type: integer
 *               product_length_cm:
 *                 type: integer
 *               product_height_cm:
 *                 type: integer
 *               product_width_cm:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            product_category_name,
            product_name_length,
            product_description_length,
            product_photos_qty,
            product_weight_g,
            product_length_cm,
            product_height_cm,
            product_width_cm,
        } = req.body;

        const result = await pool.query(
            `UPDATE products
             SET
                product_category_name = $1,
                product_name_length = $2,
                product_description_length = $3,
                product_photos_qty = $4,
                product_weight_g = $5,
                product_length_cm = $6,
                product_height_cm = $7,
                product_width_cm = $8
             WHERE product_id = $9
             RETURNING *`,
            [
                product_category_name || null,
                product_name_length ?? null,
                product_description_length ?? null,
                product_photos_qty ?? null,
                product_weight_g ?? null,
                product_length_cm ?? null,
                product_height_cm ?? null,
                product_width_cm ?? null,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT /products/:id error:', err.message);
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
 *           type: string
 *         description: Product ID
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
            'DELETE FROM products WHERE product_id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({
            message: 'Product deleted successfully',
            product: result.rows[0],
        });
    } catch (err) {
        console.error('DELETE /products/:id error:', err.message);
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
