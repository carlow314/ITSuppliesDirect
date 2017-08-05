var mysql = require("mysql");
var inquirer = require("inquirer");
var console = require('better-console');
var connection = mysql.createConnection({
  host: "127.0.0.1", port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "Rudy31484$",
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
    choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
  }).then(function(response) {
    switch (response.action) {
      case "View Products For Sale":
        displayAllProducts();
        break;
      case "View Low Inventory":
        lowInventory();
        break;
      case "Add to Inventory":
        addToInventory();
        break;
      case "Add New Product":
        addNewProduct();
        break;
    }
  });
};

function displayAllProducts() {
  var productlist = [];
  connection.query("SELECT * FROM products", function(err, res) {
    if (err)
      throw err;
    for (var i = 0; i < res.length; i++) {
      productlist.push(res[i]);
    }
    console.table(productlist);
    menu();
  });
}
function lowInventory() {
  var productlist = [];
  connection.query("SELECT * FROM products WHERE stock_qty < 3", function(err, res) {
    if (err)
      throw err;
    for (var i = 0; i < res.length; i++) {
      productlist.push(res[i]);
    }
    console.table(productlist);
    menu();
  });
}
function addToInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err)
      throw err;
    var productname = [];
    for (var i = 0; i < res.length; i++) {
      var choice = res[i];
      productname.push(choice.product_name);
    };
    inquirer.prompt([
      {
        name: "itemName",
        type: "list",
        message: "What is the Name of the product you want to increase inventory on?",
        choices: productname
      }, {
        name: "quantity",
        type: "input",
        message: "What is the quantity you would like to add to inventory?"
      }
    ]).then(function(answer) {
      var quantity = answer.quantity;
      var itemName = answer.itemName;
      LimitInventoryIncrease(quantity, itemName)
    });
  });
  function LimitInventoryIncrease(quantity, itemName) {
    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, {
      product_name: itemName
    }, function(err, res) {
      if (err)
        throw err;
      if (res[0].stock_qty > 10) {
        console.log("Sorry, Inventory levels are not low enough to restock this product!");
        menu();
      } else {
        var name = res[0].product_name;
        connection.query("UPDATE products SET ? WHERE ?", [
          {
            stock_qty: res[0].stock_qty + JSON.parse(quantity)
          }, {
            product_name: itemName
          }
        ], function(err, res) {
          if (err)
            throw err;
          console.log("Inventory has been increased for : " + itemName + " by: " + quantity + " items!");
          menu();
        });
      };
    });
  };
};

function addNewProduct() {
  inquirer.prompt([
    {
      name: "itemName",
      type: "input",
      message: "What is the Name of the product you want to increase inventory on?"
    }, {
      name: "department",
      type: "input",
      message: "What department is this product sold out of?"
    }, {
      name: "price",
      type: "input",
      message: "What will the retail price of this product be?"
    }, {
      name: "quantity",
      type: "input",
      message: "What is the quantity you would like to add to inventory?"
    }
  ]).then(function(answer) {
    var query = connection.query("INSERT INTO products SET ?", {
      product_name: answer.itemName,
      department_name: answer.department,
      price: answer.price,
      stock_qty: answer.quantity
    }, function(err, res) {
      if (err)
        throw err;
      console.log(res.affectedRows + " product inserted!");
      menu();
    });
  });
};
