(function () {
    'use strict';
  
    angular
      .module('myApp')
      .service('ApiService', ApiService);
  
    ApiService.$inject = ['$http']; // Inject $http
  
    function ApiService($http) {
      const baseUrl = 'https://mocki.io/v1/f6d74629-a002-4de3-b82c-9a8bc2bc25e9'; // Your base API URL
  
      // Get data from API
      this.getData = function () {
        return $http.get(baseUrl) // Return the promise directly from $http
          .then(function (response) {
            return response.data; // Resolve the data
          })
          .catch(function (error) {
            console.error('Error fetching data:', error);
            throw error; // Handle errors
          });
      };
  
      // Post new data
      this.addTask = function (task) {
        return $http.post(baseUrl, task) // Return the promise directly from $http
          .then(function (response) {
            return response.data;
          })
          .catch(function (error) {
            console.error('Error adding task:', error);
            throw error;
          });
      };
  
      // Edit existing data
      this.editTask = function (taskId, updatedTask) {
        const editUrl = `${baseUrl}/${taskId}`; // Dynamic edit URL with taskId
        return $http.put(editUrl, updatedTask) // Return the promise directly from $http
          .then(function (response) {
            return response.data;
          })
          .catch(function (error) {
            console.error('Error editing task:', error);
            throw error;
          });
      };
    }
  })();
  