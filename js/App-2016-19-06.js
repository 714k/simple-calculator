angular.module('simpleCalculatorApp', [])
.controller('simpleCalculatorCtrl', ['$scope', function($scope){
var title = 'simpleCalculator';
var max_operators = 1;
var operator_prev = null;
var hasOperator = false;
var integer_str = '';
var integer_entries = 0;
var max_integer_entries = 9;

var is_decimal_amount = false;
var decimal_entries = 0;
var max_decimal_entries = 9;
var decimal_str = '';

var prev_amount = '';
var max_display_total = 9;
var max_display_memory = 30;

var end_operation = false;
var end_entry_amount = false; // meaby useful

var memory_str = '';
var memory_length = 0;
var last_char = null;
var last_visible_char = null;
var add_str = '+';
var substract_str = '-';
var multiply_str = '*';
var divide_str = '/';
var total_str = '';
var total = 0;

var showMessage = function (message) {
  $scope.title = message;
};
var checkSize = function(){
  if (memory_length >= max_display_memory) {
    $scope.sizeMemory = 'small';
  }
};
var showLog = function (title, titleData, data) {
  console.clear();
  console.log('************ ' + title + ' ************');
  console.log('integer_str: ', integer_str);
  console.log('integer_entries: ', integer_entries);
  console.log('----------------------------');
  console.log('is_decimal_amount: ', is_decimal_amount);
  console.log('decimal_str: ', decimal_str);
  console.log('decimal_entries: ', decimal_entries);
  console.log('----------------------------');
  console.log('memory_str: ', memory_str);
  console.log('memory_length: ', memory_length);
  console.log('----------------------------');
  console.log('last_char: ', last_char);
  console.log('last_visible_char: ', last_visible_char);
  console.log('----------------------------');
  console.log('prev_amount: ', prev_amount);
  console.log('hasOperator: ', hasOperator);
  console.log('operator_prev: ', operator_prev);

  console.log('----------------------------');
  console.log(titleData, ': ', data);
};


$scope.sizeTotal = null;
$scope.sizeMemory = null;
$scope.title = title;
$scope.total = 0;

$scope.addNumber = function(number){
  checkSize();

  operator_prev = null;
  hasOperator = false;
  if (is_decimal_amount === false){
    if (integer_entries < max_integer_entries) {
      integer_str += number;
      prev_amount += number;
      memory_str += number;
      $scope.memory = memory_str;
      integer_entries ++;
      memory_length ++;
    }else{
      showMessage('Digit Limit Exceeded');
    }
    // $scope.total = prev_amount;
  }else{
    if (decimal_entries < max_decimal_entries) {
      decimal_str += number;
      prev_amount += number;
      memory_str += number;
      $scope.memory = memory_str;
      decimal_entries ++;
      memory_length ++;
    }else{
      showMessage('Decimal Limit Exceeded');
    }
  }
  $scope.total = prev_amount;
  // last_char = memory_str.charAt(memory_length-1);
  // last_visible_char = last_char;
  showLog('ADD NUMBER', 'number', number);
};

$scope.addDecimal = function(){
  checkSize();
  last_char = memory_str.charAt(memory_length-1);
  last_visible_char = memory_str.charAt(memory_length-2);
  integer_entries = 0;
  if (is_decimal_amount === false) {
    is_decimal_amount = true;
    showMessage(title);
    prev_amount += '.';
    memory_str += '.';
    $scope.memory = memory_str;
    memory_length++;
  }
  showLog('ADD DECIMAL', 'decimal', '.');
};

/**/
$scope.addOperator = function (operator) {
  checkSize();
  prev_amount = '';
  integer_entries = 0;
  integer_str = '';
  decimal_entries = 0;
  decimal_str = '';
  is_decimal_amount = false;
  if (operator_prev !== operator) {
    showMessage(title);
    if (hasOperator === false) {
      hasOperator = true;
      memory_str += operator;
      $scope.memory = memory_str;
      operator_prev = operator;
      memory_length ++;
    }else{
      memory_str = memory_str.substr(0, memory_str.length - 1);
      memory_str += operator;
      $scope.memory = memory_str;
      operator_prev = operator;
      // memory_length ++;
    }
  }
  // last_char = memory_str.charAt(memory_length-1);
  // last_visible_char = last_char;
  showLog('ADD OPERATOR', 'operator', operator);
};
/**/
/*
$scope.addOperator = function (operator) {
  prev_amount = '';
  integer_entries = 0;
  integer_str = '';
  decimal_entries = 0;
  decimal_str = '';
  is_decimal_amount = false;
  if (operator_prev !== '.' && operator_prev !== operator) {
    console.clear();
    console.log(operator);
    operator_prev = operator;
  }
};
*/

$scope.addEntry = function(entry){
  if (entry === '.') {
    is_decimal_amount = true;
    if (decimal_operands < max_decimal_operands) {
      memory_str+= entry;
      decimal_operands++;
      memory_length++;
    }else{
      showMessage('Decimal Operands Limit Exceeded');
    }
  }else{
    if (integer_entries < max_integer_entries) {
      if (is_decimal_amount === false) {
        integer_str+= entry;
        integer_entries++;
      }else{
        if (decimal_entries < max_decimal_entries) {
          decimal_str+= entry;
          decimal_entries++;
        }
      }
      if (decimal_entries < max_decimal_entries) {
        memory_str+= entry;
        memory_length++;
      }else{
        showMessage('Decimal Limit Exceeded');
        showLog('DECIMAL LIMIT EXCEEDED', 'decimal_entries', decimal_entries);
      }
    }else{
      showMessage('Digit Limit Exceeded');
    }
  }

  showLog('ADD ENTRY', 'entry', entry);
  // memory_str += integer_str + decimal_str;
  // $scope.memory = memory_str;
};

$scope.clearEntry = function(){
  // console.log('hi');
  if (memory_length > 0) {
    last_char = memory_str.charAt(memory_length-1);
    last_visible_char = memory_str.charAt(memory_length-2);
    if (is_decimal_amount) {
      if (last_char === '.') {
        decimal_str = '';
        decimal_entries = 0;
        is_decimal_amount = false;
        console.log('last_char');
        console.log(last_char);
      }
    }
    if (last_visible_char === '*' || last_visible_char === '/' || last_visible_char === '+' || last_visible_char === '-') {
      hasOperator = true;
      operator_prev = last_visible_char;
    }else{
      hasOperator = false;
      operator_prev = null;
    }
    if (end_operation === true) {
      $scope.clear();
    }
    if ($scope.total.length > 0) {
      $scope.total = $scope.total.substr(0, $scope.total.length - 1);
    }
    memory_str = memory_str.substr(0, memory_str.length - 1);
    prev_amount = prev_amount.substr(0, prev_amount.length - 1);
    $scope.memory = memory_str;
    // prev_amount.length --;
    memory_length --;
    showLog('CLEAR ENTRY', 'last_char', last_char);
  }
  /*
  if (prev_amount.length > 0) {
    $scope.total = '';
    memory_str = memory_str.substr(0, memory_length - prev_amount.length);
    // prev_amount = '';
    $scope.memory = memory_str;
    integer_entries = 0;
    decimal_entries = 0;
    is_decimal_amount = false;
    showLog('CLEAR ENTRY', 'memory_str', memory_str)
  }*/
};

$scope.clear = function(){
  end_operation = false;
  operator_prev = null;
  hasOperator = false;
  integer_str = '';
  integer_entries = 0;

  is_decimal_amount = false;
  decimal_entries = 0;
  decimal_str = '';

  prev_amount = '';
  total = 0;

  end_entry_amount = false;

  memory_str = '';
  memory_length = 0;

  $scope.total = 0;
  $scope.memory = memory_str;

};

$scope.calculate = function(){
  if (operator_prev !== '/' && operator_prev !== '*' && operator_prev !== '+' && operator_prev !== '-') {
    var total_str = 'return ' + memory_str;
    var totalFunction = new Function(total_str);
    total_str = totalFunction();
    var isDecimal = total_str.toString().match(/\./g);
    var isInteger = total_str % 1 != 0;

    if (isDecimal) {
      total = totalFunction().toFixed(2);
    }else{
      total = totalFunction();
    }
    // checkSize();
    // alert(total.length);
    total_str = total.toString();
    if (total_str.length >= max_display_total) {
      $scope.sizeTotal = 'small';
    }

    $scope.memory += '=' + total_str;
    $scope.total = total_str;
    memory_str = total_str;
    end_operation = true;

    showLog('CALCULATE', 'total', total_str);
  }
};





}]);
