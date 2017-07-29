var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  // Your username
  user: 'root',
  // Your password
  password: 'Rudy31484$',
  database: 'bamazon'
});
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  queryAllProducts();
  });

function queryAllProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
      }
      console.log("-----------------------------------");
    });
  };
