# BAMAZON Customer Node Application

## About this Application
This application utilizes the `mySQL` node package to communicate with a SQL database that stores information about the BAMAZON store's product inventory. The applictaion also uses the `inquirer` node package to assist with user input and the `chalk` and `figures` node package to stylize command line text. 

Users must supply their own user and password information for connection to the localhost.

## How to Use It
* Users access the application by typing `node bamazonCustomer.js` in the command line.
1. The application will print out a list of products from the BAMAZON database. Users as asked to select a product with the up or down arrow to scroll through the list of available products. 
2. Once the product has been selected, the user is asked to confirm
    * If the user selects "NO", the user will be asked once more the ID number of the product they wish to buy.
3. If the user confirms their selection, the user will be asked to input a quantity.
    * If the quantity is less than the available stock, the user will be asked to chose a smaller quanity.
    * If the quantity requested is available, the user will be asked what they want to do next:
        1. Add another item - returns user to prompt to select the ID of another product
        2. View or change cart - displays users cart, where users can choose to add another item, remove an item, or check out.
        3. Check out.
4. Checking out gives the user their total cost that their account will be charged, and removes the quantity from the database's stock. 

### Demo Video
Check out my demo video at: https://drive.google.com/file/d/1_r6gj84qQC4hd_LIUw4fjML7uDad-82M/view

### Get the Node Packages
* mySQL: https://www.npmjs.com/package/mysql
* inquirer: https://www.npmjs.com/package/inquirer
* chalk: https://www.npmjs.com/package/chalk
* figures: https://www.npmjs.com/search?q=figures