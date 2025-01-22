// Include the app.module.js and app.config.js in this file
var myApp = angular.module('myApp', ['ngRoute']); // Define the main module

// Configure routes
myApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/views/home.view.html',
            controller: 'HomeController'
        })
        .when('/about', {
            templateUrl: 'app/views/about.view.html',
            controller: 'AboutController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

// Define controllers
myApp.controller('HomeController', ['$scope', function ($scope) {
    $scope.message = "Welcome to the Home Page!";
}]);

myApp.controller('AboutController', ['$scope', function ($scope) {
    $scope.message = "Welcome to the About Page!";
}]);
