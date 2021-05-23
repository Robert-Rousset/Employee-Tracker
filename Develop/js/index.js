// Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: 'password',
    database: 'employee_db',
  });

connection.connect((error)=>{
    if(error) throw error;
    console.log(`connected as id ${connection.threadId}`)
});