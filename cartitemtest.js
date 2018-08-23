const mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

function CartItem(id, name, price, quantityDesired) {
    this.id = id;
    this.name = name;
    this.quantityDesired = quantityDesired;
    this.totalCost = parseFloat(price) * parseInt(quantityDesired);
    this.inStock = true;
    this.checkStock = function () {
        connection.query("SELECT * FROM products WHERE item_id = ?", [this.id], function (err, res) {
            if (err) throw err;
            var availableQ = res[0].stock_quantity;
            console.log(availableQ);
            if (availableQ < this.quantityDesired) {
                this.inStock = false;
            }
        }).then(function () {
            if (availableQ < this.quantityDesired) {
                this.inStock = false;
            }
        });

    };
    this.pullStock = function () {

    };
}
var thisItem = new CartItem("C78B79", "Alfalfa Cube Treats, 15oz.", "9.99", 8);
console.log(thisItem.inStock);
thisItem.checkStock();
console.log
module.exports = CartItem;