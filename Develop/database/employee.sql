DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
    id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE employee_role(
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(45),
    salary DECIMAL(10,2),
    department_id INTEGER,
    PRIMARY KEY(id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  manager_name VARCHAR(30) NULL,
  role_id INTEGER,
  PRIMARY KEY(id)
);

INSERT INTO employee(first_name,last_name,manager_name,role_id) 
VALUES ("Robert", "Rousset","Jack", 1),
("Bill", "Bousset","Jack", 2),
("Jill", "Jousset","Jill", 3),
("Gill", "Gousset",Null, 4),
("Milly", "Mousset","Jill", 5),
("Phill", "Pousset","Jack", 6),
("Lill", "Lousset",Null, 7);


INSERT INTO employee_role(title,salary,department_id)
VALUES 
("Sales Person", 20050, 1),
("Software Engineer", 30000.99, 2),
("Lead Engineer", 59000, 3),
("Lawyer", 89000, 4),
("Accountant", 54000, 5),
("Accountant", 40000.25, 6),
("Sales Person", 15000, 7);

INSERT INTO department(department_name)
VALUES 
("Sales"),
("Engineering"),
("Engineering"),
("Legal"),
("Finance"),
("Finance"),
("Sales");

