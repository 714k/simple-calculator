angular.module('simpleCalculatorApp', [])
.controller('simpleCalculatorCtrl', ['$scope', function($scope){
var title = 'simpleCalculator',
    memory_length = 0,
    memory_str = '',
    max_display_memory = 50,
    last_char = null,
    last_visible_char = null,

    operator_prev = null,
    hasOperator = false,
    operator_entries = 0,
    operator_token = null,

    int_entries = 0,
    int_str = '',
    max_int_entries = 9,

    dec_entries = 0,
    decimal_str = '',
    is_decimal = false,
    decimal_point = '.',
    has_decimal_point = false,
    max_dec_entries = 9,

    format_number = null,
    operation_str = '',
    operation_end = false,
    amount_a = null,
    amount_b = null,
    amounts_separator = ' ',
    amount_undefined = true,
    subtotal = 0,
    total = 0,
    total_str = '',
    max_display_total = 9,

    showMessage = function (message, warning) {
      $scope.app.displayWarning = warning;
      $scope.app.title = message;
    },
    displayOperation = function (memory, total, concat) {
        if (format_number === true) {
            total = formatNumber(total);
        }

        $scope.app.memoryDisplay = memory;

        if (concat) {
            $scope.app.totalDisplay += total;
        }else{
            $scope.app.totalDisplay = total;
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
            memory_str += int;
            operation_str += int;
            displayOperation(memory_str, int_str, false);
            int_entries ++;
            memory_length ++;
            // showLog('addInteger', null, null);
        }else{
            // displayOperation(memory_str, subtotal, false);
            showMessage('Integer Limit Exceeded', true);
        }
    },
    addDecimal = function(dec){
        if (dec_entries < max_dec_entries) {
            decimal_str += dec;
            memory_str += dec;
            operation_str += dec;
            displayOperation(memory_str, int_str + decimal_point + decimal_str, false);
            dec_entries ++;
            memory_length ++;
            // showLog('addDecimal', null, null);
        }else{
            // displayOperation(memory_str, subtotal, false);
            showMessage('Decimal Limit Exceeded', true);
        }
    },
    calculateSubtotal = function () {
        amount_a = Number(operation_str.split(amounts_separator)[0]);
        operator_token = operation_str.split(amounts_separator)[1];
        amount_b = Number(operation_str.split(amounts_separator)[2]);

        if (typeof operation_str.split(amounts_separator)[2] != 'undefined' ) {
            switch (operator_token) {
                case '+':
                    subtotal = amount_a + amount_b;
                break;
                case '-':
                    subtotal = amount_a - amount_b;
                break;
                case '×':
                    subtotal = amount_a * amount_b;
                break;
                case '÷':
                    subtotal = amount_a / amount_b;
                break;
                default:
            }
            // console.log('operation_str: ', operation_str);
            // console.log('operator_token: ', operator_token);
            // console.log('operation_str[0]: ', operation_str.split(amounts_separator)[0]);
            // console.log('operation_str[1]: ', operation_str.split(amounts_separator)[1]);
            // console.log('operation_str[2]: ', operation_str.split(amounts_separator)[2]);
            // console.log('amount_a: ', amount_a);
            // console.log('amount_b: ', amount_b);
            // console.log('subtotal: ', subtotal);
            // operator_entries = 0;
            operation_str = subtotal.toString();
        }else{
            subtotal = amount_a;
        }

        subtotal = formatNumber(subtotal);
    },
    formatNumber = function(number) {
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

$scope.$watch('app.totalDisplay.length', function (length) {
    if (length >= max_display_total) {
        $scope.app.sizeTotal = 'small';
    }else{
        $scope.app.sizeTotal = null;
    }
});

$scope.$watch('app.memoryDisplay.length', function (length) {
    if (length >= max_display_memory) {
        $scope.app.sizeMemory = 'small';
    }else{
        $scope.app.sizeMemory = null;
    }
});

$scope.app = {
    title: 'simpleCalculator',
    warning: null,
    sizeMemory: null,
    memoryDisplay: '',
    sizeTotal: null,
    totalDisplay: '0',
    // clearEntry: function(){
    //     last_char = memory_str.substr(memory_length - 1); 
    //     memory_str = memory_str.substr(0, memory_length - 1);
    //     total_display_str = $scope.app.totalDisplay.substr(0, $scope.app.totalDisplay.length - 1);
    //     console.log('memory_str:', memory_str);
    //     console.log('substr:', memory_str.substr(0, memory_length - 1));
    //     console.log('memory_length:', memory_length);

    //     // $scope.app.memoryDisplay = memory_str;
    //     // $scope.app.totalDisplay = memory_str;
    //     // if (amount_b == null) {
    //     //     displayOperation(memory_str, memory_str, false);
    //     // }else{
    //     // }
    //     displayOperation(memory_str, total_display_str, false);

    //     operation_str = operation_str.substr(0, operation_str.length - 1);
    //     memory_length --;

    //     if (has_decimal_point) {
    //         decimal_str = decimal_str.substr(0, decimal_str.length - 2);
    //         dec_entries --;
    //         if (last_char == '.') {
    //             has_decimal_point = false;
    //         }
    //     }else{
    //         int_str = int_str.substr(0, int_entries - 1);
    //         int_entries --;
    //     }

    // },
    clearAll: function(){
        showMessage(title, false);
        operation_end = false;
        operator_prev = null;
        hasOperator = false;
        operator_token = null;
        operation_str = '';
        int_str = '';
        int_entries = 0;

        is_decimal = false;
        dec_entries = 0;
        decimal_str = '';

        last_char = null;
        last_visible_char = null;

        total = 0;

        memory_str = '';
        memory_length = 0;

        $scope.app.totalDisplay = 0;
        $scope.app.memoryDisplay = memory_str;
        $scope.app.sizeTotal = null;
        $scope.app.sizeMemory = null;

        // showLog('CLEAR');
    },
    addEntry: function(entry){
        if (memory_length < max_display_memory) {
            hasOperator = false;
            operator_prev = null;
            format_number = true;
            checkOperation();

            if (is_decimal) {
                addDecimal(entry);
            }else{
                addInteger(entry);
            }
        }else{
            showMessage('Memory Length Exceeded', true)
        }
    },
    addDecimalPoint: function(){
        format_number = false;
        if (memory_length < max_display_memory) {
            checkOperation();
            last_char = memory_str.charAt(memory_length-1);
            last_visible_char = memory_str.charAt(memory_length-2);
            if (is_decimal === false) {
                has_decimal_point = true;
                is_decimal = true;
                showMessage(title, false);
                memory_str += decimal_point;
                operation_str += decimal_point;
                displayOperation(memory_str, decimal_point, true);
                memory_length++;
            }
            // showLog('ADD DECIMAL POINT', 'decimal', '.');
        }else {
            showMessage('Memory Length Exceeded', true);
        }
    },
    addOperator: function(operator){
        showMessage(title, false);
        operation_end = false;
        format_number = false;
        if (operator_prev !== operator) {

            if (memory_length < max_display_memory) {
                is_decimal = false;
                int_entries = 0;
                int_str = '';
                dec_entries = 0;
                decimal_str = '';


                if (hasOperator === false) {
                    calculateSubtotal();
                    operation_str += amounts_separator + operator + amounts_separator;
                    hasOperator = true;
                    memory_str += operator;
                    operator_entries++;
                    displayOperation(memory_str, operator, false);
                    operator_prev = operator;
                    memory_length ++;
                }else{
                    memory_str = memory_str.substr(0, memory_str.length - 1);
                    memory_str += operator;
                    operation_str = operation_str.substr(0, operation_str.length - 2) + operator + amounts_separator;
                    displayOperation(memory_str, operator, false);
                    operator_prev = operator;
                }
                // console.log('operation_str: ', operation_str);
                // console.log('---------------------------------------');
            }else{
                // showMessage($scope.app.title);
                showMessage('Memory Length Exceeded', true);
            }
        }
        // displayOperation(memory_str, subtotal, false);
        // showLog('ADD OPERATOR', 'operator_token', operator_token);
    },
    calculate: function(){
        if (memory_length < max_display_memory) {
            if (operator_prev !== '/' && operator_prev !== '*' && operator_prev !== '+' && operator_prev !== '-'/* && operator_token !== null*/) {
                calculateSubtotal();
                displayOperation(memory_str + ' = ' + subtotal, subtotal, false);

                // console.log('operator_token: ', operator_token);
                // console.log('memory_str: ', memory_str);
                // console.log('operation_str: ', operation_str);
                // console.log('subtotal: ', subtotal);
                operation_end = true;
                return;
                    // calculate();
                    total = (new Function('return ' + memory_str))();
                    // parseAmount();
                    // console.log('memory_str: ', memory_str);
                    // console.log('total: ', total);
                    // return;

                    var is_decimal_amount = total.toString().match(/\./g);

                    if (is_decimal_amount) {
                        total_str = total.toFixed(2).toString();
                    }else{
                      total_str = total.toString();
                    }

                    displayOperation(memory_str + '=' + total_str, total_str, false);

                    memory_str = total;
                    memory_length = total.length;
                    // current_amount = 0;
                    operator_token = null;
            }
        }else{
            // displayOperation(memory_str + '=' + total_str, total_str, false);
            displayOperation(memory_str, subtotal, false);
            showMessage('Memory Length Exceeded', true);
        }
    }

};

}]);
