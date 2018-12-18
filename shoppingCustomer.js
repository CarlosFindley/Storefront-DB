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
  connection.query("SELECT item_id, product_name, department_name, price_per_item, stock_quantity FROM products", function(err, results) {
    if (err) throw err;
    console.table(results);
    userPurchase()
  });
}

// To purchase
function userPurchase() {
  // query the database for all items being sold
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    // Once we have the items, prompt the user for which they'd like to buy
    inquirer
      .prompt([
        {
          message: "What would you like to buy (select from item_id)?",
          type: "input",
          name: "itemChoice"
        },
        {
          message: "How many would you like to buy (select from stock_quantity)?",
          type: "input",
          name: "quantityChoice"
        }
      ]).then(function(answer) {

          // console.log(answer);
          // console.log(results);

        // Check if there are enough items in the inventory
        var inventoryResult = connection.query("SELECT stock_quantity FROM products WHERE item_id =" + answer.itemChoice, function (err, resultsIntventory) {
          // results = [ RowDataPacket { stock_quantity: 50000 } ]
          // results[0] = RowDataPacket { stock_quantity: 50000 }
          // results[0].RowDataPacket
        
            // console.log("results", results[0].stock_quantity);

          // determine if there is enough in the inventory
          if (resultsIntventory[0].stock_quantity < parseInt(answer.quantityChoice)) {
            // Not enough in the inventory
            console.log("Sorry, not enough in inventory, please lower the order quantity.")
            userPurchase();
          } else {
            // Succesful purchase message
            console.log("Purchase of " + answer.quantityChoice + " ___ was successful!  Your total is ___.");
            // console.log("hi ", results);
          }; 
      });
    
  })
  });

}

// var chosenItem = answer.choice - 1;



  // Connect to db to update the quantity
  // connection.query(
  //   "UPDATE products SET ? WHERE ?",
  //     [
  //       {
  //         stock_quantity: (results[0].stock_quantity - parseInt(answer.quantityChoice)) 
  //       },
  //       {
  //         item_id: answer.itemChoice
  //       }
  //     ],
    
  //     // If purchase is succesful, let the user know
  //     function (err, response) {
  //       if (err) throw err;
  //       console.log("Purchase placed successfully!");
  //     }   
  //   );