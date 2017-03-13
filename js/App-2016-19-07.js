angular.module('simpleCalculatorApp', [])
.controller('simpleCalculatorCtrl', ['$scope', function($scope){
var title = 'simpleCalculator';

var operator_prev = null;
var preview_operator_token = null;
var current_operator_token = null;
var hasOperator = false;
var operator_entries = 0;
var add_str = '+';
var substract_str = '-';
var multiply_str = '*';
var divide_str = '/';

var int_str = '';
var int_entries = 0;
var max_int_entries = 9;

var is_decimal = false;
var dec_entries = 0;
var max_dec_entries = 9;
var decimal_str = '';

var preview_amount_str = '';
var current_amount_str = '';
var preview_amount = 0;
var current_amount = 0;
var accumulated_amount = 0;
var max_display_total = 9;
var max_display_memory = 30;

var end_operation = false;
var end_single_operation = false;
var end_entry_amount = false; // meaby useful

var memory_str = '';
var memory_length = 0;
var last_char = null;
var last_visible_char = null;
var total_str = '';
var total = 0;

var calculate = function (a, op, b) {
  // var total = new Function('return ' + pa + op + ca);
  // acumulate = preview_amount + operator + current_amount;
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
  // preview_amount = current_amount;
  if (operator_entries === 1) {

    // current_amount = accumulated_amount;
  }
  current_operator_token = op;
  console.log('---------------------------------------');
  console.log('a: ', a);
  console.log('preview_operator_token: ', preview_operator_token, typeof preview_operator_token);
  console.log('current_operator_token: ', current_operator_token);
  console.log('b: ', b);
  console.log('preview_amount: ', preview_amount);
  console.log('current_amount: ', current_amount);
  console.log('accumulated_amount: ', accumulated_amount);
};

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
  console.log('int_str: ', int_str);
  console.log('int_entries: ', int_entries);
  console.log('----------------------------');
  console.log('is_decimal: ', is_decimal);
  console.log('decimal_str: ', decimal_str);
  console.log('dec_entries: ', dec_entries);
  console.log('----------------------------');
  console.log('memory_str: ', memory_str);
  console.log('memory_length: ', memory_length);
  console.log('----------------------------');
  console.log('last_char: ', last_char);
  console.log('last_visible_char: ', last_visible_char);
  console.log('----------------------------');
  console.log('preview_amount: ', preview_amount);
  console.log('current_amount: ', current_amount);
  console.log('preview_amount_str: ', preview_amount_str);
  console.log('hasOperator: ', hasOperator);
  console.log('operator_prev: ', operator_prev);
  console.log('----------------------------');
  console.log('accumulated_amount: ', accumulated_amount);

  console.log('----------------------------');
  console.log(titleData, ': ', data);
};


$scope.sizeTotal = null;
$scope.sizeMemory = null;
$scope.title = title;
$scope.total = 0;

$scope.addNumber = function(number){
  checkSize();
  hasOperator = false;
  operator_prev = null;
  if (is_decimal === false){
    if (int_entries < max_int_entries) {
      int_str += number;
      preview_amount_str += number;
      memory_str += number;
      $scope.memory = memory_str;
      int_entries ++;
      memory_length ++;
    }else{
      showMessage('Digit Limit Exceeded');
    }
  }else{
    if (dec_entries < max_dec_entries) {
      decimal_str += number;
      preview_amount_str += number;
      memory_str += number;
      $scope.memory = memory_str;
      dec_entries ++;
      memory_length ++;
    }else{
      showMessage('Decimal Limit Exceeded');
    }
  }
  // current_amount = preview_amount;
  $scope.total = preview_amount_str;
  // showLog('ADD NUMBER', 'number', number);
};

$scope.addDecimal = function(){
  checkSize();
  last_char = memory_str.charAt(memory_length-1);
  last_visible_char = memory_str.charAt(memory_length-2);
  int_entries = 0;
  if (is_decimal === false) {
    is_decimal = true;
    showMessage(title);
    preview_amount_str += '.';
    memory_str += '.';
    $scope.memory = memory_str;
    memory_length++;
  }
  showLog('ADD DECIMAL', 'decimal', '.');
};

$scope.addOperator = function (operator) {
  checkSize();
  int_entries = 0;
  int_str = '';
  dec_entries = 0;
  decimal_str = '';
  is_decimal = false;
  if (operator_entries === 0) {
    preview_amount = parseInt(preview_amount_str);
  }else if(operator_entries === 1){
    current_amount = parseInt(preview_amount_str);
    // operator_entries = 0;
    // end_single_operation = true;
  }else if (operator_entries === 2) {
    preview_amount = accumulated_amount;
    current_amount = parseInt(preview_amount_str);
    operator_entries = 0;
  }
  operator_entries ++;
  preview_amount_str = '';
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
    }
  }
  preview_operator_token = current_operator_token;

  // current_amount = preview_amount;
  console.clear();
  console.log('---------------------------------');
  console.log('preview_amount: ', preview_amount);
  console.log('operator: ', operator);
  console.log('preview_operator_token: ', preview_operator_token);
  console.log('current_operator_token: ', current_operator_token);
  console.log('current_amount: ', current_amount);
  calculate(preview_amount, operator, current_amount);

  // showLog('ADD OPERATOR', 'operator', operator);
};
$scope.clearEntry = function(){
  if (memory_length > 0) {
    last_char = memory_str.charAt(memory_length-1);
    last_visible_char = memory_str.charAt(memory_length-2);
    if (is_decimal) {
      if (last_char === '.') {
        decimal_str = '';
        dec_entries = 0;
        is_decimal = false;
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
    preview_amount_str = preview_amount_str.substr(0, preview_amount_str.length - 1);
    $scope.memory = memory_str;
    memory_length --;
    showLog('CLEAR ENTRY', 'last_char', last_char);
  }
};

$scope.clear = function(){
  end_operation = false;
  operator_prev = null;
  hasOperator = false;
  int_str = '';
  int_entries = 0;

  is_decimal = false;
  dec_entries = 0;
  decimal_str = '';

  preview_amount_str = '';
  total = 0;

  end_entry_amount = false;

  memory_str = '';
  memory_length = 0;

  $scope.total = 0;
  $scope.memory = memory_str;

};

$scope.calculate = function(){
  if (operator_prev !== '/' && operator_prev !== '*' && operator_prev !== '+' && operator_prev !== '-') {
    console.clear();
    console.log('memory_str');
    console.log(memory_str);
    var pattern_single_operation = /\d+\.\d+([\/\+\-\*])\d+\.\d+/g;
    // var pattern_single_operation = /(\d+\+|\-|\*|\/)/g;
    console.log(memory_str.match(pattern_single_operation));

    return;

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

    // showLog('CALCULATE', 'total', total_str);
  }
};





}]);
