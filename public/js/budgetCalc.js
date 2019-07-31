// BUDGET CONTROLLER
const budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(item => {
            sum += item.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, description, value) {
            let newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

            } else {
                ID = 0;
            }

            if (type === "exp") {
                newItem = new Expense(ID, description, value);
            } else if (type === "inc") {
                newItem = new Income(ID, description, value);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;            

            ids = data.allItems[type].map(function(current) {                
                return current.id;
            });
                    
            index = ids.indexOf(id);                        

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // Calculate totals for inc and exp
            calculateTotal("inc");
            calculateTotal("exp");

            // Calculate the budget, inc - exp
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);            
            } else {
                data.percentage = -1;
            }

        }, 

        calculatePercentages: function() {
            data.allItems.exp.forEach(expense => {
                expense.calcPercentage(data.totals.inc);
            }); 
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        getPercentages: function() {
            var percentages = data.allItems.exp.map(expense => {
                return expense.getPercentage();
            });
            return percentages;
        },

        testing: function() {
            return data;
        }
    }

})();

// UI CONTROLLER
const UIController = (function () {

    const DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeList: ".income__list",
        expensesList: ".expenses__list",
        budgetIncomeValue: ".budget__income--value",
        budgetExpensesValue: ".budget__expenses--value",
        budgetValue: ".budget__value",
        percentageValue: ".budget__expenses--percentage",
        container: ".container",
        expensesPercentage: ".item__percentage",
        budgetTitleMonth: ".budget__title--month",
        checkmarkButton: ".ion-ios-checkmark-outline"
    };

    const formatNumber = function(number, type) {
        var num, splitNum, int, dec;

        num = Math.abs(number).toFixed(2);

        splitNum = num.split(".");

        int = splitNum[0];
        dec = splitNum[1];

        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
        }

        return((type === "exp" ? "-" : "+") + " " + int + "." + dec);
    };

    const nodeListForEach = function(list, callback) {
        for(var i=0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function (object, type) {
            var html, newHtml, element;

            // Add html with placeholder texts
            if (type === "inc") {
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            } else if (type === "exp") {
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div>  <div class="item__delete">  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }
            newHtml = html.replace("%id%", object.id).replace("%description%", object.description).replace("%value%", formatNumber(object.value, type));

            // Insert html into index file as the last child of inc/exp container
            if (type === "inc") {
                element = DOMstrings.incomeList;

            } else if (type === "exp") {
                element = DOMstrings.expensesList;
            }
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            const selection = document.getElementById(selectorID);
            selection.parentNode.removeChild(selection);
        },

        clearHTMLFields: function () {
            var fieldsArr;

            const fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(element => {
                element.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function (object) {
            document.querySelector(DOMstrings.budgetIncomeValue).textContent = formatNumber(object.totalInc, "inc");
            document.querySelector(DOMstrings.budgetExpensesValue).textContent = formatNumber(object.totalExp, "exp");
            document.querySelector(DOMstrings.budgetValue).textContent = formatNumber(object.budget, (object.budget >= 0 ? "inc" : "exp"));
            if(object.percentage > 0) {
                document.querySelector(DOMstrings.percentageValue).textContent = object.percentage + " %";
            } else {
                document.querySelector(DOMstrings.percentageValue).textContent = "---";
            }
        },

        displayPercentages: function(percentages) {
            const fields = document.querySelectorAll(DOMstrings.expensesPercentage);

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + " %";
                } else {
                    current.textContent = "---"; 
                }
                
            });
        },

        displayMonth: function() {
            const now = new Date();
            const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            
            document.querySelector(DOMstrings.budgetTitleMonth).innerHTML = months[now.getMonth()] + " " + now.getFullYear();
        },

        changedType: function() {
            const fields = document.querySelectorAll(DOMstrings.inputType + ", " + DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

            nodeListForEach(fields, function(field) {
                field.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.checkmarkButton).classList.toggle('red');

        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    }

})();


// GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {

    const setupEventListeners = function () {

        const DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function (event) {
            if (event.charCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });

        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changedType);
    };

    const updateBudget = function() {
        // Calculate budget
        budgetCtrl.calculateBudget();

        // Return and display the budget
        UICtrl.displayBudget(budgetCtrl.getBudget());
    };

    function updatePercentage() {
        // Calculate percentages
        budgetCtrl.calculatePercentages();

        // Read the percentages from the budget controller
        const percentages = budgetCtrl.getPercentages();

        // Return and display the budget
        UICtrl.displayPercentages(percentages);
        
    };

    function ctrlAddItem() {

        // Get new entry from the user
        const input = UICtrl.getInput();

        if (input.description !== "" && input.value > 0 && !isNaN(input.value)) {

            // Add item to the array of items
            const newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            UICtrl.clearHTMLFields();

            // Add html for a new item
            UICtrl.addListItem(newItem, input.type)

            // Update budget
            updateBudget();

            // Update percentages
            updatePercentage();

        }

    };

    const ctrlDeleteItem = function(event) {
        var splitID, type, ID;

        const itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID) {
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }

        // Delete the html element       
        budgetCtrl.deleteItem(type, ID);

        // Update data object in the UI
        UIController.deleteListItem(itemID);

        // Update displayed budget
        updateBudget();

        // Update percentages
        updatePercentage();
        
    };

    return {
        init: function () {
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setupEventListeners();
        }
    }


})(budgetController, UIController);

controller.init();