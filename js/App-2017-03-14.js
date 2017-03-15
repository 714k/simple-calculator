angular.module('simpleCalculatorApp', [])
.controller('simpleCalculatorCtrl', ['$scope', function($scope){
var title = 'simpleCalculator',
    memory_length = 0,
    memory_str = '',
    max_display_memory = 30,
    last_char = null,
    last_visible_char = null,

    operator_prev = null,
    hasOperator = false,
    operator_entries = 0,
    end_operation = false,
    operator_times = 0,
    operator_token = null,

    int_entries = 0,
    int_str = '',
    max_int_entries = 9,

    dec_entries = 0,
    decimal_str = '',
    is_decimal = false,
    decimal_point = '.',
    max_dec_entries = 9,

    operation_str = '',
    do_operation = false,
    preview_amount = 0,
    current_amount = 0,
    subtotal = 0,
    total = 0,
    total_str = '',
    max_display_total = 9,

    showMessage = function (message) {
        // 
      $scope.app.title = message;
    },
    displayOperation = function (memory, total, concat) {
      // console.log('displayOperation: ', concat);
      $scope.app.memoryDisplay = memory;

      if (concat) {
          $scope.app.totalDisplay += total;
      }else{
          $scope.app.totalDisplay = total;
      }
    },
    checkSize = function(){
      total_str = $scope.app.totalDisplay.toString();
      if (total_str.length >= max_display_total) {
        $scope.app.sizeTotal = 'small';
      }else{
        $scope.app.sizeTotal = null;
      }
      if (memory_length >= max_display_memory) {
        $scope.app.sizeMemory = 'small';
      }else{
        $scope.app.sizeMemory = null;
      }
    },
    checkOperation = function(){
      if (end_operation === true) {
        $scope.clearAll();
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
            showMessage('Integer Limit Exceeded');
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
            showMessage('Decimal Limit Exceeded');
        }
    },
    calculateSubtotal = function () {
        var amountA = parseFloat(operation_str.split(operator_token)[0]),
            amountB = parseFloat(operation_str.split(operator_token)[1]);
        console.log('amountA: ', amountA);
        console.log('amountB: ', amountB);
        // do_operation = true;
        operator_times = 0;
        switch (operator_token) {
            case '+':
                subtotal = amountA + amountB;
            break;
            case '-':
                subtotal = amountA - amountB;
            break;
            case '*':
                subtotal = amountA * amountB;
            break;
            case '/':
                subtotal = amountA / amountB;
            break;
            default:
        }

        console.log('subtotal: ', subtotal);
        // if (memory_str.split(operator_token)[1] === undefined) {
        //     preview_amount = 0;
        //     current_amount = parseFloat(memory_str.split(operator_token)[0]);
        // }else{
        //     if (subtotal === 0) {
        //         preview_amount = parseFloat(memory_str.split(operator_token)[0]);
        //     }else{
        //         preview_amount = subtotal;
        //     }
        //     current_amount = parseFloat(memory_str.split(operator_token)[1]);
        // }
        // console.log('preview_amount: ', preview_amount);
        // console.log('current_amount: ', current_amount);
        // console.log('operator_token: ', operator_token);
        // console.log('memory_str: ', memory_str);

        // switch (operator_token) {
        //     case '+':
        //         subtotal = preview_amount + current_amount;
        //     break;
        //     case '-':
        //         subtotal = preview_amount - current_amount;
        //     break;
        //     case '*':
        //         subtotal = preview_amount * current_amount;
        //     break;
        //     case '/':
        //         subtotal = preview_amount / current_amount;
        //     break;
        //     default:
        // }
        // // showLog('CALCULATE', 'accumulated_amount_arr', syntaxHighlight(accumulated_amount_arr));
        // operator_entries = 0;
        // preview_amount = subtotal;
        // // preview_amount_str = null;
        // console.log('subtotal: ', subtotal);
        // end_single_operation = true;
    };

$scope.app = {
    title: 'simpleCalculator',
    sizeMemory: null,
    memoryDisplay: '',
    sizeTotal: null,
    totalDisplay: '0',
    clearAll: function(){
        checkSize();
        showMessage(title);
        end_operation = false;
        operator_prev = null;
        hasOperator = false;
        operator_token = null;
        int_str = '';
        int_entries = 0;

        is_decimal = false;
        dec_entries = 0;
        decimal_str = '';

        last_char = null;
        last_visible_char = null;

        preview_amount_str = '';
        preview_amount = 0;
        current_amount = 0;
        accumulated_amount = 0;
        total = 0;

        end_entry_amount = false;

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
            checkSize();
            checkOperation();

            if (is_decimal) {
                addDecimal(entry);
            }else{
                addInteger(entry);
            }
        }else{
            showMessage('Memory Length Exceeded')
        }
    },
    addDecimalPoint: function(){
        if (memory_length < max_display_memory) {
            checkSize();
            checkOperation();
            last_char = memory_str.charAt(memory_length-1);
            last_visible_char = memory_str.charAt(memory_length-2);
            if (is_decimal === false) {
                showMessage(title);
                is_decimal = true;
                memory_str += decimal_point;
                operation_str += decimal_point;
                displayOperation(memory_str, decimal_point, true);
                memory_length++;
            }
            // showLog('ADD DECIMAL POINT', 'decimal', '.');
        }else {
            showMessage('Memory Length Exceeded');
        }
    },
    addOperator: function(operator){
        if (operator_prev !== operator && memory_length < max_display_memory) {
            checkSize();
            is_decimal = false;
            // end_entry_amount = true;
            int_entries = 0;
            int_str = '';
            dec_entries = 0;
            decimal_str = '';

            // if(do_operation === true){
            //     do_operation = false;
            // }


            // if (operator_entries === 1) {
            //     // calculateSubtotal();
            // }

            // if (operator_entries === 0) {
            // //     // current_amount = parseFloat(memory_str);
            // //     // console.log('current_amount: ', current_amount);
            //     operator_token = operator;
            //     operator_entries ++;
            //     // console.log('=== 0 > operator_entries: ', operator_entries);
            // }

            // console.log('operator_entries: ', operator_entries);

            console.log('operation_str: ', operation_str);
            console.log('operator_times: ', operator_times);
            console.log('operator_token: ', operator_token);
            console.log('operator: ', operator);

            if (hasOperator === false) {
                hasOperator = true;
                memory_str += operator;
                operation_str += operator;
        
                operator_times++;
                // do_operation = !do_operation;
                if(operator_times === 1){
                    operator_token = operator;
                }

                if (operator_times === 2) {
                    calculateSubtotal();
                }

                displayOperation(memory_str, operator, false);
                operator_prev = operator;
                memory_length ++;
            }else{
                memory_str = memory_str.substr(0, memory_str.length - 1);
                memory_str += operator;
                displayOperation(memory_str, operator, false);
                operator_prev = operator;
            }

            // operator_token = operator;
        }else{
            showMessage($scope.app.title);
            // showMessage('Memory Length Exceeded');
        }
        // showLog('ADD OPERATOR', 'operator_token', operator_token);
    },
    calculate: function(){
        if (memory_length < max_display_memory) {
            checkSize();
            if (operator_prev !== '/' && operator_prev !== '*' && operator_prev !== '+' && operator_prev !== '-'/* && operator_token !== null*/) {
                // calculate();
                total = (new Function('return ' + memory_str))();
                // parseAmount();
                console.log('memory_str: ', memory_str);
                console.log('total: ', total);
                // return;

                var isDecimal = total.toString().match(/\./g);

                if (isDecimal) {
                    total_str = total.toFixed(2).toString();
                }else{
                  total_str = total.toString();
                }

                displayOperation(memory_str + '=' + total_str, total_str, false);

                memory_str = total;
                memory_length = total.length;
                current_amount = 0;
                operator_token = null;
                end_operation = true;
            }
        }else{
            showMessage('Memory Length Exceeded');
        }
    }

};

}]);
