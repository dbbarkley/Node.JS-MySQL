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

connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

        for (var i = 0; i < results.length; i++) {
          console.log(results[i].id + " " +results[i].product_name + " $" + results[i].price);
        }
    inquirer
     .prompt([
        {
            name: "choice",
            type: "input",
            message: "Select the ID of the product they would like to buy",
            validate: function(value) {
                if (value > 0 && value <= results.length) {
                  return true;
                }
                return console.log(" Must select a valid ID");
              }
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you lke to buy?"
        }
    ])
    .then(function(answers) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
            if (results[i].id == answers.choice) {
                chosenItem = results[i];
            }
        }

        if (chosenItem.stock_quantity >= answers.quantity) {
            var updatequantity = (chosenItem.stock_quantity - answers.quantity);
            var totalPrice = (chosenItem.price * answers.quantity);

            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                      stock_quantity: updatequantity
                  },
                  {
                      id: chosenItem.id
                  }
                ],
                function(err) {
                    if(err) throw err;
                    console.log("\nYour total is $" + totalPrice +
                    "\n~~~~~~~~~~~~~~~~~~~~~~~~~" +
                    "\n");
                    start();
                }
            )
        }
        else {
            console.log("\nInsufficient quantity!" +
            "\n~~~~~~~~~~~~~~~~~~~~~~~~~" +
            "\n");
            start();
        }  
  });
});
};