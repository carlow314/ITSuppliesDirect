DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;
USE bamazon;
  CREATE TABLE products (
    item_id int(11) NOT NULL AUTO_INCREMENT,
    product_name varchar(50) NOT NULL,
    department_name varchar(50) NOT NULL,
    price decimal(15,2) NOT NULL,
    stock_qty int(11) NOT NULL,
    product_sales decimal(6,2) NOT NULL DEFAULT '0.00',
    PRIMARY KEY (`item_id`);

  CREATE TABLE departments (
    department_id int(2) NOT NULL AUTO_INCREMENT,
    department_name char(50) NOT NULL,
    overhead_costs int(11) DEFAULT NULL,
    KEY `department_id` (`department_id`)
