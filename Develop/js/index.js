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

let allManagerNames = []

// ----------------------ALL PROMPT QUESTIONS----------------------\\
let firstQuestions = [
    {
        type: 'list',
        name: "firstList",
        message: "What would you Like to do?",
        choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee's Manager"]
    }    
]

let addEmployee = [
    {
        type: 'input',
        name: 'first_name',
        message: "What is the employee's first name?",
    },
    {
        type: 'input',
        name: 'last_name',
        message: "What is the employee's last name?",
    },
    {
        type: `list`,
        name: `department`,
        message: `Which department does the Employee work in?`,
        choices: [`Sales`, `Engineering`, `Finance`, `Legal`]
    },
    {
        type: 'list',
        name: 'title',
        message: "What is the employee's role?",
        choices: ["Sales Person", "Sales Lead", "Software Engineer", "Lead Engineer", "Lawyer", "Accountant"]
    },
    {
        type: `input`,
        name: `salary`,
        message: `What salary is the Employee on?`
    },
    {
        type: 'input',
        name: 'manager',
        message: "Who is the employee's Manager?",
        choices: `${allManagerNames}`
    }
]
//------------------------------------------------------------------\\

// Function that starts prompts, then dictates which option the user selects \\
function init(){
    inquirer.prompt(firstQuestions).then((response)=>{
        switch(response.firstList){
            case "View All Employees":
                DisplayAllEmployees()
                break;
            case "View All Employees By Department":
                DisplayAllEmployeesByDepartment()
                break;
            case "View All Employees By Manager":
                DisplayAllEmployeesByManager()
                break;
            case "Add Employee":
                AddEmployee()
                break;
            case "Remove Employee":
                RemoveEmployee()
                break;
            case "Update Employee Role":
                UpdateRole()
                break;
            case "Update Employee's Manager":
                UpdateManager()
                break;
        }
    })
}

//----------- All Prompt Functions for each option -----------\\

function DisplayAllEmployees(){
    inquirer.prompt(displayAll).then((response)=>{
        console.log(response)
        init()
    })
};

function DisplayAllEmployeesByDepartment(){
    inquirer.prompt(displayByRole).then((response)=>{
        console.log(response)
        init()
    })
};

function DisplayAllEmployeesByManager(){
    inquirer.prompt(displayByManager).then((response)=>{
        console.log(response)
        init()
    })
};

function AddEmployee(){
    inquirer.prompt(addEmployee).then((response)=>{
        connection.query(`INSERT INTO employee SET ?`, {
            first_name: response.first_name,
            last_name: response.last_name,
        }, (error, response)=>{if(error) throw error;})
        connection.query(`INSERT INTO employee_role SET ?`, {
            title: response.title,
            salary: response.salary,
        }, (error, response)=>{if(error) throw error;})
        connection.query(`INSERT INTO department SET ?`, {
            department_name: response.department,
        }, (error, response)=>{if(error) throw error;})
        console.log(response)
        init()
    })
   
}

function RemoveEmployee(){
    inquirer.prompt(removeEmployee).then((response)=>{
        console.log(response)
    })
}

function UpdateRole(){
    inquirer.prompt(updateRole).then((response)=>{
        console.log(response)
    })
}

function UpdateManager(){
    inquirer.prompt(updateManager).then((response)=>{
        console.log(response)
    })
}

connection.connect((error)=>{
    if(error) throw error;
    console.log(`connected as id ${connection.threadId}`)
    init()
});