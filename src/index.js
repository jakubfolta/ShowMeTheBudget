import axios from 'axios';
import './sass/main.scss';
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

		calcPercentage(totalIncome) {
        	if (totalIncome > 0) {
            	this.percentage = Math.round((this.value / totalIncome) * 100);
        	} else {
				this.percentage = -1;
			}
    	}
	};

	const Income = class {
		constructor (description, value, id) {
            this.description = description;
        	this.value = value;
        	this.id = id;
		}
    };

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
        percentage: -1,
        date: new Date().getDay(),
        quote: '---'
    };

    const calcTotals = type => {
        let sum = 0;

        data.allItems[type].forEach(cur => {
            sum += cur.value;
        });

        data.totals[type] = sum;
    };

    const getQuote = async () => {
        const url = 'https://quotable-quotes.p.rapidapi.com/randomQuotes';

        try {
            const result = await axios(`${url}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "quotable-quotes.p.rapidapi.com",
                    "x-rapidapi-key": "c39604baadmshcabd6e32bb7d9c0p1e3b1fjsnb9154a318acd"
                }
            })

            const resultQuote = result.data.quote;
            console.log(resultQuote);
            return resultQuote;

        } catch(err) {
            console.log(`Something went wrong => ${err}`);
        }
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

        calculateBudget: () => {
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

        calculatePercentages: () => data.allItems['exp'].forEach(cur => cur.calcPercentage(data.totals.inc)),

        getBudget: () => {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        },

        getPercentages: () => data.allItems.exp.map(cur => cur.percentage),

        saveQuote: async () => {
            const result = await getQuote();

            data.quote = result;
            console.log(data);
            return result;
        },

        // Local Storage
        saveDataStructureToLS: () => localStorage.setItem('data', JSON.stringify(data)),

        loadDataStructure: () => data = JSON.parse(localStorage.getItem('data')),

        getIncExpCopies: () => {
            return {
                inc: data.allItems.inc,
                exp: data.allItems.exp
            }
        },

        resetIncExpArrays: () => {
            data.allItems.inc = [];
            data.allItems.exp = [];
        },

        testing: () => data
    };
}());

////////////////////////////////////
//////// UI CONTROLLER
////////////////////////////////////
const UIController = (function() {

    const DOMstrings = {
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
        clear: '.clear__btn',
        quote: '.quote'
    };

    // Function to loop over a node list ES5
    // const nodeListForEach = (list, callback) => {
    //     for (let i = 0; i < list.length; i++) {
    //         callback(list[i], i)
    //     }
    // };

    const formatNumber = (number, type) => {
        let numSplit, decimalNum, intNum;

        // Set absolute number
        number = Math.abs(number);

        // Get number with two decimal numbers
        number = number.toFixed(2);

        // Create comma separating numbers
        numSplit = number.split('.');

        decimalNum = numSplit[1];
        intNum = numSplit[0];

        if (intNum.length > 3) {
            intNum = `${intNum.substr(0, intNum.length - 3)},${intNum.substr(intNum.length - 3, 3)}`;
        }

        return `${(type === 'inc' ? '+' : '-')} ${intNum}.${decimalNum}`;
    };

    return {
        getInput: () => {
            return {
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
                type: (document.querySelector(DOMstrings.checkbox).checked) ? 'exp' : 'inc'
            };
        },

        addListItem: (obj, type) => {
            let html, newhtml, location;

            // Create html string with placeholder text
            if (type === 'inc') {
                html = '<div class="item" id="inc-%id%"><div class="item__description">%description%</div><div class="item__value--income"><div class="item__value">%value%</div></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-android-close"></i></button></div></div>';

                location = 'afterbegin';

            } else if (type === 'exp') {
                html = '<div class="item" id="exp-%id%"><div class="item__description">%description%</div><div class="item__value--expense"><div class="item__value">%value%</div><div class="item__percentage">28%</div></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-android-close"></i></button></div></div>';

                location = 'beforeend';
            }

            const position = document.querySelector(DOMstrings.position);

            // Replace placeholder text with data
            newhtml = html.replace('%description%', obj.description);
            newhtml = newhtml.replace('%value%', formatNumber(obj.value, type));
            newhtml = newhtml.replace('%id%', obj.id);

            // Insert updated html into DOM
            position.insertAdjacentHTML(location, newhtml);
        },

        deleteListItem: elementID => {
            const item = document.getElementById(elementID);

            item.parentNode.removeChild(item);
        },

        deleteAllItems: () => {
            const container = document.querySelector(DOMstrings.container);

            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        },

        clearFields: () => {
            // Select elements to clear
            const fields = Array.from(document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`));

            // ES5
            // fieldsArray = Array.prototype.slice.call(fields);

            // Loop over an array and focus on item description
            fields.forEach(cur => cur.value = '');
            fields[0].focus();
        },

        displayBudget: object => {
            let type;
            const {totalInc, totalExp, budget, percentage} = object;

            (budget > 0) ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.income).textContent = formatNumber(totalInc, 'inc');
            document.querySelector(DOMstrings.expenses).textContent = formatNumber(totalExp, 'exp');
            document.querySelector(DOMstrings.budget).textContent = formatNumber(budget, type);

            if (percentage > 0) {
                document.querySelector(DOMstrings.percentage).textContent = `${percentage}%`;
            } else {
                document.querySelector(DOMstrings.percentage).textContent = '---';
            }
        },

        displayPercentages: percentages => {
            // Select all percentages fields
            const fields = Array.from(document.querySelectorAll(DOMstrings.expensesPercentage));

            // Loop through all fields and add percentage value ES6
            fields.forEach((cur, index) => {
                if (percentages[index] > 0) {
                    cur.textContent = percentages[index] + '%';
                } else {
                    cur.textContent = '---'
                }
            })

            // Loop through all fields and add percentage value ES5
            // nodeListForEach(fields, function(cur, index) {
            //     if (percentages[index] > 0) {
            //         cur.textContent = percentages[index] + '%';
            //     } else {
            //         cur.textContent = '---'
            //     }
            // })
        },

        changeType: () => {

            const inputs = Array.from(document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`));

            inputs.forEach(cur => cur.classList.toggle('red-focus'));

            //ES5
            // nodeListForEach(inputs, function(current) {
            //     current.classList.toggle('red-focus');
            // });

            document.querySelector(DOMstrings.addButton).classList.toggle('red')
        },

        displayMonthYear: () => {

            const months = [
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

            const now = new Date();
            const month = now.getMonth();
            const year = now.getFullYear();

            document.querySelector(DOMstrings.date).textContent = `${months[month]} ${year}`;
        },

        displayQuote: quote => {

        },

        displayClearButton: () => {
            const listContainer = document.querySelector(DOMstrings.container);
            const clearButton = document.querySelector(DOMstrings.clear);

            clearButton.style.display = (listContainer.children.length > 0) ? 'block' : 'none';
        },

        getDOMstrings: () => DOMstrings
    };
})();


////////////////////////////////////
//////// APP CONTROLLER
////////////////////////////////////
const appController = (function(budgetCtrl, UICtrl) {

    const setupEventListeners = () => {
        const DOM = UICtrl.getDOMstrings();

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

    const updateBudget = () => {
        // Calculate the budget
        budgetCtrl.calculateBudget();

        // Return the budget
        const budget = budgetCtrl.getBudget();

        // Display the budget on the UI
        UIController.displayBudget(budget);
    };

    const updatePercentages = () => {
        // Calculate percentages
        budgetCtrl.calculatePercentages();

        // Read percentages
        const percentages = budgetCtrl.getPercentages();

        // Update percentages in the UI
        UICtrl.displayPercentages(percentages);
    };

    // Save data structure to local storage
    const updateLocalStorage = () => budgetCtrl.saveDataStructureToLS();

    const updateLocalData = () => {
        // Update data structure from ls
        budgetCtrl.loadDataStructure();

        // Display budget
        const budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);

        const{inc, exp} = budgetCtrl.getIncExpCopies();

        // Create new class objects based on objects from local storage
        budgetCtrl.resetIncExpArrays();

        inc.forEach(cur => budgetCtrl.addItem('inc', cur.description, cur.value));

        exp.forEach(cur => budgetCtrl.addItem('exp', cur.description, cur.value));

        // Display list items
        inc.forEach(cur => UICtrl.addListItem(cur, 'inc'));

        exp.forEach(cur => UICtrl.addListItem(cur, 'exp'));

        // Display percentages
        updatePercentages();

        // Display quote
        UICtrl.displayQuote();

        // Display clear all button
        UICtrl.displayClearButton();
    };

    const updateQuote = () => {
        // Get new quote from API and save it to data structure
        const quote = budgetCtrl.saveQuote();

        // Display quote
        UICtrl.displayQuote(quote);

        // Update local storage
        updateLocalStorage();
    };

    const addItem = () => {
        // Get the filled input data.
        const {description, value, type} = UICtrl.getInput();

        if (description && !isNaN(value) && value > 0) {
            // Add item to the budget controller
            const newItem = budgetCtrl.addItem(type, description, value);

            // Add the item to the UI
            UICtrl.addListItem(newItem, type);

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

    const deleteItem = event => {

        const id = event.target.parentNode.parentNode.parentNode.id;

        if (id) {
            const splitID = id.split('-');
            const type = splitID[0];
            const ID = parseInt(splitID[1]);

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

    const deleteAll = () => {
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
        init: () => {
            console.log('App has started');
            // console.log(budgetCtrl.testing());
            budgetCtrl.saveQuote();


            // console.log(budgetCtrl.testing());

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

appController.init();




























