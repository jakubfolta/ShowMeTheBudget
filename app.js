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
        checkbox: '.checkbox'
    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
    };

    return {
        getInput: function() {
            return {
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
                //////////////////////////////////////////////////////////////////    Add Type of item
                type: (document.querySelector(DOMstrings.checkbox).checked) ? 'exp' : 'inc'
            };
        },

        changeType: function() {
            var inputs;

            inputs = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            nodeListForEach(inputs, function(current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.addButton).classList.toggle('red')
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();


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

        document.querySelector('.checkbox').addEventListener('change', UICtrl.changeType);
    };

    var addItem = function() {
        var input;

        console.log('Button pressed!');
        // Get the filled input data.
        input = UICtrl.getInput();
        console.log(input);

        // Add item to the budget controller

        // Add the item to the UI

        // Calculate the budget

        // Display the budget on the UI
    }



    return {
        init: function() {
            setupEventListeners();
            console.log('App has started');
        }
    };
}(budgetController, UIController));

appController.init()