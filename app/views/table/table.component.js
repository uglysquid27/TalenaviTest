(function () {
    angular
      .module('myApp')
      .component('tableComponent', {
        templateUrl: 'app/views/table/table.html',
        controller: 'TableController',
        controllerAs: 'vm',
      });
  
    console.log('tableComponent registered.'); // Debug log
  })();
  