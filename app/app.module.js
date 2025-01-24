var myApp = angular.module('myApp', ['ngRoute']);  

myApp.component('tableComponent', {
  templateUrl: 'app/views/table/table.html',  
  controller: 'TableController', 
  controllerAs: 'vm',  
});

// Register the kanban component
myApp.component('kanban', {
  templateUrl: 'app/views/kanban/kanban.html',  
  controller: 'TableController',  
  controllerAs: 'vm',  
});

myApp.config([
  '$routeProvider', 
  '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        template: '<table-component></table-component>'  
      })
      .when('/kanban', {
        template: '<kanban></kanban>' 
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  }
]);

