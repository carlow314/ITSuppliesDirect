var mysql = require('mysql');
var inquirer = require('inquirer');
var console = require('better-console');
var connection = mysql.createConnection({host: '127.0.0.1', port: 3306, user: 'root', password: 'Rudy31484$', database: 'bamazon'});
connection.connect(function(err) {
  if (err)
    throw err;
  console.log("connected as id " + connection.threadId);
  displayAllProducts();
});
function displayAllProducts() {
  var products = [];
  connection.query("SELECT item_id,product_name,price FROM products", function(err, res) {
    if (err)
      throw err;
    for (var i = 0; i < res.length; i++) {
      products.push(res[i]);
    }
    console.table(products);
    placeYourOrder();
  });
};

function placeYourOrder() {
  inquirer.prompt([
    {
      name: "itemID",
      type: "input",
      message: "What is the ID of the product you would like to buy?"
    }, {
      name: "quantity",
      type: "input",
      message: "What is the quantity you would like to buy?"
    }
  ]).then(function(answer) {
    console.log(answer);
    var quantity = answer.quantity;
    var itemId = answer.itemID;
    //checks inventory to see if there is enough product to fulfill customer request
    CheckStockLevel(quantity, itemId);
  });
}

function CheckStockLevel(quantity, itemId) {
  var query = "SELECT * FROM products WHERE ?";
  connection.query(query, {
    item_id: itemId
  }, function(err, res) {
    if (err)
      throw err;
    if (res[0].stock_qty < quantity) {
      console.log("Sorry, there is not enough inventory to fill your order today!!");
      displayAllProducts();
    } else {
      var price = res[0].price;
      var name = res[0].product_name;
      var product_sales = res[0].product_sales;
      var stock_qty = res[0].stock_qty;
      connection.query("UPDATE products SET ?,? WHERE ?", [
        {
          stock_qty: stock_qty - JSON.parse(quantity)
        },
        {
          product_sales: (JSON.parse(price)* JSON.parse(quantity))+ product_sales
        },
        {
          item_id: itemId
        }
      ], function(err, res) {
        if (err)
          throw err;
        console.log("Thank you for your purchase! Your total cost for " + name + " is:" + " $" + (price * quantity));
        displayAllProducts();
      });
    }
  });
};
