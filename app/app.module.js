var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    // Define routes
    $routeProvider
        .when('/', {
            templateUrl: 'app/views/kanban/kanban.html',
            controller: 'HomeController'
        })
        .when('/about', {
            templateUrl: 'app/views/mainTable/mainTable.html',
            controller: 'AboutController'
        })
        .otherwise({
            redirectTo: '/'
        });

    // Enable HTML5 mode
    $locationProvider.html5Mode(true);
}]);
