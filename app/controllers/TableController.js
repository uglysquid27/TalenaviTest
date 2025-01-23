angular.module('myApp')
  .controller('TableController', ['ApiService', function(ApiService) {
    var vm = this;

    // Initialize data and state
    vm.items = [];
    vm.filteredItems = [];
    vm.developers = [];  // List of developers for dropdown
    vm.selectedDeveloper = ''; // The selected developer for filtering
    vm.searchCriteria = {
      title: '',
      developer: '',
      status: ''
    };

    // Fetch data from API on load
    vm.loadData = function() {
      ApiService.getData()
        .then(function(response) {
          console.log('Data fetched:', response.data);
          vm.items = response.data;
          vm.developers = getUniqueDevelopers(vm.items); // Get list of unique developers
          vm.resetFilters(); // Initially show all items
        })
        .catch(function(error) {
          console.error('Error fetching data:', error);
        });
    };

    // Extract unique developers from the items
    function getUniqueDevelopers(items) {
      const developerSet = new Set();
      items.forEach(item => {
        if (item.developer) {
          developerSet.add(item.developer);
        }
      });
      return Array.from(developerSet);
    }

    // Filter tasks by selected developer
    vm.filterByDeveloper = function(developer) {
      vm.selectedDeveloper = developer;
      vm.searchCriteria.developer = developer; // Set the developer in the search criteria
      vm.filteredItems = vm.items.filter(function(item) {
        return item.developer === developer;
      });
    };

    // Add a new item
    vm.addItem = function(newItem) {
      ApiService.addData(newItem)
        .then(function(response) {
          console.log('Item added:', response.data);
          vm.items.push(response.data);
          vm.resetFilters(); // Refresh filtered items
        })
        .catch(function(error) {
          console.error('Error adding item:', error);
        });
    };

    // Edit an existing item
    vm.editItem = function(item) {
      ApiService.editData(item.id, item)
        .then(function(response) {
          console.log('Item updated:', response.data);
          var index = vm.items.findIndex(existingItem => existingItem.id === item.id);
          if (index !== -1) {
            vm.items[index] = response.data;
            vm.resetFilters(); // Refresh filtered items
          }
        })
        .catch(function(error) {
          console.error('Error updating item:', error);
        });
    };

    // Search tasks based on criteria
    vm.searchTasks = function() {
      var criteria = vm.searchCriteria;

      vm.filteredItems = vm.items.filter(function(item) {
        return (
          (!criteria.title || item.title.toLowerCase().includes(criteria.title.toLowerCase())) &&
          (!criteria.developer || item.developer.toLowerCase().includes(criteria.developer.toLowerCase())) &&
          (!criteria.status || item.status.toLowerCase().includes(criteria.status.toLowerCase()))
        );
      });

      console.log('Search results:', vm.filteredItems);
    };

    // Reset filters and show all items
    vm.resetFilters = function() {
      vm.filteredItems = [...vm.items];
      vm.searchCriteria = {
        title: '',
        developer: '',
        status: ''
      };
      vm.selectedDeveloper = ''; // Reset selected developer
    };

    // Initialize the controller by loading data
    vm.loadData();
  }]);
