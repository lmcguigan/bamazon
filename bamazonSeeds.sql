DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id VARCHAR(30) NOT NULL,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT (30) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("A37P89", "Timothy Hay, 48 oz.", "Food", 19.99, 317);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("U23K71", "Timothy Hay, 24 oz.", "Food", 10.99, 280);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("M18J25", "Adult Rabbit Food, 10 lb.", "Food", 9.99, 4);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("G42S12", "Young Rabbit Food, 10 lb.", "Food", 14.99, 23);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("X55H92", "Small Animal Bedding, 10 lb.", "Supplies", 21.99, 24);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("Y14R36", "Litter Box", "Supplies", 12.99, 91);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("E46W19", "Quick-finding Nail Trimmer", "Supplies", 14.99, 9);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("C78B79", "Alfalfa Cube Treats, 15oz.", "Treats", 9.99, 112);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("D54T01", "Snack Log, 8.5 in.", "Treats", 7.99, 38);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES ("W27K18", "Apple Wood Sticks", "Treats", 6.99, 53);