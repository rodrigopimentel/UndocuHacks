// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
var app = angular.module('meanMapApp', [
  'addCtrl',
  'headerCtrl',
  'tipsCtrl',
  'geolocation',
  'gservice',
  'ngRoute'
])

    // Configures Angular routing -- showing the relevant view and controller when needed.
    .config(function($routeProvider){

        // Join Team Control Panel
        $routeProvider.when('/', {
            controller: 'addCtrl',
            templateUrl: 'partials/addForm.html',
        // Find Teammates Control Panel
        }).when('/tips', {
            controller: 'tipsCtrl',
            templateUrl: 'tips.html',
          // All else forward to the Join Team Control Panel
        }).otherwise({redirectTo:'/'})
    });
