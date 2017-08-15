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
connection.connect(function (err) {

  if (err)
    throw err;
  console.log("connected as id " + connection.threadId);
  displayAllProducts();
});
//connect to mysql database and return all products to an array
function displayAllProducts() {
  var products = [];
  connection.query("SELECT item_id,product_name,price FROM products", function (err, res) {
    if (err)
      throw err;
    for (var i = 0; i < res.length; i++) {
      products.push(res[i]);
    }
    console.table(products);
    placeYourOrder();
  });
};

//inquirer prompt for a user to place an order
function placeYourOrder() {
  inquirer.prompt([{
    name: "itemID",
    type: "input",
    message: "What is the ID of the product you would like to buy?"
  }, {
    name: "quantity",
    type: "input",
    message: "What is the quantity you would like to buy?"
  }]).then(function (answer) {
    var quantity = answer.quantity;
    var itemId = answer.itemID;
    CheckStockLevel(quantity, itemId);
  });
}
//checks inventory to see if there is enough product to fulfill customer request
function CheckStockLevel(quantity, itemId) {
  var query = "SELECT * FROM products WHERE ?";
  connection.query(query, {
    item_id: itemId
  }, function (err, res) {
    if (err)
      throw err;
    if (res[0].stock_qty < quantity) {
      console.log("Sorry, there is not enough inventory to fill your order today!!");
      displayAllProducts();
    } else {
     //update mysql database with purchase info. 
      var price = res[0].price;
      var name = res[0].product_name;
      var product_sales = res[0].product_sales;
      var stock_qty = res[0].stock_qty;
      connection.query("UPDATE products SET ?,? WHERE ?", [{
          stock_qty: stock_qty - JSON.parse(quantity)
        },
        {
          product_sales: (JSON.parse(price) * JSON.parse(quantity)) + product_sales
        },
        {
          item_id: itemId
        }
      ], function (err, res) {
        if (err)
          throw err;
        //display confirmation of purchase
        console.log("Thank you for your purchase! Your total cost for " + name + " is:" + " $" + (price * quantity));
        displayAllProducts();
      });
    }
  });
};