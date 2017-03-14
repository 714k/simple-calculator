angular.module('simpleCalculatorApp', [])
.controller('simpleCalculatorCtrl', ['$scope', function($scope){
var title = 'simpleCalculator';

var operator_prev = null,
    preview_operator_token = null,
    current_operator_token = null,
    hasOperator = false,
    operator_entries = 0,

    int_str = '',
    int_entries = 0,
    max_int_entries = 9,

    decimal_str = '',
    decimal_point = '.',
    dec_entries = 0,
    max_dec_entries = 9,
    is_decimal = false,

    preview_amount_str = '',
    current_amount_str = '',
    preview_amount = 0,
    current_amount = 0,
    memory_amount_str = '',
    accumulated_amount = 0,
    max_display_total = 9,
    max_display_memory = 20,

    end_operation = false,
    end_single_operation = false,
    end_entry_amount = false, // maybe useful

    memory_str = '',
    memory_length = 0,
    last_char = null,
    last_visible_char = null,
    total_str = '',
    total = 0,
    accumulated_amount_arr = [],
    num_amounts = 0,
    operations = 0,

    calculate = function () {
      switch (preview_operator_token) {
        case '+':
          accumulated_amount = preview_amount + current_amount;
          break;
        case '-':
          accumulated_amount = preview_amount - current_amount;
          break;
        case '*':
          accumulated_amount = preview_amount * current_amount;
          break;
        case '/':
          accumulated_amount = preview_amount / current_amount;
          break;
        default:
      }
      num_amounts ++;
      operations ++;
      accumulated_amount_arr.push(
        {
          'operations': operations,
          'preview_amount': preview_amount,
          'operator': preview_operator_token,
          'current_amount': current_amount,
          'accumulated': accumulated_amount
        }
      );

      showLog('CALCULATE', 'accumulated_amount_arr', syntaxHighlight(accumulated_amount_arr));
      operator_entries = 0;
      preview_amount = accumulated_amount;
      preview_amount_str = null;
      end_single_operation = true;
    },
    showLog = function (title, titleData, data) {
      // console.clear();
      console.log('************************************ ' + title + ' ************************************');
      console.log('int_str: ', int_str, '  |  int_entries: ', int_entries);
      console.log('-----------------------------------------------------------------------------------');
      console.log('is_decimal: ', is_decimal, '  |  decimal_str: ', decimal_str, '  |  dec_entries: ', dec_entries);
      console.log('-----------------------------------------------------------------------------------');
      console.log('memory_str: ', memory_str, '  |  memory_length: ', memory_length);
      console.log('-----------------------------------------------------------------------------------');
      console.log('last_char: ', last_char, '  |  last_visible_char: ', last_visible_char);
      console.log('-----------------------------------------------------------------------------------');
      console.log('preview_amount: ', preview_amount, '  |  current_amount: ', current_amount, '  |  accumulated_amount: ', accumulated_amount);
      console.log('preview_amount_str: ', preview_amount_str, '  |  memory_amount_str: ', memory_amount_str);
      console.log('-----------------------------------------------------------------------------------');
      console.log('operations', operations, '  |  accumulated_amount_arr: ', accumulated_amount_arr);
      console.log('-----------------------------------------------------------------------------------');
      console.log('hasOperator: ', hasOperator, '  |  preview_operator_token: ', preview_operator_token, '  |  operator_prev: ', operator_prev);
      // console.log('-----------------------------------------------------------------------------------');
      // console.log('accumulated_amount: ', accumulated_amount);

      console.log('-----------------------------------------------------------------------------------');
      console.log(titleData, ': ', data);
    },
    showMessage = function (message) {
      $scope.title = message;
    },
    checkSize = function(){
      total_str = $scope.totalDisplay.toString();
      if (total_str.length >= max_display_total) {
        $scope.sizeTotal = 'small';
      }else{
        $scope.sizeTotal = null;
      }
      if (memory_length >= max_display_memory) {
        $scope.sizeMemory = 'small';
      }else{
        $scope.sizeMemory = null;
      }
    },
    checkOperation = function(){
      if (end_operation === true) {
        $scope.clearAll();
      }
    };

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        // return '<span class="' + cls + '">' + match + '</span>';
        return match;
    });
}


$scope.sizeTotal = null;
$scope.sizeMemory = null;
$scope.title = title;
$scope.memoryDisplay = '';
$scope.totalDisplay = '0';

