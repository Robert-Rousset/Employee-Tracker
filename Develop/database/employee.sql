DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
    id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE employee_role(
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(45),
    salary DECIMAL(10,2),
    department_id INTEGER REFERENCES department(id),
    PRIMARY KEY(id)
);


CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name DECIMAL(30) NULL,
  role_id INTEGER REFERENCES employee_role(id),
  PRIMARY KEY(id)
);

