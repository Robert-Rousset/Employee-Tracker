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

// ADDING THE EMPLOYEE QUESTIONS
let addEmployees = [
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
  {
    type: `list`,
    name: `department`,
    message: `Which department does the Employee work in?`,
    choices: [`Sales`, `Engineering`, `Finance`, `Legal`],
  },
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
    name: "manager_name",
    message: "Who is the employee's Manager?",
  },
];

let displayByDepartment = [
  {
    type: "list",
    name: "department",
    message: "Which department?",
    choices: ["Sales", "Engineering", "Finance", "Legal"],
  },
];

//------------------------------------------------------------------\\

// Function that starts prompts, then dictates which option the user selects \\
function init() {
  console.clear()
  inquirer.prompt(firstQuestions).then((response) => {
    switch (response.firstList) {
      case "View All Employees":
        displayAllEmployees();
        console.clear()
        break;
      case "View All Employees By Department":
        displayAllEmployeesByDepartment();
        break;
      case "View All Employees By Manager":
        displayAllEmployeesByManager();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Remove Employee":
        removeEmployee();
        break;
      case "Update Employee Role":
        updateRole();
        break;
      case "Update Employee's Manager":
        updateManager();
        break;
    }
  });
}

//----------- All Prompt Functions for each option -----------\\

function displayAllEmployees() {
  console.clear()
  connection.query(
    `SELECT * FROM employee 
    JOIN employee_role ON role_id = employee_role.id
    JOIN department ON department_id = department.id`,
    (error, response) => {
      if (error) throw error;
      console.table("\n", response, "\n");
    }
  );
  init();
}

function displayAllEmployeesByDepartment() {
  console.clear()
  inquirer.prompt(displayByDepartment).then((response) => {
    connection.query(
      `SELECT * FROM department
      JOIN employee_role ON department_id = department.id
      JOIN employee ON role_id = employee_role.id
      WHERE department_name = "${response.department}"`,
      (error, response) => {
        if (error) throw error;

        console.table("\n", response, "\n");
      }
    );
    init();
    console.clear()
  });
}

let allManagerNames = [];

let selectWhichManager = [
  {
    type: "list",
    name: "name",
    message: "Which Manager would you like to group employee's by?",
    choices: allManagerNames,
  },
];

function displayAllEmployeesByManager() {
  connection.query(`SELECT manager_name FROM employee`, (error, response) => {
    if (error) throw error;
    allManagerNames.length = 0;
    for (let index = 0; index < response.length; index++) {
      const element = response[index].manager_name;
      if (element != null) {
        allManagerNames.push(element);
      }
    }
    selectManager();
  });
}

function selectManager() {
  inquirer.prompt(selectWhichManager).then((response) => {
    connection.query(
      `SELECT * FROM employee 
            JOIN employee_role ON role_id = employee_role.id
            JOIN department ON department_id = department.id
            WHERE manager_name = "${response.name}"`,
      (error, response) => {
        if (error) throw error;

        console.table("\n", response, "\n");
      }
    );
    init();
    console.clear()
  });
}

//--------ALL FUNCTIONS THAT ADD EMPLOYEE DATA--------\\

function addEmployee() {
  inquirer.prompt(addEmployees).then((response) => {
    // Inserting the responses into the tables
    connection.query(
      `INSERT INTO department SET ?`,
      {
        department_name: response.department,
      },
      (error, response) => {
        if (error) throw error;
      }
    );

    // unfortunately a bit of ugly nesting here because the unique department/role id's info got lost if they were out of scope, and I couldn't seem to add them to an empty variable out of scope (as all functions are completed at once after the prompts). I could have used async await here too i think but this work and took me far too long to get working!
    connection.query(
      `SELECT id FROM department ORDER BY id DESC`,
      (error, deptId) => {
        deptIdNum = deptId[0].id;
        connection.query(
          `INSERT INTO employee_role SET ?`,
          {
            title: response.title,
            salary: response.salary,
            department_id: deptIdNum,
          },
          (error, response) => {
            if (error) throw error;
          }
        );
        connection.query(
          `SELECT id FROM employee_role ORDER BY id DESC`,
          (error, roleId) => {
            roleIdNum = roleId[0].id;

            connection.query(
              `INSERT INTO employee SET ?`,
              {
                first_name: response.first_name,
                last_name: response.last_name,
                manager_name: response.manager_name,
                role_id: roleIdNum,
              },
              (error, response) => {
                if (error) throw error;
              }
            );
          }
        );
      }
    );
    console.clear()
    init();

  });
}