$scope.addEntry = function (entry) {
  if (memory_length < max_display_memory) {
    hasOperator = false;
    operator_prev = null;
    checkSize();
    checkOperation();

    if (is_decimal) {
      $scope.addDecimal(entry);
    }else{
      $scope.addInteger(entry);
    }
  }else{
    showMessage('Memory Length Exceeded')
  }
};

$scope.addInteger = function (integer) {
  if (int_entries < max_int_entries) {
    int_str += integer;
    // preview_amount = current_amount;
    // preview_amount_str += integer;
    memory_str += integer;
    memory_amount_str += integer;
    $scope.memoryDisplay = memory_str;
    $scope.totalDisplay = memory_str;
    int_entries ++;
    memory_length ++;
    showLog('addInteger', null, null);
  }else{
    showMessage('Integer Limit Exceeded');
  }
};

$scope.addDecimal = function (decimal) {
  if (dec_entries < max_dec_entries) {
    decimal_str += decimal;
    preview_amount_str += decimal;
    memory_str += decimal;
    memory_amount_str += decimal;
    $scope.memoryDisplay = memory_str;
    $scope.totalDisplay = memory_str;
    dec_entries ++;
    memory_length ++;
    showLog('addDecimal', null, null);
  }else{
    showMessage('Decimal Limit Exceeded');
  }
};

$scope.addDecimalPoint = function(){
  if (memory_length < max_display_memory) {
    checkSize();
    checkOperation();
    last_char = memory_str.charAt(memory_length-1);
    last_visible_char = memory_str.charAt(memory_length-2);
    // int_entries = 0;
    if (is_decimal === false) {
      is_decimal = true;
      showMessage(title);
      // preview_amount_str += decimal_point;
      memory_str += decimal_point;
      // memory_amount_str += decimal_point;
      $scope.memoryDisplay = memory_str;
      $scope.totalDisplay = memory_str;
      memory_length++;
    }
    // showLog('ADD DECIMAL POINT', 'decimal', '.');
  }else {
    showMessage('Memory Length Exceeded');
  }
};

$scope.addOperator = function (operator) {
  if (operator_prev !== operator && memory_length < max_display_memory) {
    checkSize();
    int_entries = 0;
    int_str = '';
    dec_entries = 0;
    decimal_str = '';
    is_decimal = false;
    end_entry_amount = true;
    current_amount = parseFloat(memory_str.substr(0, memory_length));
    preview_amount = parseFloat(memory_amount_str);
    showMessage(title);
    showLog('addOperator');

    if (operator_entries === 0) {
      preview_operator_token = operator;
    }
    
    if (operator_entries === 1 && preview_amount_str !== null) {
      // preview_amount = current_amount;
      console.debug('preview_amount_str: ', preview_amount_str);
      calculate();
    }
    

    operator_entries ++;
    if (hasOperator === false) {
      hasOperator = true;
      memory_str += operator;
      $scope.memoryDisplay = memory_str;
      $scope.totalDisplay = memory_str;
      operator_prev = operator;
      memory_length ++;
    }else{
      memory_str = memory_str.substr(0, memory_str.length - 1);
      memory_str += operator;
      $scope.memoryDisplay = memory_str;
      operator_prev = operator;
    }
    preview_operator_token = operator;
    memory_amount_str = '';
  }else{
    showMessage('Memory Length Exceeded');
  }
  // showLog('ADD OPERATOR', 'preview_operator_token', preview_operator_token);
};

$scope.clearAll = function(){
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

  $scope.totalDisplay = 0;
  $scope.memoryDisplay = memory_str;
  $scope.sizeTotal = null;
  $scope.sizeMemory = null;

  showLog('CLEAR');
};

$scope.calculate = function () {
  if (memory_length < max_display_memory) {
    checkSize();
    if (operator_prev !== '/' && operator_prev !== '*' && operator_prev !== '+' && operator_prev !== '-' && preview_operator_token !== null) {
      calculate();
      // $scope.addOperator(preview_operator_token);
      var isDecimal = accumulated_amount.toString().match(/\./g);

      if (isDecimal) {
        total = accumulated_amount.toFixed(4).toString();
      }else{
        total = accumulated_amount.toString();
      }

      $scope.memoryDisplay = memory_str.substr(0, memory_length-1) + '=' + total;
      $scope.totalDisplay = total;

      memory_str = total;
      memory_length = total.length;
      current_amount = 0;
      preview_operator_token = null;
      end_operation = true;
    }
  }else{
    showMessage('Memory Length Exceeded');
  }
};

}]);
