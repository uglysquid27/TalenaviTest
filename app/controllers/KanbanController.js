angular.module('myApp').controller('KanbanController', [
  'ApiService',
  function (ApiService) {
    var vm = this
    console.log('KanbanController loaded.') // Debug log
    // Initialize data and state
    vm.items = []
    vm.filteredItems = []
    vm.selectedColumns = [] // Array to store selected columns for sorting (only status, priority, type)
    vm.sortOrder = 'asc' // Default sort order is ascending
    vm.searchCriteria = {
      title: '',
      developer: '',
      status: ''
    }
    vm.totalEstimatedSP = 0 // Total for Estimated SP
    vm.totalActualSP = 0 // Total for Actual SP

    // Initialize counts for status, priority, and type
    vm.statusCounts = {
      'Ready to start': 0,
      'In Progress': 0,
      'Waiting for review': 0,
      'Pending Deploy': 0,
      Done: 0,
      Stuck: 0
    }

    vm.priorityCounts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
      'Best Effort': 0
    }

    vm.typeCounts = {
      'Feature Enhancements': 0,
      Other: 0,
      Bug: 0
    }

    // Fetch data from API on load
    vm.loadData = function () {
      ApiService.getData()
        .then(function (response) {
          console.log('Data fetched:', response.data)
          vm.items = response.data

          // Populate vm.developers with unique developers
          vm.developers = [...new Set(vm.items.map(item => item.developer))]

          vm.resetFilters() // Initially show all items
        })
        .catch(function (error) {
          console.error('Error fetching data:', error)
        })
    }

    // Filter by selected developer
    vm.filterByDeveloper = function (developer) {
      vm.searchCriteria.developer = developer // Set the selected developer in search criteria
      vm.filteredItems = vm.items.filter(function (item) {
        return item.developer === developer // Filter items by developer
      })
      vm.updateCounts() // Recalculate counts after filtering
      vm.updateTotals() // Recalculate totals after filtering
    }

    // Add a new item temporarily and add it to the top of the list
    vm.addNewItem = function () {
      var newItem = {
        title: 'New Task', // Placeholder title
        developer: 'New Developer', // Placeholder developer
        status: 'Pending Deploy', // Placeholder status
        priority: 'Medium', // Placeholder priority
        type: 'Bug', // Placeholder type
        date: 'N/A', // Placeholder date
        'Estimated SP': 0, // Placeholder estimated SP
        'Actual SP': 0, // Placeholder actual SP
        isEditing: false // New item starts without editing mode
      }

      // Add the new item to the top of the list
      vm.items.unshift(newItem)
      vm.filteredItems.unshift(newItem) // Ensure it's included in the filtered list
      vm.updateCounts() // Update counts after adding a new item
      vm.updateTotals() // Update totals after adding a new item
    }

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
      }
      vm.priorityCounts = {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0,
        'Best Effort': 0
      }
      vm.typeCounts = {
        'Feature Enhancements': 0,
        Other: 0,
        Bug: 0
      }

      // Count occurrences for status, priority, and type
      vm.filteredItems.forEach(function (item) {
        vm.statusCounts[item.status] = (vm.statusCounts[item.status] || 0) + 1
        vm.priorityCounts[item.priority] =
          (vm.priorityCounts[item.priority] || 0) + 1
        vm.typeCounts[item.type] = (vm.typeCounts[item.type] || 0) + 1
      })

      let totalStatus =
        vm.statusCounts['Ready to start'] +
        vm.statusCounts['In Progress'] +
        vm.statusCounts['Waiting for review'] +
        vm.statusCounts['Pending Deploy'] +
        vm.statusCounts['Done'] +
        vm.statusCounts['Stuck']

      let readyPercentage =
        (vm.statusCounts['Ready to start'] / totalStatus) * 100
      let inProgressPercentage =
        (vm.statusCounts['In Progress'] / totalStatus) * 100
      let waitingPercentage =
        (vm.statusCounts['Waiting for review'] / totalStatus) * 100
      let pendingPercentage =
        (vm.statusCounts['Pending Deploy'] / totalStatus) * 100
      let donePercentage = (vm.statusCounts['Done'] / totalStatus) * 100
      let stuckPercentage = (vm.statusCounts['Stuck'] / totalStatus) * 100

      let totalPriority =
        vm.priorityCounts['Critical'] +
        vm.priorityCounts['High'] +
        vm.priorityCounts['Medium'] +
        vm.priorityCounts['Low'] +
        vm.priorityCounts['Best Effort']
      let criticalPercentage =
        (vm.priorityCounts['Critical'] / totalPriority) * 100
      let highPercentage = (vm.priorityCounts['High'] / totalPriority) * 100
      let mediumPercentage = (vm.priorityCounts['Medium'] / totalPriority) * 100
      let lowPercentage = (vm.priorityCounts['Low'] / totalPriority) * 100
      let bestEffortPercentage =
        (vm.priorityCounts['Best Effort'] / totalPriority) * 100

      let totalType =
        vm.typeCounts['Feature Enhancements'] +
        vm.typeCounts['Other'] +
        vm.typeCounts['Bug']
      let featurePercentage =
        (vm.typeCounts['Feature Enhancements'] / totalType) * 100
      let otherPercentage = (vm.typeCounts['Other'] / totalType) * 100
      let bugPercentage = (vm.typeCounts['Bug'] / totalType) * 100

      // Calculate percentages for status
      vm.statusReadyPercentage = readyPercentage || 0
      vm.statusInProgressPercentage = inProgressPercentage || 0
      vm.statusWaitingPercentage = waitingPercentage || 0
      vm.statusPendingPercentage = pendingPercentage || 0
      vm.statusDonePercentage = donePercentage || 0
      vm.statusStuckPercentage = stuckPercentage || 0

      // Calculate percentages for priority
      vm.priorityCriticalPercentage = criticalPercentage || 0
      vm.priorityHighPercentage = highPercentage || 0
      vm.priorityMediumPercentage = mediumPercentage || 0
      vm.priorityLowPercentage = lowPercentage || 0
      vm.priorityBestEffortPercentage = bestEffortPercentage || 0

      // Calculate percentages for type
      vm.typeFeaturePercentage = featurePercentage || 0
      vm.typeOtherPercentage = otherPercentage || 0
      vm.typeBugPercentage = bugPercentage || 0

      // Calculate the percentages for each category
      vm.calculatePercentages()
    }

    // Calculate percentages for status, priority, and type
    vm.calculatePercentages = function () {
      vm.statusPercentages = {}
      vm.priorityPercentages = {}
      vm.typePercentages = {}

      var totalItems = vm.filteredItems.length

      // Calculate percentages for status
      angular.forEach(vm.statusCounts, function (count, status) {
        vm.statusPercentages[status] = ((count / totalItems) * 100).toFixed(1)
      })

      // Calculate percentages for priority
      angular.forEach(vm.priorityCounts, function (count, priority) {
        vm.priorityPercentages[priority] = ((count / totalItems) * 100).toFixed(
          1
        )
      })

      // Calculate percentages for type
      angular.forEach(vm.typeCounts, function (count, type) {
        vm.typePercentages[type] = ((count / totalItems) * 100).toFixed(1)
      })
    }

    // Update totals for Estimated SP and Actual SP
    vm.updateTotals = function () {
      vm.totalEstimatedSP = vm.filteredItems.reduce(
        (total, item) => total + (item['Estimated SP'] || 0),
        0
      )
      vm.totalActualSP = vm.filteredItems.reduce(
        (total, item) => total + (item['Actual SP'] || 0),
        0
      )
    }

    // Toggle the selected column for sorting (only status, priority, type)
    vm.toggleSortColumn = function (column) {
      if (['status', 'priority', 'type'].includes(column)) {
        // Only allow these columns for sorting
        // Toggle column in the array
        var index = vm.selectedColumns.indexOf(column)
        if (index === -1) {
          vm.selectedColumns.push(column) // Add to array if not already selected
        } else {
          vm.selectedColumns.splice(index, 1) // Remove from array if already selected
        }
        vm.applySort() // Apply sorting whenever column selection changes
      }
    }

    // Set the sort order (asc or desc)
    vm.setSortOrder = function (order) {
      vm.sortOrder = order // Set the selected sort order
      vm.applySort() // Apply sorting with the updated order
    }

    // Apply sorting based on selected columns and order
    vm.applySort = function () {
      if (vm.selectedColumns.length > 0) {
        vm.filteredItems.sort(function (a, b) {
          var comparison = 0

          // Compare each selected column
          for (var i = 0; i < vm.selectedColumns.length; i++) {
            var column = vm.selectedColumns[i]
            var valueA = a[column]
            var valueB = b[column]

            // Compare values based on sort order (ascending or descending)
            if (valueA < valueB) {
              comparison = vm.sortOrder === 'asc' ? -1 : 1
            } else if (valueA > valueB) {
              comparison = vm.sortOrder === 'asc' ? 1 : -1
            }

            if (comparison !== 0) {
              break // Stop comparison if a difference is found
            }
          }

          return comparison
        })
      }
      vm.updateCounts() // Recalculate counts after sorting
      vm.updateTotals() // Recalculate totals after sorting
      console.log('Sorted items:', vm.filteredItems) // Log the sorted items for debugging
    }

    // Reset filters and show all items
    // Reset filters and show all items
    vm.resetFilters = function () {
      vm.filteredItems = [...vm.items] // Initialize filtered items with all items
      vm.searchCriteria = {
        title: '',
        developer: '',
        status: ''
      }
      vm.updateCounts() // Update counts after resetting filters
      vm.updateTotals() // Update totals after resetting filters
    }

    vm.editDate = function (item) {
      if (!item.date) {
        item.date = new Date('0000-01-01') // Optional: Set a default value for invalid dates
      }
      console.log('Date edited for item:', item)
    }

    // Calculate percentage of each status
    vm.calculateStatusPercentages = function () {
      var totalItems = vm.filteredItems.length

      vm.statusReadyPercentage =
        (vm.statusCounts['Ready to start'] / totalItems) * 100 || 0
      vm.statusInProgressPercentage =
        (vm.statusCounts['In Progress'] / totalItems) * 100 || 0
      vm.statusWaitingPercentage =
        (vm.statusCounts['Waiting for review'] / totalItems) * 100 || 0
      vm.statusPendingPercentage =
        (vm.statusCounts['Pending Deploy'] / totalItems) * 100 || 0
      vm.statusDonePercentage =
        (vm.statusCounts['Done'] / totalItems) * 100 || 0
      vm.statusStuckPercentage =
        (vm.statusCounts['Stuck'] / totalItems) * 100 || 0
    }

    // Calculate percentage of each priority
    vm.calculatePriorityPercentages = function () {
      var totalItems = vm.filteredItems.length

      vm.priorityCriticalPercentage =
        (vm.priorityCounts['Critical'] / totalItems) * 100 || 0
      vm.priorityHighPercentage =
        (vm.priorityCounts['High'] / totalItems) * 100 || 0
      vm.priorityMediumPercentage =
        (vm.priorityCounts['Medium'] / totalItems) * 100 || 0
      vm.priorityLowPercentage =
        (vm.priorityCounts['Low'] / totalItems) * 100 || 0
      vm.priorityBestEffortPercentage =
        (vm.priorityCounts['Best Effort'] / totalItems) * 100 || 0
    }

    // Calculate percentage of each type
    vm.calculateTypePercentages = function () {
      var totalItems = vm.filteredItems.length

      vm.typeFeaturePercentage =
        (vm.typeCounts['Feature Enhancements'] / totalItems) * 100 || 0
      vm.typeEnhancementsPercentage =
        (vm.typeCounts['Other'] / totalItems) * 100 || 0
      vm.typeOtherPercentage = (vm.typeCounts['Bug'] / totalItems) * 100 || 0
      vm.typeBugPercentage = (vm.typeCounts['Bug'] / totalItems) * 100 || 0
    }

    // Update counts and percentages after adding or modifying items
    vm.updateCountsAndPercentages = function () {
      vm.updateCounts() // Update the counts
      vm.calculateStatusPercentages() // Calculate the percentages for status
      vm.calculatePriorityPercentages() // Calculate the percentages for priority
      vm.calculateTypePercentages() // Calculate the percentages for type
      vm.updateTotals() // Update totals
    }

    // Call `updateCountsAndPercentages` to recalculate after data is loaded or updated
    vm.updateCountsAndPercentages()

    // Initialize the controller by loading data
    vm.loadData()
  }
])
