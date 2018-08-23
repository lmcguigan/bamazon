const mysql = require("mysql");
const inquirer = require('inquirer');
const chalk = require('chalk');
const figures = require('figures');
var CartItem = require("./cartitem.js");
var async = require("async");
var productIDs = [];
var customerCart = [];
var currentItemName = "";
var currentItemID = "";
var currentItemPrice = 0;
var availbleUnits = 0;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    introMessage();
    displayItems();
});

function displayItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log("Product ID:" + res[i].item_id + chalk.blue("  |  ") + "Product Name: " + res[i].product_name + chalk.blue("  |  ") + "Price: " + res[i].price);
            productIDs.push(res[i].item_id);
        }
        askProduct();
    });
}

function askProduct() {
    inquirer.prompt([
        {
            type: "list",
            name: "productPrompt",
            message: "What is the ID of the product you want to buy?",
            choices: productIDs
        }
    ]).then(({ productPrompt }) => {
        connection.query("SELECT * FROM products WHERE item_id = ?", [productPrompt], function (err, res) {
            if (err) throw err;
            console.log("You have chosen: " + res[0].product_name);
            currentItemName = res[0].product_name;
            currentItemID = res[0].item_id;
            currentItemPrice = res[0].price;
            availbleUnits = res[0].stock_quantity;
            checkProduct();
        });
    });
}

function askUnits() {
    inquirer.prompt([
        {
            type: "number",
            name: "unitsPrompt",
            message: "How many units would you like to buy?"
        }
    ]).then(({ unitsPrompt }) => {
        var anItem = new CartItem(currentItemID, currentItemName, currentItemPrice, unitsPrompt);
        connection.query("SELECT * FROM products WHERE item_id = ?", [anItem.id], function (err, res) {
            if (err) throw err;
            var availableQ = res[0].stock_quantity;
            if (availableQ < anItem.quantityDesired) {
                console.log("Sorry, there are only " + availableQ + " available.");
                console.log("Please select a smaller quanity.");
                askUnits();
            }
            else {
                customerCart.push(anItem);
                console.log(customerCart);
                afterAct();
            }
        });
    });
}

function introMessage() {
    console.log("WELCOME TO BAMAZON");
    console.log("Your one-stop shop for rabbit needs.");
}
function checkProduct() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "sure",
            message: "Is this the product you would like to buy?"
        }
    ]).then(({ sure }) => {
        if (sure) {
            askUnits();
        }
        else {
            askProduct();
        }
    });
}
function checkOut() {
    var totalCharged = 0;
    newamount = 10;
    function updateStock(customerCart, length){
        var Update = "UPDATE products SET stock_quantity = ?"
        var Where = "WHERE item_id = ?";
        var sql = Update + Where;
        async.forEachOf(customerCart, function (dataElement, i, inner_callback){
            var inserts = [dataElement['itemId'], dataElement['buyout']];
            var ssql = mysql.format(sql, inserts);
            connection.query(ssql, function(err, res){
                if(!err){
                    console.log("check Undercut: " + res[0].cnt);
                    dataElement['undercut'] = res[0].cnt;
                    inner_callback(null);
                } else {
                    console.log("Error while performing Query");
                    inner_callback(err);
                };
            });
        }, function(err){
            if(err){
              //handle the error if the query throws an error
            }else{
              //whatever you wanna do after all the iterations are done
            }
        });
    }
    function updateStock (){
        async.each(customerCart, updateStock, function(err){
            console.log("Your order was successfully received.");
        });
        connection.query("UPDATE products SET stock_quantity = " + connection.escape(newamount) + "WHERE item_id = ?", [cartItemID], function (err, res) {
            if (err) throw err;
        });
    }
    //check each item id against database
    
    //for (k = 0; k < customerCart.length; k++) {
    //    var cartItemID = customerCart[k].id;
    //    var amountRemove = customerCart[k].quantityDesired;
    //    totalCharged += customerCart[k].totalCost;
    //    connection.query("SELECT * FROM products WHERE item_id = ?", [cartItemID], function (err, res) {
    //        if (err) throw err;
    //        var currentStock = res[0].stock_quantity;
    //        var newamount = parseInt(currentStock) - parseInt(amountRemove);
     //       connection.query("UPDATE products SET stock_quantity = " + connection.escape(newamount) + "WHERE item_id = ?", [cartItemID], function (err, res) {
     //           if (err) throw err;
     //       });
     //   });
    //}
    console.log("Your order was successfully received.");
}
function showCart() {
    console.log(chalk.green("Your cart currently contains: "));
    for (q = 0; q < customerCart.length; q++) {
        console.log("Product ID:" + customerCart[q].id + chalk.magenta("  |  ") + "Product Name: " + customerCart[q].name + chalk.magenta("  |  ") + "Quantity: " + customerCart[q].quantityDesired + chalk.magenta("  |  ") + "Total Cost: " + customerCart[q].totalCost);
    }
    afterCart();
}
function afterAct() {
    inquirer.prompt([
        {
            type: "list",
            name: "afterAction",
            message: "What would you like to do next?",
            choices: ["Add another item", "View my cart", "Check out"]
        }
    ]).then(({ afterAction }) => {
        if (afterAction === "Add another item") {
            askProduct();
        }
        else if (afterAction === "View my cart") {
            showCart();
        }
        else if (afterAction === "Check out") {
            checkOut();
        }
    });
}
function afterCart() {
    inquirer.prompt([
        {
            type: "list",
            name: "afterAction",
            message: "What would you like to do next?",
            choices: ["Add another item", "Remove an item", "Check out"]
        }
    ]).then(({ afterAction }) => {
        if (afterAction === "Add another item") {
            askProduct();
        }
        else if (afterAction === "Remove an item") {
            removeItem();
        }
        else if (afterAction === "Check out") {
            checkOut();
        }
    });
}
function removeItem() {
    var cartItemNames = [];
    for (n = 0; n < customerCart.length; n++) {
        cartItemNames.push(customerCart[n].name);
    }
    inquirer.prompt([
        {
            type: "list",
            name: "itemDelete",
            message: "Which item would you like to remove?",
            choices: cartItemNames
        }
    ]).then(({ itemDelete }) => {

    });
}