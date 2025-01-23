// Define the AngularJS module
var myApp = angular.module('myApp', ['ngRoute']);  // Using ngRoute for routing

// Register the table component
myApp.component('tableComponent', {
  templateUrl: 'app/views/table/table.html',  // Path to the HTML file
  controller: 'TableController',  // The controller for this component
  controllerAs: 'vm',  // Alias for the controller (optional)
});

// Register the kanban component
myApp.component('kanban', {
  templateUrl: 'app/views/kanban/kanban.html',  // Path to the Kanban view HTML
  controller: 'KanbanController',  // The controller for the kanban component
  controllerAs: 'vm',  // Alias for the controller (optional)
});

// Configure routes
myApp.config([
  '$routeProvider', 
  '$locationProvider',
  function ($routeProvider, $locationProvider) {
    // Define routes with components
    $routeProvider
      .when('/', {
        template: '<table-component></table-component>'  // Use the component in routing
      })
      .when('/kanban', {
        template: '<kanban></kanban>'  // Use the kanban component in routing
      })
      .otherwise({
        redirectTo: '/'
      });

    // Enable HTML5 mode for cleaner URLs
    $locationProvider.html5Mode(true);
  }
]);

// Optionally add console logs to verify registration
console.log('Components registered: tableComponent, kanban');
