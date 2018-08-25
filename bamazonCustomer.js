const mysql = require("mysql");
const inquirer = require('inquirer');
const chalk = require('chalk');
const figures = require('figures');
var CartItem = require("./cartitem.js");
var productIDs = [];
var customerCart = [];
var currentItemName = "";
var currentItemID = "";
var currentItemPrice = 0;

//user will put in their own information here:
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

//connecting to the database, then displaying intro message and items
connection.connect(function (err) {
    if (err) throw err;
    introMessage();
    displayItems();
});

//this function runs a query on the sql database to return information about all the available products
//the function calls the askProduct function to prompt the user to make a selection
function displayItems() {
    console.log(chalk.blue(figures.bullet + " ") + chalk.green(figures.bullet + " ") + chalk.blue("--------------------------") + chalk.magenta(" Product List ") + chalk.blue("-------------------------- ") + chalk.green(figures.bullet + " ") + chalk.blue(figures.bullet+ " "));
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].item_id + chalk.blue("  |  ") + "Product Name: " + res[i].product_name + chalk.blue("  |  ") + "Price: " + res[i].price);
            //stores all the item ids in an global variable array to retrieve from when askProduct is called
            productIDs.push(res[i].item_id);
        }
        askProduct();
    });
}

//the askProduct function uses an inquirer prompt to ask the user which item (from array of productIDs) that they want
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
            console.log(chalk.blue("You have chosen: ") + chalk.magenta(res[0].product_name));
            //temporarily storing all the following information so that we can later pass it into the object constructor function
            currentItemName = res[0].product_name;
            currentItemID = res[0].item_id;
            currentItemPrice = res[0].price;
            availbleUnits = res[0].stock_quantity;
            //calls checkProduct function to ensure selection is correct
            checkProduct();
        });
    });
}

//this function asks the user how many units they would like to buy. if there is not enough in stock, it asks them to choose a smaller quantity
function askUnits() {
    inquirer.prompt([
        {
            type: "number",
            name: "unitsPrompt",
            message: "How many units would you like to buy?"
        }
    ]).then(({ unitsPrompt }) => {
        var anItem = new CartItem(currentItemID, currentItemName, currentItemPrice, unitsPrompt);
        //the function runs a query on the SQL database to determine if there is enough in stock
        connection.query("SELECT * FROM products WHERE item_id = ?", [anItem.id], function (err, res) {
            if (err) throw err;
            var availableQ = res[0].stock_quantity;
            if (availableQ < anItem.quantityDesired) {
                console.log(chalk.blue("Sorry, there are only ") + chalk.magenta(availableQ) + chalk.blue(" available."));
                console.log(chalk.magenta("Please select a smaller quanity."));
                askUnits();
            }
            else {
                customerCart.push(anItem);
                console.log(chalk.blue("Item successfully added to cart"));
                afterAct();
            }
        });
    });
}
//intro message displayed
function introMessage() {
    console.log(chalk.magenta.bold("WELCOME TO BAMAZON"));
    console.log(chalk.green("Your one-stop shop for rabbit needs."));
}

//this function asks the user to confirm their selection
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

//this function calculates the total to charge by looping through the customerCart and adding each cost to the total
function checkOut() {
    var totalCharged = 0;
    //check each item id against database
    for (let k = 0; k < customerCart.length; k++) {
        var cartItemID = customerCart[k].id;
        var amountRemove = customerCart[k].quantityDesired;
        totalCharged += customerCart[k].totalCost;
    }
    console.log(chalk.blue("Your account has been charged: ") + chalk.magenta(totalCharged));
    //calls the update quantity cart - uses a count to create a recursive function
    updateQuantity(customerCart, 0);
}

function updateQuantity(customerCart, count) {
    if (count > customerCart.length - 1) {
        console.log(chalk.green("All products have been updated!"));
        console.log(chalk.magenta("Thanks for shopping at BAMAZON!"));
        process.exit();
        return true;
    }
    else {
        var itemToUpdate = customerCart[count].id;
        var quantityToSubtract = customerCart[count].quantityDesired;
        //this query is selecting the items that match what the user has in their cart
        connection.query("SELECT item_id, stock_quantity from products WHERE item_id = ?", [itemToUpdate], function (err, results) {
            var productToUpdate = {
                item_id: results[0].item_id
            }
            var newQuantity = {
                stock_quantity: results[0].stock_quantity - quantityToSubtract
            }
            //within this function, we run the update query which will update the stock quantity values in the database
            runUpdateQuery(newQuantity, productToUpdate, count);
        })
    }
}
function runUpdateQuery(newQuantity, productToUpdate, count) {
    connection.query("UPDATE products SET ? WHERE ?", [newQuantity, productToUpdate], function (err, results) {
        count++;
        updateQuantity(customerCart, count);
    })
}

//this function displays everything the user has in their cart
function showCart() {
    console.log(chalk.green("Your cart currently contains: "));
    for (q = 0; q < customerCart.length; q++) {
        console.log("Product ID:" + customerCart[q].id + chalk.magenta("  |  ") + "Product Name: " + customerCart[q].name + chalk.magenta("  |  ") + "Quantity: " + customerCart[q].quantityDesired + chalk.magenta("  |  ") + "Total Cost: " + customerCart[q].totalCost);
    }
    afterCart();
}

//prompts the next action after the user has added an item
function afterAct() {
    inquirer.prompt([
        {
            type: "list",
            name: "afterAction",
            message: "What would you like to do next?",
            choices: ["Add another item", "View my cart or make changes to my cart", "Check out"]
        }
    ]).then(({ afterAction }) => {
        if (afterAction === "Add another item") {
            askProduct();
        }
        else if (afterAction === "View my cart or make changes to my cart") {
            showCart();
        }
        else if (afterAction === "Check out") {
            checkOut();
        }
    });
}

//prompts next action when viewing the cart
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

//function to remove items from cart if user doesn't want them - identifies index and name of the cart object in the array that matches the cart item name
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
        function getByName(array, name) {

            var result = array.filter(function (CartItem) { return CartItem.name === name; });

            return result ? result[0] : null; // or undefined

        }
        var indexToDelete = customerCart.indexOf(getByName(customerCart, itemDelete));
        var nameToBeDeleted = getByName(customerCart, itemDelete).name;
        checkDelete(indexToDelete, nameToBeDeleted);
    });
}

//asks user to confirm delete. If they don't want to, it returns to the cart.
function checkDelete(index, name) {
    inquirer.prompt([
        {
            type: "confirm",
            name: "deleteSure",
            message: "Are you sure you want to delete this item?"
        }
    ]).then(({ deleteSure }) => {
        if (deleteSure) {
            customerCart.splice(index, 1);
            console.log(chalk.blue("The item ") + chalk.magenta(name) + chalk.blue(" has been successfully removed from you cart."));
            showCart();
        }
        else {
            console.log(chalk.blue("Okay, we won't remove this item."));
            showCart();
        }
    });
}