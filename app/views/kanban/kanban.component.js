
(function () {
    angular
      .module('myApp')
      .component('kanbanComponent', {
        templateUrl: 'app/views/kanban/kanban.html',
        controller: 'TableController',
        controllerAs: 'vm',
      });
  
  })();
  