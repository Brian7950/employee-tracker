const inquire = require('inquirer');
const mySql = require('mysql2');
require("console.table")
require("dotenv").config()

const connection = mySql.createConnection(
    {
        port: 3306,
        host: 'localhost',
        user:process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
    }
)
connection.connect(() => {
    console.log('Database connected!')
    appStart();
});

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
 
function viewEmployees(){
    connection.query(`SELECT * FROM employee;`,function(err,data){
        if(err) throw err;
        console.table(data)
        appStart();
    });
}

function viewDeparment(){
    connection.query(`SELECT * FROM department;`,function(err,data){
        if(err) throw err;
        console.table(data)
        appStart();
    });
}

function viewRoles(){
    connection.query(`SELECT * FROM roles;`,function(err,data){
        if(err) throw err;
        console.table(data)
        appStart();
    });
}


function addDepartment(){
    inquire.prompt([
        {
            type:'input',
            name:'departmentName',
            message:'What department would you like to add?',

        }
    ])
    .then(userInput =>{
        connection.query(`INSERT INTO department (name) VALUES (?);`,userInput.departmentName, function(err,data){
            if(err) throw err;
            console.table(data)
            appStart();
        });
    })
}

function addRoles(){
    inquire.prompt([
        {
            type:'input',
            name:'title',
            message:'What new role you would like to add',

        },

        {
            type:'input',
            name:'salary',
            message:'Salary for the Role?',

        },

        {
            type:'list',
            name:'department_id',
            message:'What department do they belong to?',
            choices: [
                {
                    value:1,
                    name:'Marketing'
                },
                {
                    value:2,
                    name:'Sales'
                },
                {
                    value:3,
                    name:'HR'
                },
                {
                    value:4,
                    name:'Tech'
                },
            ]
        }
      
    ])
    .then(userInput =>{
        connection.query(`INSERT INTO roles (title, salary, department_id) VALUES(?,?,?);`,[userInput.title,userInput.salary,userInput.department_id], function(err,data){
            if(err) throw err;
            console.table(data)
            appStart();
        });
    })
}