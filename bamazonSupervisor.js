//require mysql npm module
var mysql = require('mysql');
//require inquirer npm module
var inquirer = require('inquirer');
//require better-console module
var console = require('better-console');
//connect to mysql database
var connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '******',
  database: 'bamazon'
});
connection.connect(function(err) {
  if (err)
    throw err;
  console.log("connected as id " + connection.threadId);
  menu();
});
//menu with choices for Supervisor
function menu() {
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "what would you like to do?",
    choices: ["View Product Sales by Department", "Add Department"]
  }).then(function(response) {
    switch (response.action) {
      case "View Product Sales by Department":
        viewSales();
        break;
      case "Add Department":
        addDepartment();
        break;
    }
  });
};
//function to add Departments to the store.
function addDepartment() {
  inquirer.prompt([
    {
      name: "department",
      type: "input",
      message: "What is the Name of the department you would like to add?"
    }, {
      name: "overhead",
      type: "input",
      message: "What are the departments overhead?"
    }
  ]).then(function(answer) {
    var query = connection.query("INSERT INTO departments SET ?", {
      department_name: answer.department,
      overhead_costs: JSON.parse(answer.overhead)
    }, function(err, res) {
      if (err)
        throw err;
      console.log(res.affectedRows + " department inserted!");
      menu();
    });
  });
};

//function to view the sales report across all departments.
function viewSales() {
  var productlist = [];
  connection.query("SELECT department_id,departments.department_name,overhead_costs,product_sales,(product_sales-overhead_costs) AS Total_Revenue FROM departments INNER JOIN products on products.department_name = departments.department_name GROUP BY department_name", function(err, res) {
    if (err)
      throw err;
    for (var i = 0; i < res.length; i++) {
      productlist.push(res[i]);
    }
    console.table(productlist);
    menu();
  });
};
