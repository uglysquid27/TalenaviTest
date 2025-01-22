myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            template: '<main-table></main-table>'
        })
        .when('/kanban', {
            template: '<kanban></kanban>'
        })
        .otherwise({
            redirectTo: '/'
        });

    // Use hashbang mode for compatibility without server configuration
    $locationProvider.hashPrefix('!');
}]);
