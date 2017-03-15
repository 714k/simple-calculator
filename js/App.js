angular.module('simpleCalculatorApp', [])
.controller('simpleCalculatorCtrl', ['$scope', function($scope){
var title = 'simpleCalculator',
    mem_len = 0,
    mem_str = '',
    max_display_mem = 60,
    full_mem = '',

    prev_operator = null,
    has_operator = false,
    operator_entries = 0,
    operator_token = null,

    int_entries = 0,
    int_str = '',
    max_int_entries = 12,

    dec_entries = 0,
    dec_str = '',
    is_dec = false,
    dec_point = '.',
    has_dec_point = false,
    max_dec_entries = 9,

    is_num = null,
    operation_str = '',
    operation_end = false,
    amount_a = null,
    amount_b = null,
    operation_sep = ' ',
    amount_undefined = true,
    total = 0,

    showMessage = function (message, warning) {
          $scope.app.warning = warning;
          $scope.app.title = message;
    },
    displayOperation = function (mem_display, total_display, concat) {
        if (is_num === true) {
            total_display = formatNumber(total_display);
        }

        $scope.app.memoryDisplay = mem_display;

        if (concat) {
            $scope.app.totalDisplay += total_display;
        }else{
            $scope.app.totalDisplay = total_display;
        }
    },
    checkOperation = function(){
      if (operation_end === true) {
        $scope.app.clearAll();
      }
    },
    addInteger = function(int){
        if (int_entries < max_int_entries) {
            int_str += int;
            mem_str += int;
            operation_str += int;
            displayOperation(mem_str, int_str, false);
            int_entries ++;
            mem_len ++;
        }else{
            showMessage('Integer Limit Exceeded', true);
        }
    },
    addDecimal = function(dec){
        if (dec_entries < max_dec_entries) {
            dec_str += dec;
            mem_str += dec;
            operation_str += dec;
            displayOperation(mem_str, int_str + dec_point + dec_str, false);
            dec_entries ++;
            mem_len ++;
        }else{
            showMessage('Decimal Limit Exceeded', true);
        }
    },
    calculateSubtotal = function () {
        amount_a = Number(operation_str.split(operation_sep)[0]);
        operator_token = operation_str.split(operation_sep)[1];
        amount_b = Number(operation_str.split(operation_sep)[2]);

        if (typeof operation_str.split(operation_sep)[2] != 'undefined' ) {
            switch (operator_token) {
                case '+':
                    total = amount_a + amount_b;
                break;
                case '-':
                    total = amount_a - amount_b;
                break;
                case '×':
                    total = amount_a * amount_b;
                break;
                case '÷':
                    total = amount_a / amount_b;
                break;
                default:
            }
            operation_str = total.toString();
        }else{
            total = amount_a;
        }

        total = formatNumber(total);
    },
    formatNumber = function(number) {
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    $scope.$watch('app.totalDisplay.length', function (len) {
        if (len >= max_int_entries) {
            $scope.app.sizeTotal = 'small';
        }else{
            $scope.app.sizeTotal = null;
        }
    });

    $scope.$watch('app.memoryDisplay.length', function (len) {
        if (len >= max_display_mem) {
            $scope.app.sizeMemory = 'small';
        }else{
            $scope.app.sizeMemory = null;
        }
    });

$scope.app = {
    title: title,
    warning: null,
    sizeMemory: null,
    memoryDisplay: '',
    sizeTotal: null,
    totalDisplay: '0',
    clearAll: function(){
        showMessage(title, false);
        operation_end = false;
        prev_operator = null;
        has_operator = false;
        operator_token = null;
        operation_str = '';
        int_str = '';
        int_entries = 0;

        is_dec = false;
        dec_entries = 0;
        dec_str = '';

        mem_str = '';
        mem_len = 0;
        total = 0;

        $scope.app.totalDisplay = 0;
        $scope.app.memoryDisplay = mem_str;
        $scope.app.sizeTotal = null;
        $scope.app.sizeMemory = null;
    },
    addEntry: function(entry){
        if (mem_len < max_display_mem) {
            has_operator = false;
            prev_operator = null;
            is_num = true;
            checkOperation();

            if (is_dec) {
                addDecimal(entry);
            }else{
                addInteger(entry);
            }
        }else{
            showMessage('Memory Length Exceeded', true)
        }
    },
    addDecimalPoint: function(){
        is_num = false;
        if (mem_len < max_display_mem) {
            checkOperation();
            if (is_dec === false) {
                has_dec_point = true;
                is_dec = true;
                showMessage(title, false);
                mem_str += dec_point;
                operation_str += dec_point;
                if (!has_operator) {
                    displayOperation(mem_str, dec_point, true);
                }else{
                    displayOperation(mem_str, dec_point, false);
                }
                mem_len++;
            }
        }else {
            showMessage('Memory Length Exceeded', true);
        }
    },
    addOperator: function(operator){
        showMessage(title, false);
        operation_end = false;
        is_num = false;
        if (prev_operator !== operator) {

            if (mem_len < max_display_mem) {
                is_dec = false;
                int_entries = 0;
                int_str = '';
                dec_entries = 0;
                dec_str = '';

                if (has_operator === false) {
                    calculateSubtotal();
                    operation_str += operation_sep + operator + operation_sep;
                    has_operator = true;
                    mem_str += operator;
                    operator_entries++;
                    displayOperation(mem_str, operator, false);
                    prev_operator = operator;
                    mem_len ++;
                }else{
                    mem_str = mem_str.substr(0, mem_str.length - 1);
                    mem_str += operator;
                    operation_str = operation_str.substr(0, operation_str.length - 2) + operator + operation_sep;
                    displayOperation(mem_str, operator, false);
                    prev_operator = operator;
                }
            }else{
                showMessage('Memory Length Exceeded', true);
            }
        }
    },
    calculate: function(){
        if (mem_len < max_display_mem) {
            if (prev_operator === null) {
                calculateSubtotal();
                full_mem = mem_str + ' = ' + total;
                displayOperation(full_mem, total, false);
                operation_end = true;
            }
        }else{
            calculateSubtotal();
            displayOperation(full_mem, total, false);
            showMessage('Memory Length Exceeded', true);
        }
    }

};

}]);
