angular.module('simpleCalculatorApp', ['ngSanitize'])
.controller('simpleCalculatorCtrl', ['$scope', '$sce', function($scope, $sce){
  var add = 'adding';
  var substract = 'substracting';
  var multiply = 'multiplying';
  var divide = 'dividing';

  var addSymbol = '+';
  var substractSymbol = '-';
  var multiplySymbol = '×';
  var divideSymbol = '÷';

  $scope.history_str = '';

  var setOperationToken = function(operation){
    switch (operation) {
      case add:
        $scope.operationString = addSymbol;
        $scope.history_str += addSymbol;
        break;
      case substract:
        $scope.operationString = substractSymbol;
        $scope.history_str += substractSymbol;
        break;
      case multiply:
        $scope.operationString = multiplySymbol;
        $scope.history_str += multiplySymbol;
        break;
      case divide:
        $scope.operationString = divideSymbol;
        $scope.history_str += divideSymbol;
        break;
      default:
      $scope.operationString = '';
      // history_str += addSymbol;

    }
  };

  var setTotal = function(totalString){
    $scope.total = totalString;
    $scope.history = $scope.history_str;
    $scope.newNumber = true;
  };

  $scope.total = '0';
  $scope.history = '0';
  $scope.newNumber = true;
  $scope.pendingOperation = null;
  $scope.operationString = '';
  $scope.runningTotal = null;
  $scope.pendingValue = null;
  $scope.lastOperation = null;


  $scope.updateTotal = function (key){
    if ($scope.total == '0' || $scope.newNumber) {
      $scope.total = key;
      $scope.history_str += key;
      $scope.history = $scope.history_str;
      // $scope.history = key;
      $scope.newNumber = false;
    }else{
      if ($scope.total.length == 10) {
        // $scope.total = '0';
        // $scope.history = 'Digit Limit Found';
      }else{
        $scope.total += String(key);
        // $scope.history = history_str;
        $scope.history_str += key;
        $scope.history = $scope.history_str;
      }
    }

    $scope.pendingValue = parseInt($scope.total);
  };

  $scope.add = function(){
    if ($scope.pendingValue) {
      if ($scope.runningTotal && $scope.pendingOperation == add) {
        $scope.runningTotal += $scope.pendingValue;
      }else if ($scope.runningTotal && $scope.pendingOperation == substract) {
        $scope.runningTotal -= $scope.pendingValue;
      }else{
        $scope.runningTotal = $scope.pendingValue;
      }
    }

    setOperationToken(add);
    setTotal(String($scope.runningTotal));
    $scope.pendingOperation = add;
    $scope.newNumber = true;
    $scope.pendingValue = null;
  };

  $scope.substract = function(){
    if ($scope.pendingValue) {
      if ($scope.runningTotal && $scope.pendingOperation == substract) {
        $scope.runningTotal -= $scope.pendingValue;
      }else if ($scope.runningTotal && $scope.pendingOperation == add) {
        $scope.runningTotal += $scope.pendingValue;
      }else{
        $scope.runningTotal = $scope.pendingValue;
      }
    }

    setOperationToken(substract);
    setTotal(String($scope.runningTotal));
    $scope.pendingOperation = substract;
    $scope.newNumber = true;
    $scope.pendingValue = null;
  };

  $scope.multiply = function(){
    if ($scope.pendingValue) {
      if ($scope.runningTotal && $scope.pendingOperation == multiply) {
        $scope.runningTotal *= $scope.pendingValue;
      }else if ($scope.runningTotal && $scope.pendingOperation == divide) {
        $scope.runningTotal /= $scope.pendingValue;
      }else{
        $scope.runningTotal = $scope.pendingValue;
      }
    }

    setOperationToken(multiply);
    setTotal(String($scope.runningTotal));
    $scope.pendingOperation = multiply;
    $scope.newNumber = true;
    $scope.pendingValue = null;
  };

  $scope.divide = function(){
    if ($scope.pendingValue) {
      if ($scope.runningTotal && $scope.pendingOperation == divide) {
        $scope.runningTotal /= $scope.pendingValue;
      }else if ($scope.runningTotal && $scope.pendingOperation == multiply) {
        $scope.runningTotal *= $scope.pendingValue;
      }else{
        $scope.runningTotal = $scope.pendingValue;
      }
    }

    setOperationToken(divide);
    setTotal(String($scope.runningTotal));
    $scope.pendingOperation = divide;
    $scope.newNumber = true;
    $scope.pendingValue = null;
  };

  $scope.clear = function(){
    $scope.runningTotal = null;
    $scope.pendingValue = null;
    $scope.pendingOperation = null;
    $scope.history_str = '0';
    setTotal('0');
  };

  $scope.clearError = function(){
    $scope.runningTotal -= $scope.pendingValue;
    console.log('$scope.runningTotal: ' + $scope.runningTotal);
    console.log('$scope.pendingValue: ' + $scope.pendingValue);
    console.log('$scope.pendingOperation: ' + $scope.pendingOperation);
    console.log('setOperationToken($scope.pendingOperation): ' + setOperationToken($scope.pendingOperation));
    console.log('$scope.runningTotal: ' + $scope.runningTotal);
  };

  $scope.calculate = function(){
    if (!$scope.newNumber) {
      $scope.pendingValue = parseInt($scope.total);
      $scope.lastValue = $scope.pendingValue;
    }

    if ($scope.pendingOperation == add) {
      $scope.runningTotal += $scope.pendingValue;
      $scope.lastOperation = add;
    }else if ($scope.pendingOperation == substract) {
      $scope.runningTotal -= $scope.pendingValue;
      $scope.lastOperation = substract;
    }else if ($scope.pendingOperation == multiply) {
      $scope.runningTotal *= $scope.pendingValue;
      $scope.lastOperation = multiply;
    }else if ($scope.pendingOperation == divide) {
      $scope.runningTotal /= Math.round($scope.pendingValue);
      $scope.lastOperation = divide;
    }else{
      if ($scope.lastOperation = add) {
        if ($scope.runningTotal) {
          $scope.runningTotal += $scope.lastValue;
        }else{
          $scope.runningTotal = 0;
        }
      }else if ($scope.lastOperation == substract) {
        if ($scope.runningTotal) {
          $scope.runningTotal -= $scope.lastValue;
        }else{
          $scope.runningTotal = 0;
        }
      }else if ($scope.lastOperation == multiply) {
        if ($scope.runningTotal) {
          $scope.runningTotal *= $scope.lastValue;
        }else{
          $scope.runningTotal = 0;
        }
      }else if ($scope.lastOperation == divide) {
        if ($scope.runningTotal) {
          $scope.runningTotal /= Math.round($scope.lastValue);
        }else{
          $scope.runningTotal = 0;
        }
      }
    }
    $scope.history_str += '=' + $scope.runningTotal;
    setTotal($scope.runningTotal);
    setOperationToken();
    $scope.pendingOperation = null;
    $scope.pendingValue = null;
  };


}]);
