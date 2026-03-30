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
        paths: {
            '/': {
                get: {
                    summary: 'Health check',
                    responses: {
                        200: {
                            description: 'API is running'
                        }
                    }
                }
            },
            '/products': {
                get: {
                    summary: 'Get all products',
                    parameters: [
                        {
                            in: 'query',
                            name: 'limit',
                            required: false,
                            schema: { type: 'integer' },
                            description: 'Number of products to return (default 50, max 200)'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'List of products'
                        }
                    }
                },
                post: {
                    summary: 'Add a new product',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['product_id'],
                                    properties: {
                                        product_id: { type: 'string' },
                                        product_category_name: { type: 'string' },
                                        product_name_lenght: { type: 'integer' },
                                        product_description_lenght: { type: 'integer' },
                                        product_photos_qty: { type: 'integer' },
                                        product_weight_g: { type: 'integer' },
                                        product_length_cm: { type: 'integer' },
                                        product_height_cm: { type: 'integer' },
                                        product_width_cm: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Product created successfully'
                        },
                        500: {
                            description: 'Server error'
                        }
                    }
                }
            },
            '/products/{id}': {
                get: {
                    summary: 'Get product by ID',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' },
                            description: 'Product ID'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Product found'
                        },
                        404: {
                            description: 'Product not found'
                        }
                    }
                },
                put: {
                    summary: 'Update an existing product',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' },
                            description: 'Product ID'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        product_category_name: { type: 'string' },
                                        product_name_lenght: { type: 'integer' },
                                        product_description_lenght: { type: 'integer' },
                                        product_photos_qty: { type: 'integer' },
                                        product_weight_g: { type: 'integer' },
                                        product_length_cm: { type: 'integer' },
                                        product_height_cm: { type: 'integer' },
                                        product_width_cm: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Product updated successfully'
                        },
                        404: {
                            description: 'Product not found'
                        },
                        500: {
                            description: 'Server error'
                        }
                    }
                },
                delete: {
                    summary: 'Delete a product',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' },
                            description: 'Product ID'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Product deleted successfully'
                        },
                        404: {
                            description: 'Product not found'
                        },
                        500: {
                            description: 'Server error'
                        }
                    }
                }
            },
            '/customers': {
                get: {
                    summary: 'Get all customers',
                    parameters: [
                        {
                            in: 'query',
                            name: 'limit',
                            required: false,
                            schema: { type: 'integer' },
                            description: 'Number of customers to return (default 50, max 200)'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'List of customers'
                        }
                    }
                }
            },
            '/customers/{id}': {
                get: {
                    summary: 'Get customer by ID',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Customer found'
                        },
                        404: {
                            description: 'Customer not found'
                        }
                    }
                }
            },
            '/orders': {
                get: {
                    summary: 'Get all orders',
                    parameters: [
                        {
                            in: 'query',
                            name: 'limit',
                            required: false,
                            schema: { type: 'integer' },
                            description: 'Number of orders to return (default 50, max 200)'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'List of orders'
                        }
                    }
                }
            },
            '/orders/{id}': {
                get: {
                    summary: 'Get order by ID',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Order found'
                        },
                        404: {
                            description: 'Order not found'
                        }
                    }
                }
            },
            '/payments': {
                get: {
                    summary: 'Get all payments',
                    parameters: [
                        {
                            in: 'query',
                            name: 'limit',
                            required: false,
                            schema: { type: 'integer' },
                            description: 'Number of payments to return (default 50, max 200)'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'List of payments'
                        }
                    }
                }
            },
            '/payments/{id}': {
                get: {
                    summary: 'Get payment by order ID',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Payment found'
                        },
                        404: {
                            description: 'Payment not found'
                        }
                    }
                }
            },
            '/sellers': {
                get: {
                    summary: 'Get all sellers',
                    responses: {
                        200: {
                            description: 'List of sellers'
                        }
                    }
                }
            },
            '/order-items/{id}': {
                get: {
                    summary: 'Get order items by order ID',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Order items found'
                        },
                        404: {
                            description: 'Not found'
                        }
                    }
                }
            }
        }
    },
    apis: []
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
    res.json({ message: 'ShopEase API is running - Real Olist Dataset 451,464 Records' });
});