// creating an empty array for the employee names so they can be selected
let employeeNames = [];

let selectEmployee = [
  {
    type: "list",
    name: "selection",
    message: "Which employee?",
    choices: employeeNames,
  },
];

function removeEmployee() {
  connection.query(
    `SELECT first_name, last_name FROM employee`,
    (error, response) => {
      if (error) throw error;

      // reducing the employee name array to zero so that it doesn't create duplicates after multiple selections of this function.
      employeeNames.length = 0;

      // pushing all the response elements to the array
      response.forEach((element) => {
        employeeNames.push(element.first_name + " " + element.last_name);
      });
      selectEmployeeToRemove();
    }
  );
}

function selectEmployeeToRemove() {
  inquirer.prompt(selectEmployee).then((response) => {
    let eachName = response.selection.split(" ");
    let first_name = eachName.shift();
    connection.query(
      // grabbing the correct ID so that each row can be deleted with its unique indentifier.
      `SELECT id FROM employee WHERE first_name = "${first_name}"`,
      (error, id) => {
        let idNumber = id[0].id;

        connection.query(`DELETE FROM employee WHERE id = "${idNumber}"`);
        connection.query(`DELETE FROM employee_role WHERE id = "${idNumber}"`);
        connection.query(`DELETE FROM department WHERE id = "${idNumber}"`);
      }
    );
    console.clear()
    init();

  });
}

let roleUpdate = [
  {
    type: "list",
    name: "roleUpdate",
    message: "What role would you like to change the employee to?",
    choices: [
      "Sales Person",
      "Sales Lead",
      "Software Engineer",
      "Lead Engineer",
      "Lawyer",
      "Accountant",
    ],
  },
];

let managerUpdate = [
  {
    type: "input",
    name: "managerUpdate",
    message: "Who is this employees new manager?"
  }
]

function updateRole() {
  connection.query(
    `SELECT first_name, last_name FROM employee`,
    (error, response) => {
      if (error) throw error;

      // reducing the employee name array to zero so that it doesn't create duplicates after multiple selections of this function.
      employeeNames.length = 0;

      // pushing all the response elements to the array
      response.forEach((element) => {
        employeeNames.push(element.first_name + " " + element.last_name);
      });
      selectEmployeeToUpdate();
    }
  );
}

function selectEmployeeToUpdate() {
  inquirer.prompt(selectEmployee).then((response) => {
    let eachName = response.selection.split(" ");
    let first_name = eachName.shift();
    inquirer.prompt(roleUpdate).then((response) => {
      connection.query(
        // grabbing the correct ID so that each row can be deleted with its unique indentifier.
        `SELECT id FROM employee WHERE first_name = "${first_name}"`,
        (error, id) => {
          let idNumber = id[0].id;
          connection.query(
            `UPDATE employee_role SET ? WHERE id = "${idNumber}"`,
            {
              title: response.roleUpdate,
            }
          );
          console.clear()
          init();

        }
      );
    });
  });
}

function updateManager() {
  connection.query(
    `SELECT first_name, last_name FROM employee`,
    (error, response) => {
      if (error) throw error;

      // reducing the employee name array to zero so that it doesn't create duplicates after multiple selections of this function.
      employeeNames.length = 0;

      // pushing all the response elements to the array
      response.forEach((element) => {
        employeeNames.push(element.first_name + " " + element.last_name);
      });
      selectEmployeeToUpdateManager();
    }
  );

}

function selectEmployeeToUpdateManager() {
  inquirer.prompt(selectEmployee).then((response) => {
    let eachName = response.selection.split(" ");
    let first_name = eachName.shift();
    inquirer.prompt(managerUpdate).then((response) => {
      connection.query(
        // grabbing the correct ID so that each row can be deleted with its unique indentifier.
        `SELECT id FROM employee WHERE first_name = "${first_name}"`,
        (error, id) => {
          let idNumber = id[0].id;
          connection.query(
            `UPDATE employee SET ? WHERE id = "${idNumber}"`,
            {
              manager_name: response.managerUpdate,
            }
          );
          console.clear()
          init();
       
        }
      );
    });
  });
}

connection.connect((error) => {
  if (error) throw error;
  console.log(`connected as id ${connection.threadId}`);

  init();
});
