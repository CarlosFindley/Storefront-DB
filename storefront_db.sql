-- if db exists, drop it --
DROP DATABASE IF EXISTS storefront_db;

-- creates db --
CREATE DATABASE storefront_db;

-- for the code below to use the db --
USE storefront_db;


CREATE TABLE products (
	-- create columns capable of holding all of the data contained within the db --
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50)  NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price_per_item DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (item_id)
);

-- Creates new rows containing data in all named columns --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chillies", "Produce", 1.00, 50000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cacahuatl", "Produce", 10.00, 20000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Elotl", "Produce", .50, 100000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Octli", "Beverage", 5.00, 15000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Obsidian", "Weapon", 7.25, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Jade", "Jewelry",  100.00, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Feathers", "Jewelry", 1.00, 5000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Canoe", "Navigation", 300.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Book", "Literature", 2.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ceramic", "Houseware", 3.50, 400);

SELECT * from products