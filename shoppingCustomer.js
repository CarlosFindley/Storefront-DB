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
    console.log("   ~<=-=-=-=-=-      Products From Téul to Izapa      -=-=-=-=-=>~   ")
    displayInventory();
});
 
// To pull our inventory
function displayInventory() {
  // Query the database for all items being sold
  connection.query("SELECT item_id, product_name, department_name, price_per_item, stock_quantity FROM products", function(err, results) {
    if (err) throw err;
    console.log("   ~<=-=-=-=-=-          Inventory of Goods           -=-=-=-=-=>~   \n")
    console.table(results);
    userPurchase();
  });
}

// To purchase
function userPurchase() {
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
        var inventoryResult = connection.query("SELECT * FROM products WHERE item_id =" + answer.itemChoice, function (err, resultsInventory) {
          if (err) throw err;
          // results = [ RowDataPacket { stock_quantity: 50000 } ]
          // results[0] = RowDataPacket { stock_quantity: 50000 }
          // results[0].RowDataPacket
        
            // console.log("results", results[0].stock_quantity);

          // determine if there is enough in the inventory
          if (resultsInventory[0].stock_quantity < parseInt(answer.quantityChoice)) {
            // Not enough in the inventory
            console.log("Sorry, not enough " + resultsInventory[0].product_name + " in inventory, please lower the order quantity.")
            whatNext();
          } else {
            var costTotal = answer.quantityChoice * resultsInventory[0].price_per_item;
            // Succesful purchase message
            console.log("Purchase of " + answer.quantityChoice + " " + resultsInventory[0].product_name + " was successful!  Your total is " + costTotal + " units.");
            // console.log("hi ", resultsInventory);

              // When purchase is succesful, update db
              var newInventoryValue = resultsInventory[0].stock_quantity - answer.quantityChoice;
              connection.query(
              "UPDATE products SET ? WHERE ?",
                [
                {
                  stock_quantity: newInventoryValue
                },
                {
                  item_id: answer.itemChoice
                }
                ],
                  function(error) {
                  if (error) throw err;
                  }
              );

              whatNext();
          }; 
        });
      });
}

// Ask the user if the want to 1) go back to inventory, go back to purchase, 
  function whatNext() {
    // Once we have the items, prompt the user for which they'd like to buy
    inquirer
      .prompt([
        {
          type: "list",
          name: "whatNextChoice",
          message: "What would you like to do next?",
          choices: ["Go back to inventory", "Go back to purchase", "Exit app"]
        }
      ]).then(function(answerWhatNext) {
        // console.log("what next ", answerWhatNext);

        if (answerWhatNext.whatNextChoice === "Go back to inventory") {
          displayInventory();
        } else if (answerWhatNext.whatNextChoice === "Go back to purchase") {
          userPurchase();
        } else if (answerWhatNext.whatNextChoice === "Exit app") {
          // End db connection
          connection.end();
        }
         
      });
}

// new inquirer.Separator(),
