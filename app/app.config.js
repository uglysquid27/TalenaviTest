myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            template: '<table-component></table-component>' // Match component name
        })
        .when('/kanban', {
            template: '<kanban></kanban>'
        })
        .otherwise({
            redirectTo: '/'
        });

    // Use hashbang mode for compatibility without server configuration
    $locationProvider.hashPrefix('!');
    console.log('Routes configured.'); // Debug log
}]);
