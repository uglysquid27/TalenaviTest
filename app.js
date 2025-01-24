import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

var myApp = angular.module('myApp', ['ngRoute']); 

myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
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

    $locationProvider.hashPrefix('!');

}]);

myApp.controller('TableController', ['$scope', function ($scope) {
}]);

