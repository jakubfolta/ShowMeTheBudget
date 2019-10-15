////////////////////////////////////
//////// BUDGET CONTROLLER
////////////////////////////////////
"use strict";
const budgetController = (function() {

    const Expense = class {
		constructor (description, value, id) {

        	this.description = description;
        	this.value = value;
        	this.id = id;
        	this.percentage = -1;
		}

		calcPercentage = (totalIncome) => {
        	if (totalIncome > 0) {
            	this.percentage = Math.round((this.value / totalIncome) * 100);
        	} else {
				this.percentage = -1;
			}
    	}
	}

	const Income = class {
		constructor (description, value, id) {

            this.description = description;
        	this.value = value;
        	this.id = id;
		}
    }

    let data = {
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

    const calcTotals = type => {
        let sum = 0;

        data.allItems[type].forEach(cur => {
            sum += cur.value;
        });

        data.totals[type] = sum;
    };

    return {
        addItem: (type, des, val) => {
            let newItem, id;

            // Create new id
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            // Create new item based on its type
            if (type === 'inc') {
                newItem = new Income(des, val, id);
            } else if (type === 'exp') {
                newItem = new Expense(des, val, id);
            }

            // Push new item to data structure
            data.allItems[type].push(newItem);

            // Return new element
            return newItem;
        },

        deleteItem: (type, id) => {
            // Get index of item with searched id
            let index = data.allItems[type].findIndex(current => current.id === id);

            // Check if id is in the array and delete the item
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
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

        calculatePercentages: function() {
            data.allItems['exp'].forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            })

        },

        getBudget: function() {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        },

        getPercentages: function() {
            var percentages = data.allItems.exp.map(function(cur) {
                return cur.percentage;
            });
            return percentages;
        },

        // Local Storage
        saveDataStructureToLS: function() {
            localStorage.setItem('data', JSON.stringify(data));
        },

        loadDataStructure: function() {
            data = JSON.parse(localStorage.getItem('data'));
        },

        getIncExpCopies: function() {
            return {
                inc: data.allItems.inc,

				exp: data.allItems.exp
            }
        },

        resetIncExpArrays: function() {
            data.allItems.inc = [];
            data.allItems.exp = [];
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
        container: '.container',
        expensesPercentage: '.item__percentage',
        date: '.budget__date',
        clear: '.clear__btn'
    };

    // Function to loop over a node list
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
    };

    var formatNumber = function(number, type) {
        var numSplit, decimalNum, intNum;

        // Set absolute number
        number = Math.abs(number);

        // Get number with two decimal numbers
        number = number.toFixed(2);

        // Create comma separating numbers
        numSplit = number.split('.');

        decimalNum = numSplit[1];
        intNum = numSplit[0];

        if (intNum.length > 3) {
            intNum = intNum.substr(0, intNum.length - 3) + ',' + intNum.substr(intNum.length - 3, 3);
        }

        return (type === 'inc' ? '+' : '-') + ' ' + intNum + '.' + decimalNum;
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

            } else if (type === 'exp') {
                html = '<div class="item" id="exp-%id%"><div class="item__description">%description%</div><div class="item__value--expense"><div class="item__value">%value%</div><div class="item__percentage">28%</div></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-android-close"></i></button></div></div>';

                location = 'beforeend';
            }

            position = document.querySelector(DOMstrings.position);

            // Replace placeholder text with data
            newhtml = html.replace('%description%', obj.description);
            newhtml = newhtml.replace('%value%', formatNumber(obj.value, type));
            newhtml = newhtml.replace('%id%', obj.id);

            // Insert updated html into DOM
            position.insertAdjacentHTML(location, newhtml);
        },

        deleteListItem: function(elementID) {
            var item = document.getElementById(elementID);

            item.parentNode.removeChild(item);
        },

        deleteAllItems: function() {
            var container = document.querySelector(DOMstrings.container);

            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
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
            var type;

            (object.budget > 0) ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.income).textContent = formatNumber(object.totalInc, 'inc');
            document.querySelector(DOMstrings.expenses).textContent = formatNumber(object.totalExp, 'exp');
            document.querySelector(DOMstrings.budget).textContent = formatNumber(object.budget, type);

            if (object.percentage > 0) {
                document.querySelector(DOMstrings.percentage).textContent = object.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentage).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            var fields;

            // Select all percentages fields
            fields = document.querySelectorAll(DOMstrings.expensesPercentage);

            // Loop through all fields and add percentage value
            nodeListForEach(fields, function(cur, index) {
                if (percentages[index] > 0) {
                    cur.textContent = percentages[index] + '%';
                } else {
                    cur.textContent = '---'
                }
            })
        },

        changeType: function() {
            var inputs;

            inputs = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            nodeListForEach(inputs, function(current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.addButton).classList.toggle('red')
        },

        displayMonthYear: function() {
            var months, now, month, year;

            months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]

            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMstrings.date).textContent = months[month] + ' ' + year;
        },

        displayClearButton: function() {
            var listContainer = document.querySelector(DOMstrings.container);
            var clearButton = document.querySelector(DOMstrings.clear);

            clearButton.style.display = (listContainer.children.length > 0) ? 'block' : 'none';
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
        document.querySelector(DOM.clear).addEventListener('click', deleteAll);
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

    var updatePercentages = function() {
        var percentages;

        // Calculate percentages
        budgetCtrl.calculatePercentages();

        // Read percentages
        percentages = budgetCtrl.getPercentages();

        // Update percentages in the UI
        UICtrl.displayPercentages(percentages);
    };

    var updateLocalStorage = function() {

        // Save data structure to local storage
        budgetCtrl.saveDataStructureToLS();
    };

    var updateLocalData = function() {
        var budget, obj;

        // Update data structure from ls
        budgetCtrl.loadDataStructure();

        // Display budget
        budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
        obj = budgetCtrl.getIncExpCopies();

        // Create new Function constructor objects based on objects from local storage
        budgetCtrl.resetIncExpArrays();

        obj.inc.forEach(function(cur) {
            budgetCtrl.addItem('inc', cur.description, cur.value);
        });

        obj.exp.forEach(function(cur) {
            budgetCtrl.addItem('exp', cur.description, cur.value);
        });

        // Display list items
        obj.inc.forEach(function(cur) {
            UICtrl.addListItem(cur, 'inc');
        });

        obj.exp.forEach(function(cur) {
            UICtrl.addListItem(cur, 'exp');
        });

        // Display percentages
        updatePercentages();

        // Display clear all button
        UICtrl.displayClearButton();
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

            // Update percentages
            updatePercentages();

            // Update local storage
            updateLocalStorage();

            // Display clear all button
            UICtrl.displayClearButton();
        }
    };

    var deleteItem = function(event) {
        var id, splitID, type, ID;

        id = event.target.parentNode.parentNode.parentNode.id;

        if (id) {
            splitID = id.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Delete the item from the budget
            budgetCtrl.deleteItem(type, ID);

            // Delete the item from the UI
            UICtrl.deleteListItem(id);

            // Update and show the budget
            updateBudget();

            // Update percentages
            updatePercentages();

            // Update local storage
            updateLocalStorage();

            // Display clear all button
            UICtrl.displayClearButton();
        }
    };

    var deleteAll = function() {
        // Delete items from data structure
        budgetCtrl.resetIncExpArrays();

        // Delete items from UI
        UICtrl.deleteAllItems();

        // Update and show the budget
        updateBudget();

        // Update local storage
        updateLocalStorage();

        // Display clear all button
        UICtrl.displayClearButton();
    };

    return {
        init: function() {
            console.log('App has started');
            UICtrl.displayMonthYear();

            if (localStorage.getItem('data')) {
                updateLocalData();
            } else {
                UICtrl.displayBudget({
                    totalInc: 0,
                    totalExp: 0,
                    budget: 0,
                    percentage: -1
                });
            }
            setupEventListeners();
        }
    }
}(budgetController, UIController));

appController.init()