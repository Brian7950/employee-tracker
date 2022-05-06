USE employee;

-- INSERT INTO department (name) VALUES ('Marketing'),('Sales'),('HR'),('Tech');


select * from department;

-- INSERT INTO roles (title, salary, department_id)
-- VALUES
-- ('Manager', 60000, 1),
-- ('Manager',55000,2),
-- ('Manager',55500,3),
-- ('Manager',65000,4),
-- ('Intern',45000,1),
-- ('Intern',45000,2),
-- ('Rep',45000,3),
-- ('Jr Dev',45000,4);

SELECT * FROM roles;

INSERT INTO employee( first_name, last_name, role_id, manager_id)
VALUES
('STEVE', 'HERNANDEZ', 1,NULL),
('Mary','Swanson', 2, null),
('Lex','Dunn', 3, null),
('Mark', 'Guillegos', 4, null),
('Brian', 'Smith', 5, 1),
('Bob' ,'BOBBY', 6, 2),
('Julie', 'Ski', 7, 3),
('Nikki', 'Rest', 8, 4);

SELECT * FROM employee;