var menuChoices = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
function showMenuOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "Which would you like to do?",
            choices: productIDs
        }
    ]).then(({ menu }) => {
        if (menu === menuChoices[0]){

        }

    });
}