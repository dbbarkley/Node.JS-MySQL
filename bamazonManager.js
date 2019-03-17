var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "0qzy7yf65fF!",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {

    inquirer
    .prompt([
        {
            name: "choice",
            type: "rawlist",
            choices: ["View Products for Sale", "View Low Inventory",
                        "Add to Inventory", "Add New Product"],
            message: "What would you like to do"
        }
    ])
    .then(function(answer) {
        if (answer.choice == "View Products for Sale") {
            viewProducts();
        }else if (answer.choice == "View Low Inventory") {
            viewLowInventory();
        }else if (answer.choice == "Add to Inventory") {
            addInventory();
        }else addNewProducts();
    });
};

function viewProducts () {

    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {
            console.log(results[i].id + " | Product: " + 
            results[i].product_name + " | Department: " + 
            results[i].department_name + " | $" + 
            results[i].price + " | Quantity: " + 
            results[i].stock_quantity);
          }
          inquirer
          .prompt([
              {
              name: "goBack",
              type: "confirm",
              message: "Would you like go back?"
              }
          ])
          .then(function(answer) {
            if (answer.goBack == true)
            start();
          });
    });
};

function viewLowInventory () {

    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        
        for (var i = 0; i < results.length; i++) {
            if (results[i].stock_quantity <= 5) {
                console.log(results[i].id + " | Product: " + 
                results[i].product_name + " | Department: " + 
                results[i].department_name + " | $" + 
                results[i].price + " | Quantity: " + 
                results[i].stock_quantity);
            }
        }

        inquirer
        .prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: ["Add more Inventory", "Go Back"],
                message: "What would you like to do"
                }
        ])
        .then(function(answer) {
          if (answer.choice == "Add more Inventory") {
            addInventory();
          }else if (answer.choice == "Go Back") {
            start();
          };
        });
    });
};

function addInventory () {

    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

            for (var i = 0; i < results.length; i++) {
                    console.log(results[i].id + " | Product: " + 
                    results[i].product_name + " | Department: " + 
                    results[i].department_name + " | $" + 
                    results[i].price + " | Quantity: " + 
                    results[i].stock_quantity);
            }

        inquirer
        .prompt([
            {
                name: "inventoryChoice",
                type: "input",
                message: "What product would you like to restock?",
                validate: function(value) {
                    if (value > 0 && value <= results.length) {
                      return true;
                    }
                    return console.log(" Must select a valid ID");
                  }
            },
            {
                name: "addStock",
                type: "input",
                message: "How many?"
            }
        ])
        .then(function(answers) {
            var itemStock;
            for (var i = 0; i < results.length; i++) {
                if (results[i].id == answers.inventoryChoice) {
                    itemStock = results[i];
                }
            }
            var updatequantity = (itemStock.stock_quantity + parseInt(answers.addStock))

            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                      stock_quantity: updatequantity
                  },
                  {
                      id: itemStock.id
                  }
                ],
                function(err) {
                    if(err) throw err;
                    console.log("\nTotal Inventory for " + itemStock.product_name + " is " + updatequantity +
                    "\n~~~~~~~~~~~~~~~~~~~~~~~~~" +
                    "\n");
                    start();
                }
            )
          });
    });
}

function addNewProducts() {

    inquirer
    .prompt([
        {
            name: "productName",
            type: "input",
            message: "Name of new product?"
        },
        {
            name: "departmentName",
            type: "input",
            message: "Name of department?"
        },
        {
            name: "price",
            type: "input",
            message: "Price of new product?"
        },
        {
            name: "Quantity",
            type: "input",
            message: "Quantity of new product?"
        }
    ])
    .then(function(answers) {
        var name = answers.productName;
        var department = answers.departmentName;
        var price = answers.price;
        var quantity = answers.Quantity;

        connection.query(
            "INSERT INTO products SET ?",
              {
                  product_name: name,
                  department_name: department,
                  price: price,
                  stock_quantity: quantity
              },
            function(err) {
                if(err) throw err;
                console.log("\nAdded " + name + " to Inventory" +
                "\n~~~~~~~~~~~~~~~~~~~~~~~~~" +
                "\n");
                start();
            }
        )

    });
}