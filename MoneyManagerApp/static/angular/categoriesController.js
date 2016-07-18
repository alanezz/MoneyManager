(function () {
    'use strict';
    const storage = require('electron-json-storage');
    angular.module('finance')
        .controller('categoriesController', ['$scope', 'transactionsService', categoriesController]);

    function categoriesController($scope, transactionsService) {
      const low = require('lowdb');
      $scope.txService = transactionsService;
      $scope.saveCategory = saveCategory;
      $scope.newCategory = "";

      $scope.removeCategory = (index) => {
        const db = low('data/categories.json')
        $scope.txService.categories.splice(index, 1);
        db.defaults({ categories: [] })
          .value();
        db.set('categories', $scope.txService.categories)
          .value();

      }

      function saveCategory() {
        const db = low('data/categories.json')
        db.defaults({ categories: [] })
          .value();
        if (db.get('categories').value().indexOf($scope.newCategory) === -1 &&
            $scope.newCategory != null && $scope.newCategory != '' &&
            $scope.newCategory != '*') {
          console.log($scope.newCategory);
          $scope.txService.categories.push($scope.newCategory);
          $scope.txService.categories.sort(sortFunction);
          db.set('categories', $scope.txService.categories)
            .value();
          function sortFunction(a, b) {
            if (a.toLowerCase() === b.toLowerCase()) {
              return 0;
            }
            else {
              return (a.toLowerCase() < b.toLowerCase()) ? -1 : 1;
            }
          }
        }

      }

    }

})();
