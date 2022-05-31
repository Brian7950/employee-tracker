const inquire = require('inquirer');
const mySql = require('mysql2');
require("console.table")
require("dotenv").config()

//establish connection 
const connection = mySql.createConnection(
    {
        port: 3306,
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
    }
)
connection.connect(() => {
    console.log('Database connected!')
    appStart();
});

//begins inquirer prompt
function appStart() {
    inquire.prompt([{
        type: "list",
        name: "option",
        choices: ['view employees', 'view department', 'view roles', 'add department', 'add roles', 'add employee', 'update employee role', 'exit app'],

    }])

        .then(userInput => {
            switch (userInput.option) {
                case "view employees":
                    viewEmployees();
                    break;

                case "view department":
                    viewDeparment();
                    break;

                case "view roles":
                    viewRoles();
                    break;

                case "add department":
                    addDepartment();
                    break;

                case "add roles":
                    addRoles();
                    break;

                case "add employee":
                    addEmployee();
                    break;

                case "update employee role":
                    updateEmployee();
                    break;

                case "exit app":
                    exitApp();
                    break;
            }
        });

}
//selects employee table and displays
function viewEmployees() {
    connection.query(`SELECT * FROM employee;`, function (err, data) {
        if (err) throw err;
        console.table(data)
        appStart();
    });
}

//Selects dept table 
function viewDeparment() {
    connection.query(`SELECT * FROM department;`, function (err, data) {
        if (err) throw err;
        console.table(data)
        appStart();
    });
}

//Selects roles table 
function viewRoles() {
    connection.query(`SELECT * FROM roles;`, function (err, data) {
        if (err) throw err;
        console.table(data)
        appStart();
    });
}

//allows for creation of another deparment to add to department table 
function addDepartment() {
    inquire.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What department would you like to add?',

        }
    ])
        .then(userInput => {
            connection.query(`INSERT INTO department (name) VALUES (?);`, userInput.departmentName, function (err, data) {
                if (err) throw err;
                console.table(data)
                appStart();
            });
        })
}

//Creates new roles to roles table 
function addRoles() {
    inquire.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What new role you would like to add',

        },

        {
            type: 'input',
            name: 'salary',
            message: 'Salary for the Role?',

        },

        {
            type: 'list',
            name: 'department_id',
            message: 'What department do they belong to?',
            choices: [
                {
                    value: 1,
                    name: 'Marketing'
                },
                {
                    value: 2,
                    name: 'Sales'
                },
                {
                    value: 3,
                    name: 'HR'
                },
                {
                    value: 4,
                    name: 'Tech'
                },
            ]
        }

    ])
        .then(userInput => {
            connection.query(`INSERT INTO roles (title, salary, department_id) VALUES(?,?,?);`, [userInput.title, userInput.salary, userInput.department_id], function (err, data) {
                if (err) throw err;
                console.table(data)
                appStart();
            });
        })
}

//adds new employee to employee table 
function addEmployee() {
    inquire.prompt([
        {
            type: 'input',
            name: 'emp_first',
            message: 'What is employees first name?'
        },
        {
            type: 'input',
            name: 'emp_last',
            message: 'What is employees last name?'
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is employee role ',
            choices: [
                {
                    value: 1,
                    name: 'Intern'
                },
                {
                    value: 2,
                    name: 'Rep'
                },
                {
                    value:3,
                    name: 'Jr Dev'
                }
            ]
        },
        // won't execute if number selected is not a current managers number 
        {
            type:Number,
            name: 'manager_id',
            validate: async(input) =>{
                if(input > 4){
                    return 'Wrong manager id'
                }
                return true;
            }
        }
    ])
    .then(userInput =>{
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?);`, [userInput.emp_first, userInput.emp_last, userInput.role, userInput.manager_id], function(err, data){
            if(err)
                throw err;
                console.table(data)
                appStart(); 
        });
    });
};

//updates selected employees role 
const updateEmployee = () => {
    const employee = [];
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name FROM employee`, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        result.forEach(item => {
            const name = `${item.first_name} ${item.last_name}`;
            employee.push(name);
        });
        inquire.prompt([
            {
                type: 'list',
                name: 'update',
                message: `Who's role do you want to update?`,
                choices: employee
            },
            {
                type: 'input',
                name: 'new_role',
                message: `What is their new role id?`,
                validate: input => {
                    if (!isNaN(input)) {
                        return true;
                    } else {
                        console.log(' Please enter a number');
                        return false;
                    };
                }
            }
        ]).then(input => {
            const split = input.update.split(' ');
            const sql = `UPDATE employee
                         SET role_id = ${input.new_role}
                         WHERE first_name = '${split[0]}'
                         AND last_name = '${split[1]}'`
            connection.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log(result);
                appStart();
            });
        });
    });
}

//exits app 
const exitApp = () =>{
    console.log('Thanks for using Employee-Tracker, See you next time!');
    process.exit();
};