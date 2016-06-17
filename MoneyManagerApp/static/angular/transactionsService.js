(function () {
    'use strict';
    angular.module('finance')
        .service('transactionsService', transactionsService);

    function transactionsService() {
      var transactions = [];
      var copyTransactionsFilter = [];
      var disabledButton = false;


      function load(values) {
        angular.copy(values, transactions);
      }

      function applyFilter(date1, date2) {
        if(date1 < date2) {
          angular.copy(transactions, copyTransactionsFilter);
          var newTransactions = transactions.filter((transaction) => {
            if(transaction[2] >= date1 &&  transaction[2] <= date2) {
              return true;
            }
            return false;
          });
          angular.copy(newTransactions, transactions);
        }
      }

      function disableFilter() {
        angular.copy(copyTransactionsFilter, transactions);
        copyTransactionsFilter = [];
      }

      return {
        transactions: transactions,
        load: load,
        applyFilter: applyFilter,
        disableFilter: disableFilter,
        disabledButton: disabledButton
      };
    }



})();
