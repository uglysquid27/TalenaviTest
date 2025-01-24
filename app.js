import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

var myApp = angular.module('myApp', ['ngRoute']); // Define the main module

// Configure routes
myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            template: '<table-component></table-component>'  // Use the table component here
        })
        .when('/kanban', {
            template: '<kanban></kanban>'  // Use the kanban component here
        })
        .otherwise({
            redirectTo: '/'  // Default route
        });

    // Use hashbang mode for compatibility without server configuration
    $locationProvider.hashPrefix('!');

    console.log('Routes configured.');  // Debug log to check route configuration
}]);

// Define controllers (if needed for components like TableController)
myApp.controller('TableController', ['$scope', function ($scope) {
    console.log('TableController loaded.');
    // Your logic here
}]);

