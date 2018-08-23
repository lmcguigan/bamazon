function CartItem(id, name, price, quantityDesired) {
    this.id = id;
    this.name = name;
    this.quantityDesired = quantityDesired;
    this.totalCost = parseFloat(price) * parseInt(quantityDesired);
}

module.exports = CartItem;