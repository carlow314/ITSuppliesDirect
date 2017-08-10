var mysql = require("mysql");
var inquirer = require("inquirer");
var console = require('better-console');
var connection = mysql.createConnection({
  host: "127.0.0.1", port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "******",
  database: "bamazon"
});
connection.connect(function(err) {
  if (err)
    throw err;
  console.log("connected as id " + connection.threadId);
  menu();
});
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
