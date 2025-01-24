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
