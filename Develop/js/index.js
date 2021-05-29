// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "employee_db",
});

let allManagerNames = [];

// ----------------------ALL PROMPT QUESTIONS----------------------\\
let firstQuestions = [
  {
    type: "list",
    name: "firstList",
    message: "What would you Like to do?",
    choices: [
      "View All Employees",
      "View All Employees By Department",
      "View All Employees By Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee's Manager",
    ],
  },
];

let addEmployeeQ1 = [
  {
    type: "input",
    name: "first_name",
    message: "What is the employee's first name?",
  },
  {
    type: "input",
    name: "last_name",
    message: "What is the employee's last name?",
  },
];

let addEmployeeQ2 = [
  {
    type: `list`,
    name: `department`,
    message: `Which department does the Employee work in?`,
    choices: [`Sales`, `Engineering`, `Finance`, `Legal`],
  },
];

let addEmployeeQ3 = [
  {
    type: "list",
    name: "title",
    message: "What is the employee's role?",
    choices: [
      "Sales Person",
      "Sales Lead",
      "Software Engineer",
      "Lead Engineer",
      "Lawyer",
      "Accountant",
    ],
  },
  {
    type: `input`,
    name: `salary`,
    message: `What salary is the Employee on?`,
  },
  {
    type: "input",
    name: "manager",
    message: "Who is the employee's Manager?",
    choices: `${allManagerNames}`,
  },
];

//------------------------------------------------------------------\\

// Function that starts prompts, then dictates which option the user selects \\
function init() {
  inquirer.prompt(firstQuestions).then((response) => {
    switch (response.firstList) {
      case "View All Employees":
        DisplayAllEmployees();
        break;
      case "View All Employees By Department":
        DisplayAllEmployeesByDepartment();
        break;
      case "View All Employees By Manager":
        DisplayAllEmployeesByManager();
        break;
      case "Add Employee":
        AddEmployeeNames();
        break;
      case "Remove Employee":
        RemoveEmployee();
        break;
      case "Update Employee Role":
        UpdateRole();
        break;
      case "Update Employee's Manager":
        UpdateManager();
        break;
    }
  });
}

//----------- All Prompt Functions for each option -----------\\

function DisplayAllEmployees() {
  connection.query(
    `SELECT * FROM employee 
    JOIN employee_role ON role_id = employee_role.id
    JOIN department ON department_id = department.id`,
    (error, response) => {
      if (error) throw error;
      console.table("\n", response);
    }
  );
  init();
}

// function DisplayAllEmployeesByDepartment(){
//     inquirer.prompt(displayByRole).then((response)=>{
//         console.log(response)
//         init()
//     })
// };

// function DisplayAllEmployeesByManager(){
//     inquirer.prompt(displayByManager).then((response)=>{
//         console.log(response)
//         init()
//     })
// };

let employeeId; 

function AddEmployeeNames() {
  inquirer.prompt(addEmployeeQ1).then((response) => {
    connection.query(
      `INSERT INTO employee SET ?`,
      {
        first_name: response.first_name,
        last_name: response.last_name,
      },
      (error, response) => {
        if (error) throw error;
      }
    );
    AddEmployeeDepartment();
  });
}

function AddEmployeeDepartment() {
  inquirer.prompt(addEmployeeQ2).then((response) => {
    connection.query(
      `INSERT INTO department SET ?`,
      {
        department_name: response.department,
      },
      (error, response) => {
        if (error) throw error;
      }
    );
    AddEmployeeRoles();
  });
}

function AddEmployeeRoles() {
  inquirer.prompt(addEmployeeQ3).then((response) => {
    connection.query(
      `INSERT INTO employee_role SET ?`,
      {
        title: response.title,
        salary: response.salary,
      },
      (error, response) => {
        if (error) throw error;
      }
    );
    UpdateEmployeeIds();
  });
}

function UpdateEmployeeIds() {
  connection.query(
    `SELECT id FROM department ORDER BY id DESC`,
    (error, deptId) => {
      let deptIdNumber = deptId[0].id;
      connection.query(`UPDATE employee_role SET ? WHERE ${deptIdNumber} = id`, {
        department_id: deptIdNumber,
      });
    }
  );

  connection.query(
    `SELECT id FROM employee_role ORDER BY id DESC`,
    (error, roleId) => {
      let roleIdNumber = roleId[0].id;
      connection.query(`UPDATE employee SET ? WHERE ${roleIdNumber} = id`, {
        role_id: roleIdNumber,
      });
    }
  );
  init()
}

// let employeeNames = []

// let selectEmployee = [
//     {
//         type: 'list',
//         name: 'selection',
//         message: 'Which employee?',
//         choices: employeeNames
//     }
// ]

// function RemoveEmployee(){

//     connection.query(`SELECT first_name, last_name FROM employee`, (error, response)=> {
//         if(error) throw error;
//         response.forEach(element=>{
//             employeeNames.push(element.first_name +" "+ element.last_name)
//         })
//     })

//     inquirer.prompt(selectEmployee).then((response)=>{
//         let eachName = response.selection.split(" ")
//         let first_name = eachName.shift()
//         connection.query(`DELETE FROM employee WHERE ?`, {
//             first_name: first_name,
//         })
//         init()
//     })
// }

// let roleUpdate = [
//     {
//         type: 'list',
//         name: 'roleUpdate',
//         message: "What role would you like to change the employee to?",
//         choices: ["Sales Person", "Sales Lead", "Software Engineer", "Lead Engineer", "Lawyer", "Accountant"]
//     }
// ]

// function UpdateRole(){
//     inquirer.prompt(selectEmployee).then((response)=>{
//         let eachName = response.selection.split(" ")
//         let first_name = eachName.shift()
//         inquirer.prompt(roleUpdate).then((response)=>{
//             console.log(typeof response.roleUpdate)
//             connection.query(`UPDATE employee_role SET ? WHERE ?`, [
//                 {
//                     title: response.roleUpdate,
//                 },
//                 {
//                     first_name: first_name,
//                 }
//             ])
//             init()
//         })
//         console.log(response)
//     })
// }

// function UpdateManager(){
//     inquirer.prompt(selectEmployee).then((response)=>{
//         let eachName = response.selection.split(" ")
//         let first_name = eachName.shift()
//         console.log(response)
//     })
// }

connection.connect((error) => {
  if (error) throw error;
  console.log(`connected as id ${connection.threadId}`);

  init();
});