app.get('/products', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10) || 50;
        if (limit < 1) limit = 1;
        if (limit > 200) limit = 200;

        const result = await pool.query(
            'SELECT * FROM products ORDER BY product_id LIMIT $1',
            [limit]
        );

        res.json({ count: result.rows.length, limit, data: result.rows });
    } catch (err) {
        console.error('GET /products error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM products WHERE product_id = $1',
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

app.post('/products', async (req, res) => {
    try {
        const {
            product_id,
            product_category_name,
            product_name_lenght,
            product_description_lenght,
            product_photos_qty,
            product_weight_g,
            product_length_cm,
            product_height_cm,
            product_width_cm
        } = req.body;

        const result = await pool.query(
            `INSERT INTO products (
                product_id,
                product_category_name,
                product_name_lenght,
                product_description_lenght,
                product_photos_qty,
                product_weight_g,
                product_length_cm,
                product_height_cm,
                product_width_cm
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *`,
            [
                product_id,
                product_category_name,
                product_name_lenght,
                product_description_lenght,
                product_photos_qty,
                product_weight_g,
                product_length_cm,
                product_height_cm,
                product_width_cm
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /products error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            product_category_name,
            product_name_lenght,
            product_description_lenght,
            product_photos_qty,
            product_weight_g,
            product_length_cm,
            product_height_cm,
            product_width_cm
        } = req.body;

        const result = await pool.query(
            `UPDATE products
             SET product_category_name = $1,
                 product_name_lenght = $2,
                 product_description_lenght = $3,
                 product_photos_qty = $4,
                 product_weight_g = $5,
                 product_length_cm = $6,
                 product_height_cm = $7,
                 product_width_cm = $8
             WHERE product_id = $9
             RETURNING *`,
            [
                product_category_name,
                product_name_lenght,
                product_description_lenght,
                product_photos_qty,
                product_weight_g,
                product_length_cm,
                product_height_cm,
                product_width_cm,
                id
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

        res.json({ message: 'Product deleted successfully', deletedProduct: result.rows[0] });
    } catch (err) {
        console.error('DELETE /products/:id error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/customers', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10) || 50;
        if (limit < 1) limit = 1;
        if (limit > 200) limit = 200;

        const result = await pool.query(
            'SELECT * FROM customers LIMIT $1',
            [limit]
        );

        res.json({ count: result.rows.length, limit, data: result.rows });
    } catch (err) {
        console.error('GET /customers error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM customers WHERE customer_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('GET /customers/:id error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/orders', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10) || 50;
        if (limit < 1) limit = 1;
        if (limit > 200) limit = 200;

        const result = await pool.query(
            'SELECT * FROM orders LIMIT $1',
            [limit]
        );

        res.json({ count: result.rows.length, limit, data: result.rows });
    } catch (err) {
        console.error('GET /orders error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM orders WHERE order_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('GET /orders/:id error:', err.message);
        res.status(500).json({ error: err.message });
    }
});


app.get('/payments', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10) || 50;
        if (limit < 1) limit = 1;
        if (limit > 200) limit = 200;

        const result = await pool.query(
            'SELECT * FROM payments LIMIT $1',
            [limit]
        );

        res.json({ count: result.rows.length, limit, data: result.rows });
    } catch (err) {
        console.error('GET /payments error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/payments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM payments WHERE order_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('GET /payments/:id error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/sellers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sellers LIMIT 100');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /sellers error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/order-items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM order_items WHERE order_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order items not found' });
        }

        res.json(result.rows);
    } catch (err) {
        console.error('GET /order-items/:id error:', err.message);
        res.status(500).json({ error: err.message });
    }
});


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
