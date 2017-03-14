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

    int_entries = 0,
    int_str = '',
    max_int_entries = 9,

    dec_entries = 0,
    decimal_str = '',
    is_decimal = false,
    decimal_point = '.',
    max_dec_entries = 9,

    preview_amount = 0,
    current_amount = 0,
    subtotal = 0,
    total = 0,
    total_str = '',
    max_display_total = 9,

    showMessage = function (message) {
      $scope.app.title = message;
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
            $scope.app.memoryDisplay = memory_str;
            $scope.app.totalDisplay = int_str;
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
            $scope.app.memoryDisplay = memory_str;
            $scope.app.totalDisplay = int_str + decimal_point + decimal_str;
            dec_entries ++;
            memory_length ++;
            // showLog('addDecimal', null, null);
        }else{
            showMessage('Decimal Limit Exceeded');
        }
    },
    parseAmount = function(){
        preview_amount = parseFloat(memory_str.split(preview_operator_token)[0]);
        current_amount = parseFloat(memory_str.split(preview_operator_token)[1]);
        // calculate();

        // preview_amount = current_amount;
        console.log('preview_amount: ', preview_amount);
        console.log('preview_operator_token: ', preview_operator_token);
        console.log('current_amount: ', current_amount);
    },
    calculateSubtotal = function () {
      switch (preview_operator_token) {
        case '+':
          subtotal = preview_amount + current_amount;
          break;
        case '-':
          subtotal = preview_amount - current_amount;
          break;
        case '*':
          subtotal = preview_amount * current_amount;
          break;
        case '/':
          subtotal = preview_amount / current_amount;
          break;
        default:
      }
      // num_amounts ++;
      // operations ++;
      // accumulated_amount_arr.push(
      //   {
      //     'operations': operations,
      //     'preview_amount': preview_amount,
      //     'operator': preview_operator_token,
      //     'current_amount': current_amount,
      //     'accumulated': accumulated_amount
      //   }
      // );

      // showLog('CALCULATE', 'accumulated_amount_arr', syntaxHighlight(accumulated_amount_arr));
      // operator_entries = 0;
      preview_amount = subtotal;
      // preview_amount_str = null;
      console.log('subtotal: ', subtotal);
      end_single_operation = true;
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
        preview_operator_token = null;
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
                is_decimal = true;
                showMessage(title);
                memory_str += decimal_point;
                $scope.app.memoryDisplay = memory_str;
                $scope.app.totalDisplay += decimal_point;
                memory_length++;
            }
            // showLog('ADD DECIMAL POINT', 'decimal', '.');
        }else {
            showMessage('Memory Length Exceeded');
        }
    },
    addOperator: function(operator){
        if (operator_prev !== operator && memory_length < max_display_memory) {
            // showMessage(title);
            checkSize();
            is_decimal = false;
            // end_entry_amount = true;
            int_entries = 0;
            int_str = '';
            dec_entries = 0;
            decimal_str = '';
            // // preview_amount = parseFloat(memory_str);
            // // console.log('preview_amount: ', preview_amount);

            // if (operator_entries === 0) {
            //     // current_amount = parseFloat(memory_str);
            //     // console.log('current_amount: ', current_amount);
            //     preview_operator_token = operator;
            // }

            // if (operator_entries >= 1) {
            //     parseAmount();
            //     calculateSubtotal();
            // }

            if (hasOperator === false) {
                hasOperator = true;
                memory_str += operator;
                $scope.app.memoryDisplay = memory_str;
                $scope.app.totalDisplay = operator;
                operator_prev = operator;
                memory_length ++;
            }else{
                memory_str = memory_str.substr(0, memory_str.length - 1);
                memory_str += operator;
                $scope.memoryDisplay = memory_str;
                operator_prev = operator;
            }
            operator_entries ++;
            // preview_operator_token = operator;
        }else{
            showMessage($scope.app.title);
            // showMessage('Memory Length Exceeded');
        }
        // showLog('ADD OPERATOR', 'preview_operator_token', preview_operator_token);
    },
    calculate: function(){
        if (memory_length < max_display_memory) {
            checkSize();
            if (operator_prev !== '/' && operator_prev !== '*' && operator_prev !== '+' && operator_prev !== '-'/* && preview_operator_token !== null*/) {
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

                $scope.app.memoryDisplay = memory_str + '=' + total_str;
                $scope.app.totalDisplay = total_str;

                memory_str = total;
                memory_length = total.length;
                current_amount = 0;
                preview_operator_token = null;
                end_operation = true;
            }
        }else{
            showMessage('Memory Length Exceeded');
        }
    }

};

}]);
