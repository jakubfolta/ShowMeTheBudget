////////////////////////////////////
//////// BUDGET CONTROLLER
////////////////////////////////////
var budgetController = (function() {

    var Expense = function(description, value, id) {
        this.description = description;
        this.value = value;
        this.id = id;
    };

    var Income = function(description, value, id) {
        this.description = description;
        this.value = value;
        this.id = id;
    };

    data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            var newItem, id;

            // Create new id
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            // Create new item based on its type
            if (type === 'inc') {
                newItem = new Income(des, val, id)
            } else {
                newItem = new Expense(des, val, id)
            }

            // Push new item to data structure
            data.allItems[type].push(newItem);

            // Return new element
            return newItem;
        },

        testing: function() {
            return data;
        }
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
        checkbox: '.checkbox',
        position: '.container'
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
                type: (document.querySelector(DOMstrings.checkbox).checked) ? 'exp' : 'inc'
            };
        },

        addListItem: function(obj, type) {
            var html, position, newhtml, location;

            // Create html string with placeholder text
            if (type === 'inc') {
                html = '<div class="item" id="inc-%id%"><div class="item__description">%description%</div><div class="item__value--income"><div class="item__value">%value%</div></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-android-close"></i></button></div></div>';

                location = 'afterbegin';
            } else {
                html = '<div class="item" id="exp-%id%"><div class="item__description">%description%</div><div class="item__value--expense"><div class="item__value">%value%</div><div class="item__percentage">28%</div></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-android-close"></i></button></div></div>';

                location = 'beforeend';
            }

            position = document.querySelector(DOMstrings.position);

            // Replace placeholder text with data
            newhtml = html.replace('%description%', obj.description);
            newhtml = newhtml.replace('%value%', obj.value);
            newhtml = newhtml.replace('%id%', obj.id);

            // Insert updated html into DOM
            position.insertAdjacentHTML(location, newhtml);
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
                addItem();
            };
        });

        document.querySelector('.checkbox').addEventListener('change', UICtrl.changeType);
    };

    var addItem = function() {
        var input, newItem;

        console.log('Button pressed!');
        // Get the filled input data.
        input = UICtrl.getInput();

        // Add item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
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