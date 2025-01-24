angular.module('myApp').controller('TableController', [
  'ApiService',
  function (ApiService) {
    var vm = this

    vm.items = []
    vm.filteredItems = []
    vm.selectedColumns = []
    vm.sortOrder = 'asc'
    vm.searchCriteria = {
      title: '',
      developer: '',
      status: ''
    }
    vm.totalEstimatedSP = 0
    vm.totalActualSP = 0

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

    vm.loadData = function () {
      ApiService.getData()
        .then(function (response) {
          vm.items = response.data
          vm.developers = [...new Set(vm.items.map(item => item.developer))]
          vm.resetFilters()
        })
        .catch(function (error) {})
    }

    vm.filterByDeveloper = function (developer) {
      vm.searchCriteria.developer = developer
      vm.filteredItems = vm.items.filter(function (item) {
        return item.developer === developer
      })
      vm.updateCounts()
      vm.updateTotals()
    }

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
      }
      vm.items.unshift(newItem)
      vm.filteredItems.unshift(newItem)
      vm.updateCounts()
      vm.updateTotals()
    }

    vm.updateCounts = function () {
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

      vm.statusReadyPercentage = readyPercentage || 0
      vm.statusInProgressPercentage = inProgressPercentage || 0
      vm.statusWaitingPercentage = waitingPercentage || 0
      vm.statusPendingPercentage = pendingPercentage || 0
      vm.statusDonePercentage = donePercentage || 0
      vm.statusStuckPercentage = stuckPercentage || 0

      vm.priorityCriticalPercentage = criticalPercentage || 0
      vm.priorityHighPercentage = highPercentage || 0
      vm.priorityMediumPercentage = mediumPercentage || 0
      vm.priorityLowPercentage = lowPercentage || 0
      vm.priorityBestEffortPercentage = bestEffortPercentage || 0

      vm.typeFeaturePercentage = featurePercentage || 0
      vm.typeOtherPercentage = otherPercentage || 0
      vm.typeBugPercentage = bugPercentage || 0

      vm.calculatePercentages()
    }

    vm.calculatePercentages = function () {
      vm.statusPercentages = {}
      vm.priorityPercentages = {}
      vm.typePercentages = {}

      var totalItems = vm.filteredItems.length

      angular.forEach(vm.statusCounts, function (count, status) {
        vm.statusPercentages[status] = ((count / totalItems) * 100).toFixed(1)
      })

      angular.forEach(vm.priorityCounts, function (count, priority) {
        vm.priorityPercentages[priority] = ((count / totalItems) * 100).toFixed(
          1
        )
      })

      angular.forEach(vm.typeCounts, function (count, type) {
        vm.typePercentages[type] = ((count / totalItems) * 100).toFixed(1)
      })
    }

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

    vm.toggleSortColumn = function (column) {
      if (['status', 'priority', 'type'].includes(column)) {
        var index = vm.selectedColumns.indexOf(column)
        if (index === -1) {
          vm.selectedColumns.push(column)
        } else {
          vm.selectedColumns.splice(index, 1)
        }
        vm.applySort()
      }
    }

    vm.setSortOrder = function (order) {
      vm.sortOrder = order
      vm.applySort()
    }

    vm.applySort = function () {
      if (vm.selectedColumns.length > 0) {
        vm.filteredItems.sort(function (a, b) {
          var comparison = 0
          for (var i = 0; i < vm.selectedColumns.length; i++) {
            var column = vm.selectedColumns[i]
            var valueA = a[column]
            var valueB = b[column]

            if (valueA < valueB) {
              comparison = vm.sortOrder === 'asc' ? -1 : 1
            } else if (valueA > valueB) {
              comparison = vm.sortOrder === 'asc' ? 1 : -1
            }

            if (comparison !== 0) {
              break
            }
          }
          return comparison
        })
      }
      vm.updateCounts()
      vm.updateTotals()
    }

    vm.resetFilters = function () {
      vm.filteredItems = [...vm.items]
      vm.searchCriteria = {
        title: '',
        developer: '',
        status: ''
      }
      vm.updateCounts()
      vm.updateTotals()
    }

    vm.editDate = function (item) {
      if (!item.date) {
        item.date = new Date('0000-01-01')
      }
    }

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

    vm.calculateTypePercentages = function () {
      var totalItems = vm.filteredItems.length

      vm.typeFeaturePercentage =
        (vm.typeCounts['Feature Enhancements'] / totalItems) * 100 || 0
      vm.typeEnhancementsPercentage =
        (vm.typeCounts['Other'] / totalItems) * 100 || 0
      vm.typeOtherPercentage = (vm.typeCounts['Bug'] / totalItems) * 100 || 0
      vm.typeBugPercentage = (vm.typeCounts['Bug'] / totalItems) * 100 || 0
    }

    vm.updateCountsAndPercentages = function () {
      vm.updateCounts()
      vm.calculateStatusPercentages()
      vm.calculatePriorityPercentages()
      vm.calculateTypePercentages()
      vm.updateTotals()
    }

    vm.updateCountsAndPercentages()

    vm.loadData()
  }
])
