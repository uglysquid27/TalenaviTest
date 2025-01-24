(function () {
    'use strict';
  
    angular
      .module('myApp')
      .service('ApiService', ApiService);
  
    ApiService.$inject = ['$http']; 
  
    function ApiService($http) {
      const baseUrl = 'https://mocki.io/v1/f6d74629-a002-4de3-b82c-9a8bc2bc25e9'; 
  
      this.getData = function () {
        return $http.get(baseUrl) 
          .then(function (response) {
            return response.data; 
          })
          .catch(function (error) {
            throw error; 
          });
      };
  
    }
  })();
  