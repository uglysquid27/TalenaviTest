var myApp = angular.module('myApp', ['ngRoute'])

myApp.config([
  '$routeProvider',
  '$locationProvider',
  function ($routeProvider, $locationProvider) {
    // Define routes
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/table/table.html',
        controller: 'AboutController'
      })
      .when('/kanban', {
        templateUrl: 'app/views/kanban/kanban.html',
        controller: 'HomeController'
      })
      .otherwise({
        redirectTo: '/'
      })

    // Enable HTML5 mode
    $locationProvider.html5Mode(true)
  }
])
