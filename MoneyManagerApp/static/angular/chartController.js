(function () {
    'use strict';
    angular.module('finance')
        .controller('chartController', ['$scope', 'transactionsService', chartController]);

    function chartController($scope, transactionsService) {
      $scope.txService = transactionsService;
      var costs = {};
      var entries = {};
      var mixed = {};
      var dates = ['x'];
      var values = ['montos'];

      for (var i = 0; i < $scope.txService.transactions.length; i++) {
        if ($scope.txService.transactions[i][1] > 0) {
          if ($scope.txService.transactions[i][2] in entries) {
            entries[$scope.txService.transactions[i][2]].push($scope.txService.transactions[i][1])
          }
          else {
            entries[$scope.txService.transactions[i][2]] = [$scope.txService.transactions[i][1]]
          }
        }
        else {
          if ($scope.txService.transactions[i][2] in costs) {
            costs[$scope.txService.transactions[i][2]].push($scope.txService.transactions[i][1])
          }
          else {
            costs[$scope.txService.transactions[i][2]] = [$scope.txService.transactions[i][1]]
          }
        }
        if ($scope.txService.transactions[i][2] in mixed) {
          mixed[$scope.txService.transactions[i][2]].push($scope.txService.transactions[i][1])
        }
        else {
          mixed[$scope.txService.transactions[i][2]] = [$scope.txService.transactions[i][1]]
        }
      }
      var costs_array = [];
      var entries_array = [];
      var mixed_array = [];

      for (var key in costs) {
        var cost = [];
        cost.push(new Date(key));
        cost.push(costs[key].reduce((prev, curr) => prev + curr));
        costs_array.push(cost);
      }
      for (var key in entries) {
        var entry = [];
        entry.push(new Date(key));
        entry.push(entries[key].reduce((prev, curr) => prev + curr));
        entries_array.push(entry);
      }

      for (var key in mixed) {
        var mix = [];
        mix.push(new Date(key));
        mix.push(mixed[key].reduce((prev, curr) => prev + curr));
        mixed_array.push(mix);
      }



      function sortFunction(a, b) {
        if (a[0] === b[0]) {
          return 0;
        }
        else {
          return (a[0] < b[0]) ? -1 : 1;
        }
      }

      costs_array.sort(sortFunction);
      entries_array.sort(sortFunction);
      mixed_array.sort(sortFunction);

      var value = 0;
      for (var i = 0; i < mixed_array.length; i++) {
        mixed_array[i][1] = value + mixed_array[i][1];
        value = mixed_array[i][1];
      }

      var costs_keys = ['x1'];
      var costs_values = ['Gastos'];
      var entries_keys = ['x2'];
      var entries_values = ['Ganancias'];
      var mixed_keys = ['x3'];
      var mixed_values = ['Acumulado'];

      var format = d3.time.format("%Y-%m-%d");

      for (var i = 0; i < costs_array.length; i++) {
        costs_keys.push(format(costs_array[i][0]));
        costs_values.push(costs_array[i][1]);
      }

      for (var i = 0; i < entries_array.length; i++) {
        entries_keys.push(format(entries_array[i][0]));
        entries_values.push(entries_array[i][1]);
      }

      for (var i = 0; i < mixed_array.length; i++) {
        mixed_keys.push(format(mixed_array[i][0]));
        mixed_values.push(mixed_array[i][1]);
      }

      console.log(entries_keys); console.log(entries_values);



      var chart = c3.generate({
          bindto: "#chart",
          padding: {
            right: 20
          },
          data: {
              xs: {
                'Gastos': 'x1',
                'Ganancias': 'x2',
                'Acumulado': 'x3',
              },
              columns: [
                costs_keys,
                entries_keys,
                mixed_keys,
                costs_values,
                entries_values,
                mixed_values
              ],
              type: 'bar',
              types: {
                'Acumulado' : 'spline'
              },
              colors: {
                Gastos: '#F44336',
                Ganancias: '#3F51B5',
                Acumulado: '#4CAF50'
              }
          },
          grid: {
            y: {
              lines: [
                {value: 0, text: ''}
              ]
            }
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%d-%m-%Y'
              }
            }
          }
      });
    }

})();
