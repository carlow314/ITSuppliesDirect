var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host: '127.0.0.1', port: 3306,
  user: 'root',
  password: 'Rudy31484$',
  database: 'bamazon'
});
connection.connect(function(err) {
  if (err)
    throw err;
  console.log("connected as id " + connection.threadId);
  displayAllProducts();
});
function displayAllProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("-----------------------------------");
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + "$" + res[i].price);
    }
    console.log("-----------------------------------");
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
    console.log(res[0].stock_qty);
    if (res[0].stock_qty < quantity) {
      console.log("Sorry, there is not enough inventory to fill your order today!!");
      displayAllProducts();
    } else {
      var price = res[0].price;
      var name = res[0].product_name;
      connection.query("UPDATE products SET ? WHERE ?", [
        {
          stock_qty: res[0].stock_qty - quantity
        }, {
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
