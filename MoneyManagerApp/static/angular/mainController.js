(function () {
    'use strict';
    angular.module('finance')
        .controller('mainController', ['$scope', '$rootScope', 'transactionsService', mainController]);

    function mainController($scope, $rootScope, transactionsService) {
      $scope.txService = transactionsService;
      $scope.transactions = []
      $scope.nametx = "";
      $scope.moneytx = "";
      $scope.datetx = null;
      $scope.date1 = null;
      $scope.date2 = null;



      $scope.applyFilter = function() {
        if(!$scope.txService.disabledButton) {
          $scope.txService.disabledButton = true;
          $scope.txService.applyFilter($scope.date1, $scope.date2);
        }
      }

      $scope.disableFilter = function() {
        if($scope.txService.disabledButton) {
          $scope.txService.disabledButton = false;
          $scope.txService.disableFilter();
        }
      }

      $scope.addTx = function() {
        if(!$scope.txService.disabledButton) {
          var moneyToInt = Number($scope.moneytx);
          if (isNaN(moneyToInt)) {
            moneyToInt = 0;
          }
          $scope.txService.transactions.push([$scope.nametx, moneyToInt, $scope.datetx]);

          $scope.txService.transactions.sort(sortFunction);

          function sortFunction(a, b) {
            if (a[2] === b[2]) {
              return 0;
            }
            else {
              return (a[2] < b[2]) ? -1 : 1;
            }
          }
        }
      }

      $scope.sumAllTx = function() {
        var txs = $scope.txService.transactions;
        var sum = 0;
        for (var i = 0; i < txs.length; i++) {
          sum += txs[i][1];
        }
        return sum;
      }

      $scope.removeTx = function(index) {
        if(!$scope.txService.disabledButton) {
          $scope.txService.transactions.splice(index, 1);
        }
      }

      const ipc = require('electron').ipcRenderer;
      const selectDirBtn = document.getElementById('select-directory');
      const loadDirBtn = document.getElementById('load-directory');

      const low = require('lowdb');

      selectDirBtn.addEventListener('click', function(event) {
        ipc.send('save-dialog');
      });

      loadDirBtn.addEventListener('click', function(event) {
        if(!$scope.txService.disabledButton) {
          ipc.send('open-file-dialog')
        }
      })


      $scope.saveTxs = function() {
        ipc.on('saved-file', function(event, path) {
          const db = low(path);
          db.defaults({ values: {} }).value();
          var serializedTransactions = [];
          for(var i = 0; i < $scope.txService.transactions.length; i++) {
            serializedTransactions.push([$scope.txService.transactions[i][0],
              $scope.txService.transactions[i][1],
              [
                $scope.txService.transactions[i][2].getDate(),
                $scope.txService.transactions[i][2].getMonth() + 1,
                $scope.txService.transactions[i][2].getFullYear()
              ]
            ]);
          }
          db.set('values', serializedTransactions).value();
        });
      }

      $scope.loadTxs = function() {
        if(!$scope.txService.disabledButton) {
          ipc.on('selected-directory', function(event, path) {
            const db = low(path[0]);
            db.defaults({ values: {} }).value();
            var myValues = db.get('values').value();
            var newValues = []

            for(var i = 0; i < myValues.length; i++) {
              newValues.push([myValues[i][0], myValues[i][1],
                new Date(myValues[i][2][2] + "-" + myValues[i][2][1] + "-" + myValues[i][2][0])]);
            }
            $scope.txService.load(newValues);
            $scope.$apply();
          });
        }
      }

    }



})();
