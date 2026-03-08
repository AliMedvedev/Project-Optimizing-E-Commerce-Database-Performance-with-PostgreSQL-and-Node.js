-- =============================================
-- TASK 4: QUERY OPTIMIZATION
-- ShopEase Database Project
-- BCS 4103 Advanced Database Systems
-- =============================================

-- PART 1: STORED PROCEDURE
-- Calculates total sales for a given period
CREATE OR REPLACE PROCEDURE calculate_total_sales(
    start_date TIMESTAMP,
    end_date TIMESTAMP
)
LANGUAGE plpgsql
AS $$
DECLARE
    total NUMERIC;
    order_count INT;
BEGIN
    SELECT 
        COUNT(*),
        COALESCE(SUM(total_amount), 0)
    INTO order_count, total
    FROM orders
    WHERE order_date BETWEEN start_date AND end_date
    AND status = 'completed';

    RAISE NOTICE 'Period: % to %', start_date, end_date;
    RAISE NOTICE 'Total Completed Orders: %', order_count;
    RAISE NOTICE 'Total Sales Amount: KES %', total;
END;
$$;

-- =============================================
-- PART 2: TRIGGER
-- Automatically reduces stock when order placed
-- =============================================

CREATE OR REPLACE FUNCTION update_stock_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE product_id = NEW.product_id;

    IF (SELECT stock_quantity FROM products 
        WHERE product_id = NEW.product_id) < 10 THEN
        RAISE NOTICE 'WARNING: Low stock for product ID %', 
        NEW.product_id;
    END IF;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trigger_update_stock
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_order();

-- =============================================
-- PART 3: INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_orders_customer_id 
ON orders(customer_id);

CREATE INDEX IF NOT EXISTS idx_products_category 
ON products(category);

CREATE INDEX IF NOT EXISTS idx_orders_status 
ON orders(status);

CREATE INDEX IF NOT EXISTS idx_order_items_product_id 
ON order_items(product_id);

-- =============================================
-- PART 4: PERFORMANCE ANALYSIS TESTS
-- =============================================

-- Test 1: Orders by customer
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 100;

-- Test 2: Products by category
EXPLAIN ANALYZE
SELECT * FROM products
WHERE category = 'Electronics';

-- Test 3: Total sales stored procedure
CALL calculate_total_sales(
    '2025-01-01 00:00:00',
    '2025-12-31 23:59:59'
);