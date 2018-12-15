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
  connection.query("SELECT department_name, product_name, price, stock_quantity FROM products", function(err, results) {
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
          name: "item"
        },
        {
          message: "How many would you like to buy (select from stock_quantity)?",
          type: "input",
          name: "quantity"
        }
      ]).then(function(answer) {
        var itemChoice = parseInt(parseInt(answer.item) -1);
        var itemTotal = parseInt(answer.quantity) * results[itemChoice].price_per_item;

        // Update database
        if (parseInt(answer.quantity) <= results[itemChoice].stock_quantity) {
          connection.query("UPDATE products SET ? WHERE",
          [
            {
              stock_quantity: (parseInt(results[itemChoice].stock_quantity) - answer.quantity)
            },
            {item_id: answer.item}
        ],
      function (err) {
        if (err) throw err;
        console.log("Thanks for your order!  Your Total is " + "$" + itemTotal.toFixed(2));
        console.log("\n\n");
        // End db connection
        connection.end();
      });
    } else {
      console.log("Quantity has exeeded inventory, please lower the order quantity");

      userPurchase();
    }
  });
})
};
