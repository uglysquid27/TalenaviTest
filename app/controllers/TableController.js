angular.module('myApp')
  .controller('TableController', ['ApiService', function(ApiService) {
    var vm = this;

    // Initialize data and state
    vm.items = [];
    vm.filteredItems = [];
    vm.selectedColumns = [];  // Array to store selected columns for sorting (only status, priority, type)
    vm.sortOrder = 'asc';  // Default sort order is ascending
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
          vm.resetFilters(); // Initially show all items
        })
        .catch(function(error) {
          console.error('Error fetching data:', error);
        });
    };

    // Add a new item temporarily and add it to the top of the list
    vm.addNewItem = function() {
      var newItem = {
        title: 'New Task',  // Placeholder title
        developer: 'New Developer',  // Placeholder developer
        status: 'Pending',  // Placeholder status
        priority: 'Medium',  // Placeholder priority
        type: 'Feature',  // Placeholder type
        date: 'N/A',  // Placeholder date
        'Estimated SP': 0,  // Placeholder estimated SP
        'Actual SP': 0,  // Placeholder actual SP
        isEditing: false  // New item starts without editing mode
      };
      
      // Add the new item to the top of the list
      vm.items.unshift(newItem);
      vm.filteredItems.unshift(newItem);  // Ensure it's included in the filtered list
    };

    // Toggle the selected column for sorting (only status, priority, type)
    vm.toggleSortColumn = function(column) {
      if (['status', 'priority', 'type'].includes(column)) { // Only allow these columns for sorting
        // Toggle column in the array
        var index = vm.selectedColumns.indexOf(column);
        if (index === -1) {
          vm.selectedColumns.push(column); // Add to array if not already selected
        } else {
          vm.selectedColumns.splice(index, 1); // Remove from array if already selected
        }
        vm.applySort(); // Apply sorting whenever column selection changes
      }
    };

    // Set the sort order (asc or desc)
    vm.setSortOrder = function(order) {
      vm.sortOrder = order; // Set the selected sort order
      vm.applySort(); // Apply sorting with the updated order
    };

    // Apply sorting based on selected columns and order
    vm.applySort = function() {
      if (vm.selectedColumns.length > 0) {
        vm.filteredItems.sort(function(a, b) {
          var comparison = 0;

          // Compare each selected column
          for (var i = 0; i < vm.selectedColumns.length; i++) {
            var column = vm.selectedColumns[i];
            var valueA = a[column];
            var valueB = b[column];

            // Compare values based on sort order (ascending or descending)
            if (valueA < valueB) {
              comparison = (vm.sortOrder === 'asc') ? -1 : 1;
            } else if (valueA > valueB) {
              comparison = (vm.sortOrder === 'asc') ? 1 : -1;
            }

            if (comparison !== 0) {
              break; // Stop comparison if a difference is found
            }
          }

          return comparison;
        });
      }
      console.log('Sorted items:', vm.filteredItems); // Log the sorted items for debugging
    };

    // Reset filters and show all items
    vm.resetFilters = function() {
      vm.filteredItems = [...vm.items]; // Initialize filtered items with all items
      vm.searchCriteria = {
        title: '',
        developer: '',
        status: ''
      };
    };

    // Initialize the controller by loading data
    vm.loadData();
  }]);
