angular.module('simpleCalculatorApp', [])
.controller('simpleCalculatorCtrl', ['$scope', '$element', function($scope, $element){
  var keys = $element.find('#keys button');
  // console.log(keys);
  $scope.total = 0;
  $scope.memory = 0;
  $scope.messages = 'simpleCalculator';
  $scope.sizeMemory = null;

  var memory_str = '';
  var memory_length = 0;
  var total_str = '';
  var add_str = '+';
  var substract_str = '-';
  var multiply_str = '*';
  // var multiply_str = '×';
  // var divide_str = '÷';
  var divide_str = '/';

  var pendingOperator = null;
  var currentOperator = null;
  var operator_str = '';
  var numOperators = 0;
  var pendingValue = null;
  var numValues = 0;
  var values_str = '';
  var total = 0;
  var endOperation = false;


  function checkOperator(operator) {
    // if (memory_length <= 5) {
      console.log('*****************memory_length**********************');
      console.log(memory_length);
      endOperation = false;
      numValues = 0;
      $scope.sizeTotal = '';
      $scope.messages = 'simpleCalculator';

      if (pendingValue != null) {
        values_str = '';
        if (pendingOperator != operator) {
          if (numOperators === 0) {
            memory_str += operator;
            $scope.memory = memory_str;
            numOperators++;
          }else{
            memory_str = memory_str.substr(0, memory_str.length - 1);
            memory_str += operator;
            $scope.memory = memory_str;
          }
          pendingOperator = operator;
          operator_str = operator;

          console.log('addOperator');
          console.log('pendingValue: ' + pendingValue);
          console.log('pendingOperator: ' + pendingOperator);
          console.log('memory_str: ' + memory_str);
          console.log('memory: ' + $scope.memory);
          console.log('-----------------------------------------');
          // addOperator(operator_str);
        }
      }else{
        // $scope.memory = '';
        console.log('error acaaaaaaaaaaaa');
      }
    // }else{
    //   $scope.messages = 'Digit Limit Exceeded';
    //   memory_str += operator;
    // }
  }

  $scope.addValue = function(key){
    $scope.sizeTotal = '';
    if (memory_length > 20) {
      $scope.sizeMemory = 'small';
    }
    // memory_length = 0;
    if(numValues < 9){
      if (endOperation === true) {
        $scope.clear();
        endOperation = false;
        console.log('-----------------------------------------');
        console.log('endOperation === true');
        console.log('-----------------------------------------');
      }
      console.log('endOperation === false');
      console.log('-----------------------------------------');
      values_str += key;
      memory_str += key;
      pendingValue = key;
      $scope.total = values_str;
      $scope.memory = memory_str;
      pendingOperator = null;
      numOperators = 0;
      numValues++;
      memory_length++;
      console.log('addValue');
      console.log('pendingValue: ' + pendingValue);
      console.log('values_str: ' + values_str);
      console.log('pendingOperator: ' + pendingOperator);
      console.log('memory_str: ' + memory_str);
      console.log('memory_str.length: ' + memory_str.length);
      console.log('total: ' + total);
      console.log('-----------------------------------------');
    }else{
      $scope.messages = 'Digit Limit Exceeded';
    }
  };

  $scope.add = function(){
    checkOperator(add_str);
  };

  $scope.substract = function(){
    checkOperator(substract_str);
  };

  $scope.multiply = function(){
    checkOperator(multiply_str);
  };

  $scope.divide = function(){
    checkOperator(divide_str);
  };

  $scope.clearError = function () {
    if(memory_str.length > 0){
      memory_str = memory_str.substr(0, memory_str.length - 1);
      values_str = values_str.substr(0, values_str.length - 1);
      $scope.memory = memory_str;
      $scope.total = values_str;
      numValues--;
      console.log('clearError');
      console.log('loaded memory');
      console.log('pendingValue: ' + pendingValue);
      console.log('pendingOperator: ' + pendingOperator);
      console.log('memory_str: ' + memory_str);
      console.log('-----------------------------------------');
    }else{
      memory_str = '';
      $scope.memory = '';
      total = 0;
      console.log('clearError');
      console.log('empty memory');
      console.log('pendingValue: ' + pendingValue);
      console.log('pendingOperator: ' + pendingOperator);
      console.log('memory_str: ' + memory_str);
      console.log('-----------------------------------------');
      // $scope.total = '';
    }
  };

  $scope.clear = function(){
    memory_str = '';
    total_str = '';
    $scope.memory = memory_str;
    $scope.total = memory_str;
    pendingOperator = null;
    operator_str = '';
    numOperators = 0;
    pendingValue = null;
    numValues = 0;
    values_str = '';
    console.log('clear');
    console.log('pendingValue: ' + pendingValue);
    console.log('pendingOperator: ' + pendingOperator);
    console.log('memory_str: ' + memory_str);
    console.log('-----------------------------------------');
  };

  $scope.calculate = function(){
    $scope.messages = 'simpleCalculator';
    if (pendingValue != null && pendingOperator == null && memory_str != values_str) {
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

      var total_length = total.toString().length;

      if (total_length > 9) {
        $scope.sizeTotal = 'med';
      }
      if (memory_length >= 18) {
        $scope.sizeMemory = 'small';
      }

      // if (endOperation === false) {
        $scope.memory += '=' + total;
      // }

      $scope.total = total;


      console.log('calculate');
      console.log(total);

      memory_str = total;
      // memory_str = '';
      numValues = 0;
      // numOperators++;
      values_str = '';
      // total = values_str;
      // $scope.memory = memory_str;
      // pendingOperator = null;
      // operator_str = '';
      // numOperators = 0;
      // pendingValue = null;
      // numValues = 0;
      // values_str = '';
      endOperation = true;
    }
  };



}]);
