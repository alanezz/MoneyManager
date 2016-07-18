(function () {
    'use strict';
    angular.module('finance')
        .service('transactionsService', transactionsService);

    function transactionsService() {
      const low = require('lowdb');
      var transactions = [];
      var copyTransactionsFilter = [];
      var categories = [];
      var disabledButton = false;

      function initCategories() {
        const db = low('data/categories.json')
        db.defaults({ categories: [] })
          .value();
        var loadedCategories = db.get('categories')
          .value();
        loadCategories(loadedCategories);

        categories.sort(sortFunction);
        function sortFunction(a, b) {
          if (a.toLowerCase() === b.toLowerCase()) {
            return 0;
          }
          else {
            return (a.toLowerCase() < b.toLowerCase()) ? -1 : 1;
          }
        }
      }


      function load(values) {
        angular.copy(values, transactions);
      }

      function loadCategories(values) {
        angular.copy(values, categories);
      }

      function applyFilter(date1, date2, category) {
        angular.copy(transactions, copyTransactionsFilter);
        if(date1 === null && date2 === null && category != "*") {

          var newTransactions = transactions.filter((transaction) => {
            if(transaction[3] === category) {
              return true;
            }
            return false;
          });
          angular.copy(newTransactions, transactions);
        } else if(date1 < date2 && date1 != null && date2 != null) {
          var newTransactions = transactions.filter((transaction) => {
            var acceptCategory = category === '*' || category === transaction[3];
            console.log(acceptCategory);
            if(transaction[2] >= date1 && transaction[2] <= date2 && acceptCategory) {
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
        categories: categories,
        load: load,
        applyFilter: applyFilter,
        disableFilter: disableFilter,
        disabledButton: disabledButton,
        loadCategories: loadCategories,
        initCategories: initCategories
      };
    }



})();
