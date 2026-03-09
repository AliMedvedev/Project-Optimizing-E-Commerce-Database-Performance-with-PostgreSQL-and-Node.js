-- =============================================
-- NEW ADDITIONAL TABLES FOR SHOPEASE
-- BCS 4103 Advanced Database Systems
-- =============================================

-- 1. Categories Table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Suppliers Table
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    county VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Payments Table
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    payment_method VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    amount DECIMAL(10,2) NOT NULL,
    transaction_code VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Deliveries Table
CREATE TABLE deliveries (
    delivery_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    delivery_status VARCHAR(30) DEFAULT 'pending',
    courier_name VARCHAR(100),
    tracking_number VARCHAR(50),
    delivery_address TEXT,
    estimated_date DATE,
    delivered_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Returns Table
CREATE TABLE returns (
    return_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    customer_id INTEGER REFERENCES customers(customer_id),
    reason TEXT NOT NULL,
    return_status VARCHAR(20) DEFAULT 'pending',
    refund_amount DECIMAL(10,2),
    return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- POPULATE NEW TABLES
-- =============================================

-- Categories
INSERT INTO categories (name, description) VALUES
('Food & Groceries', 'Daily food items, flour, rice, cooking oil and household groceries'),
('Electronics', 'Phones, chargers, earphones, powerbanks and electronic accessories'),
('Clothing', 'Traditional and modern wear including kanzu, kitenge, jeans and t-shirts'),
('Home & Kitchen', 'Cooking pots, jikos, flasks, basins and household items'),
('Personal Care', 'Soaps, lotions, toothpaste, detergents and hygiene products'),
('Baby Products', 'Diapers, baby food, baby powder and infant care products'),
('Stationery', 'Exercise books, pens, geometry sets and office supplies');

-- Suppliers
INSERT INTO suppliers (name, contact_person, phone, email, address, county)
VALUES
('Unga Group Limited', 'James Kamau', '0722345678', 'supply@ungagroup.com', 'Ruaraka, Nairobi', 'Nairobi'),
('Bidco Africa', 'Mary Wanjiku', '0733456789', 'orders@bidcoafrica.com', 'Thika Road, Ruiru', 'Kiambu'),
('Safaricom Devices', 'Ali Hassan', '0711234567', 'devices@safaricom.co.ke', 'Waiyaki Way, Westlands', 'Nairobi'),
('Pwani Oil Products', 'Fatuma Omar', '0722567890', 'supply@pwanioil.com', 'Mombasa Road, Changamwe', 'Mombasa'),
('Ketepa Limited', 'John Odhiambo', '0733678901', 'orders@ketepa.com', 'Kericho Town', 'Kericho'),
('Mumias Sugar Company', 'Grace Nafula', '0722789012', 'supply@mumias.com', 'Mumias Town', 'Kakamega'),
('Tecno Mobile Kenya', 'David Otieno', '0711890123', 'kenya@tecno.com', 'Moi Avenue, Nairobi', 'Nairobi'),
('Brookside Dairy', 'Sarah Wangari', '0722901234', 'supply@brookside.co.ke', 'Ruiru, Kiambu', 'Kiambu'),
('Procter & Gamble Kenya', 'Michael Mutua', '0733012345', 'kenya@pg.com', 'Industrial Area, Nairobi', 'Nairobi'),
('Colgate Palmolive Kenya', 'Agnes Achieng', '0722123456', 'kenya@colgate.com', 'Upper Hill, Nairobi', 'Nairobi'),
('Orbit Supplies', 'Hassan Wario', '0711345678', 'orders@orbitsupplies.co.ke', 'Eastleigh, Nairobi', 'Nairobi'),
('Coast Suppliers Ltd', 'Kadzo Karisa', '0733456780', 'supply@coastsuppliers.co.ke', 'Nyali, Mombasa', 'Mombasa'),
('Rift Valley Distributors', 'Parsimei Sankale', '0722567891', 'orders@riftdist.co.ke', 'Nakuru Town', 'Nakuru'),
('Lake Region Traders', 'Achieng Omondi', '0711678902', 'supply@lakeregion.co.ke', 'Kisumu CBD', 'Kisumu'),
('Mount Kenya Suppliers', 'Mugambi Murithi', '0733789013', 'orders@mtkenyasupply.co.ke', 'Meru Town', 'Meru');

-- Payments
INSERT INTO payments (order_id, payment_method, payment_status, amount, transaction_code)
SELECT
    o.order_id,
    (ARRAY['M-Pesa','M-Pesa','M-Pesa','Credit Card','Debit Card','Cash on Delivery'])
    [FLOOR(RANDOM() * 6 + 1)::INT],
    (ARRAY['completed','completed','completed','pending','failed'])
    [FLOOR(RANDOM() * 5 + 1)::INT],
    o.total_amount,
    CASE WHEN RANDOM() > 0.3 
        THEN 'QHG' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 7))
        ELSE NULL END
FROM orders o
WHERE o.order_id BETWEEN 5001 AND 10000;

-- Deliveries
INSERT INTO deliveries (order_id, delivery_status, courier_name, tracking_number, delivery_address, estimated_date, delivered_date)
SELECT
    o.order_id,
    (ARRAY['pending','in transit','delivered','delivered','delivered','cancelled'])
    [FLOOR(RANDOM() * 6 + 1)::INT],
    (ARRAY['G4S Kenya','Wells Fargo Kenya','Sendy','Fargo Courier','DHL Kenya','Posta Kenya','Uber Connect','Glovo Kenya'])
    [FLOOR(RANDOM() * 8 + 1)::INT],
    'TRK' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)),
    (ARRAY['Nairobi CBD','Westlands','Kilimani','Eastleigh','Kasarani','Mombasa Road','Thika Road','Karen','Lavington','Ngong Road','Kisumu Town','Nakuru CBD','Eldoret Town','Mombasa CBD','Nyeri Town'])
    [FLOOR(RANDOM() * 15 + 1)::INT] || ', Kenya',
    CURRENT_DATE + (FLOOR(RANDOM() * 7 + 1) || ' days')::INTERVAL,
    CASE WHEN RANDOM() > 0.4 
        THEN CURRENT_TIMESTAMP - (FLOOR(RANDOM() * 30) || ' days')::INTERVAL
        ELSE NULL END
FROM orders o
WHERE o.order_id BETWEEN 5001 AND 10000;

-- Returns
INSERT INTO returns (order_id, customer_id, reason, return_status, refund_amount)
SELECT
    o.order_id,
    o.customer_id,
    (ARRAY[
        'Product was damaged on delivery',
        'Wrong product delivered',
        'Product does not match description',
        'Product expired',
        'Changed my mind',
        'Found cheaper price elsewhere',
        'Product stopped working after 2 days',
        'Size did not fit',
        'Duplicate order placed by mistake',
        'Product quality was very poor'
    ])[FLOOR(RANDOM() * 10 + 1)::INT],
    (ARRAY['pending','approved','rejected','refunded'])
    [FLOOR(RANDOM() * 4 + 1)::INT],
    ROUND((RANDOM() * o.total_amount)::NUMERIC, 2)
FROM orders o
WHERE o.order_id BETWEEN 5001 AND 5200;