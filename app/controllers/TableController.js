angular.module('myApp').controller('TableController', [
  'ApiService',
  function (ApiService) {
    var vm = this;

    // Initialize data and state
    vm.items = [];
    vm.filteredItems = [];
    vm.selectedColumns = [];
    vm.sortOrder = 'asc';
    vm.searchCriteria = {
      title: '',
      developer: '',
      status: ''
    };
    vm.totalEstimatedSP = 0;
    vm.totalActualSP = 0;

    // Initialize counts
    vm.statusCounts = {
      'Ready to start': 0,
      'In Progress': 0,
      'Waiting for review': 0,
      'Pending Deploy': 0,
      Done: 0,
      Stuck: 0
    };
    vm.priorityCounts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
      'Best Effort': 0
    };
    vm.typeCounts = {
      'Feature Enhancements': 0,
      Other: 0,
      Bug: 0
    };

    // Fetch data from API on load
    vm.loadData = function () {
      ApiService.getData()
        .then(function (response) {
          console.log('Data fetched:', response.data);
          vm.items = response.data;

          // Populate vm.developers with unique developers
          vm.developers = [...new Set(vm.items.map(item => item.developer))];

          vm.resetFilters(); // Initially show all items
        })
        .catch(function (error) {
          console.error('Error fetching data:', error);
        });
    };

      // Method for handling dragstart event
      vm.onDragStart = function (event, item) {
        event.dataTransfer.setData("text/plain", JSON.stringify(item));
      };
  
      // Method for handling drop event
      vm.onDrop = function (event, targetStatus) {
        event.preventDefault();
        var item = JSON.parse(event.dataTransfer.getData("text/plain"));
        item.status = targetStatus;  // Change the item's status based on the drop target
        ApiService.updateItem(item)  // Update the item in the backend (make sure this method exists)
          .then(function () {
            // Refresh the filtered items after drop (you might need to refetch or update the items list)
            vm.loadData();
          })
          .catch(function (error) {
            console.error('Error updating item:', error);
          });
      };
  
      // Initialize the controller and load data
      vm.loadData = function () {
        ApiService.getData()
          .then(function (response) {
            vm.items = response.data;
            vm.filteredItems = vm.items; // Set your filtered items as per status, etc.
          })
          .catch(function (error) {
            console.error('Error loading data:', error);
          });
      };

    // Add new item temporarily and add it to the top of the list
    vm.addNewItem = function () {
      var newItem = {
        title: 'New Task', 
        developer: 'New Developer', 
        status: 'Pending Deploy', 
        priority: 'Medium', 
        type: 'Bug', 
        date: 'N/A', 
        'Estimated SP': 0, 
        'Actual SP': 0, 
        isEditing: false
      };

      // Add the new item to the top of the list
      vm.items.unshift(newItem);
      vm.filteredItems.unshift(newItem); 
      vm.updateCounts(); 
      vm.updateTotals();
    };

    // Update counts for status, priority, and type
    vm.updateCounts = function () {
      // Reset the counts
      vm.statusCounts = {
        'Ready to start': 0,
        'In Progress': 0,
        'Waiting for review': 0,
        'Pending Deploy': 0,
        Done: 0,
        Stuck: 0
      };
      vm.priorityCounts = {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0,
        'Best Effort': 0
      };
      vm.typeCounts = {
        'Feature Enhancements': 0,
        Other: 0,
        Bug: 0
      };

      // Count occurrences for status, priority, and type
      vm.filteredItems.forEach(function (item) {
        vm.statusCounts[item.status] = (vm.statusCounts[item.status] || 0) + 1;
        vm.priorityCounts[item.priority] = (vm.priorityCounts[item.priority] || 0) + 1;
        vm.typeCounts[item.type] = (vm.typeCounts[item.type] || 0) + 1;
      });

      vm.calculatePercentages(); 
    };

    // Calculate percentages for status, priority, and type
    vm.calculatePercentages = function () {
      var totalItems = vm.filteredItems.length;

      // Calculate percentages for status
      angular.forEach(vm.statusCounts, function (count, status) {
        vm.statusPercentages[status] = ((count / totalItems) * 100).toFixed(1);
      });

      // Calculate percentages for priority
      angular.forEach(vm.priorityCounts, function (count, priority) {
        vm.priorityPercentages[priority] = ((count / totalItems) * 100).toFixed(1);
      });

      // Calculate percentages for type
      angular.forEach(vm.typeCounts, function (count, type) {
        vm.typePercentages[type] = ((count / totalItems) * 100).toFixed(1);
      });
    };

    // Update totals for Estimated SP and Actual SP
    vm.updateTotals = function () {
      vm.totalEstimatedSP = vm.filteredItems.reduce(
        (total, item) => total + (item['Estimated SP'] || 0),
        0
      );
      vm.totalActualSP = vm.filteredItems.reduce(
        (total, item) => total + (item['Actual SP'] || 0),
        0
      );
    };

    // Reset filters and show all items
    vm.resetFilters = function () {
      vm.filteredItems = [...vm.items]; 
      vm.searchCriteria = {
        title: '',
        developer: '',
        status: ''
      };
      vm.updateCounts();
      vm.updateTotals();
    };

    // Initialize the controller by loading data
    vm.loadData();
  }
]);
