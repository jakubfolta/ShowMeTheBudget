////////////////////////////////////
//////// BUDGET CONTROLLER
////////////////////////////////////
var budgetController = (function() {


    return {

    };
}());








////////////////////////////////////
//////// UI CONTROLLER
////////////////////////////////////
var UIController = (function() {

    var DOMstrings = {
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
    };

    return {
    getInput = function() {
        return {
            description: document.querySelector(DOMstrings.inputDescription).value;
            value: document.querySelector(DOMstrings.inputValue).value;
            //////////////////////////////////////////////////////////////////    Add Type of item
            type:
    }

    getDOMstrings: function() {
        return DOMstrings;
    };

};
}());


////////////////////////////////////
//////// APP CONTROLLER
////////////////////////////////////
var appController = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.addButton).addEventListener('click', addItem);

        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                console.log('Enter')
            };
        });
    };

    var addItem = function() {
        console.log('Button pressed!');
        // Get the filled input data.
        UICtrl.getInput();

        // Add item to the budget controller

        // Add the item to the UI

        // Calculate the budget

        // Display the budget on the UI
    }



    return {
        init: function() {
            setupEventListeners();
            console.log('App has started');
    };
};
}(budgetController, UIController));

appController.init()