'use strict';

(function () {
  var app = angular.module('finance', ['ngRoute','ngMaterial']).config(['$routeProvider', appRoutes]);

  function appRoutes($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'static/templates/main.html' ,
      controller: 'mainController',
      controllerAs: 'mainCtrl'
    }).when('/chart', {
      templateUrl: 'static/templates/chart.html' ,
      controller: 'chartController',
      controllerAs: 'chartCtrl'
    }).when('/about', {
      templateUrl: 'static/templates/about.html' ,
      controller: 'aboutController',
      controllerAs: 'aboutCtrl'
    }).when('/categories', {
      templateUrl: 'static/templates/categories.html' ,
      controller: 'categoriesController',
      controllerAs: 'categoriesCtrl'
    });
    $routeProvider.otherwise({ redirectTo: '/' });
  }
})();
