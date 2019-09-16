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
        },
        budget: 0,
        percentage: -1
    };

    calcTotals = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        })
        data.totals[type] = sum;
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

        deleteItem: function(type, id) {
            var ids, index;

            // Create new array with all ids of items
            ids = data.allItems[type].map(function(current) {
                return current.id
            });

            // Get index of item with searched id
            index = ids.indexOf(id);

            // Delete item from data structure which has given id
            data.allItems[type][index];

            // Check if id is in the array
            if (index !== -1) {
                data.allItems[type][index].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // Calculate totals
            calcTotals('inc');
            calcTotals('exp');

            // Calculate budget
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate percentages
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
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
        position: '.container',
        income: '.budget__income--value',
        expenses: '.budget__expenses--value',
        percentage: '.budget__expenses--percentage',
        budget: '.budget__value',
        container: '.container'
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

        clearFields: function() {
            var fields, fieldsArray;

            // Select elements to clear
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);

            // Loop over an array and focus on item description
            fieldsArray.forEach(function(cur, index, array) {
                cur.value = '';
            })

            fieldsArray[0].focus();
        },

        displayBudget: function(object) {

            document.querySelector(DOMstrings.income).textContent = object.totalInc;
            document.querySelector(DOMstrings.expenses).textContent = object.totalExp;
            document.querySelector(DOMstrings.budget).textContent = object.budget;

            if (object.percentage > 0) {
                document.querySelector(DOMstrings.percentage).textContent = object.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentage).textContent = '---';
            }
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

        document.querySelector(DOM.container).addEventListener('click', deleteItem);
        document.querySelector(DOM.checkbox).addEventListener('change', UICtrl.changeType);
    };

    var updateBudget = function() {
        var budget;

        // Calculate the budget
        budgetCtrl.calculateBudget();

        // Return the budget
        budget = budgetCtrl.getBudget();

        // Display the budget on the UI
        UIController.displayBudget(budget);
    };

    var addItem = function() {
        var input, newItem;

        // Get the filled input data.
        input = UICtrl.getInput();

        if (input.description && !isNaN(input.value) && input.value > 0) {
            // Add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // Clear fields and focus
            UICtrl.clearFields();

            // Update budget
            updateBudget();
        }
    };

    var deleteItem = function(event) {
        var id, splitID;

        id = event.target.parentNode.parentNode.parentNode.id;

        if (id) {
            splitID = id.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Delete the item from the budget
            budgetCtrl.deleteItem(type, ID);

            // Delete the item from the UI

            // Update the budget

            // Display the budget
        }
    };



    return {
        init: function() {
            console.log('App has started');
            UICtrl.displayBudget({
                totalInc: 0,
                totalExp: 0,
                percentage: '---',
                budget: 0
            });

            setupEventListeners();
        }
    };
}(budgetController, UIController));

appController.init()