var inquirer = require("inquirer");
// To use sql
var mysql      = require("mysql");
// console.table npm package
var cTable = require("console.table");

// Link to db from the sql package
var connection = mysql.createConnection({
  host     : "localhost",
  port     : 3306,
  user     : "root",
  password : "password",
  database : "storefront_db"
});
 
// Start db connection
connection.connect(function(err) {
    if (err) throw err;
    // Welcome message
    console.log("\n-=-=-=-=-=>~ Welcome to The Great Market of Tenochtitlán ~<=-=-=-=-=-");
    console.log("   ~<=-=-=-=-=-      Products From Téul to Izapa      -=-=-=-=-=>~   \n")
    displayInventory();
});
 
// To pull our inventory
function displayInventory() {
  // Query the database for all items being sold
  connection.query("SELECT department_name, product_name, price_per_item, stock_quantity FROM products", function(err, results) {
    if (err) throw err;
    console.table(results);
    userPurchase()
  });
}

// To purchase
function userPurchase() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    // Once we have the items, prompt the user for which they'd like to buy
    inquirer
      .prompt([
        {
          message: "What would you like to buy (select from product_name)?",
          type: "input",
          name: "itemChoice"
        },
        {
          message: "How many would you like to buy (select from stock_quantity)?",
          type: "input",
          name: "quantityChoice"
        }
      ]).then(function(answer) {
       // get the information of the chosen item
       var chosenItem;
       for (var i = 0; i < results.length; i++) {
         if (results[i].product_name === answer.itemChoice) {
           chosenItem = results[i];
         }
       }

        // determine if there is enough in the inventory
        if (chosenItem.stock_quantity < parseInt(answer.quantityChoice)) {
          // Enough in inventory, so update db, let the user know, and start over
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: answer.quantityChoice
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Purchase placed successfully!");
              // End db connection
              connection.end();
            }
          );
        } else {
          // Not enough in inventory, so apologize and start over
          console.log("Quantity has exeeded inventory, please lower the order quantity");
          userPurchase();
          }
       
      });
  })
};