// Creates the addCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

  // Initializes Variables
  // ----------------------------------------------------------------------------
  $scope.formData = {};
  var coords = {};
  var lat = 0;
  var long = 0;

  // Set initial coordinates to the center of the US
  $scope.formData.longitude = -118.3698837;
  $scope.formData.latitude = 34.0127624;

  // Get Report's actual coordinates based on HTML5 at window load
  geolocation.getLocation().then(function(data){

    // Set the latitude and longitude equal to the HTML5 coordinates
    coords = {lat:data.coords.latitude, long:data.coords.longitude};

    // Display coordinates in location textboxes rounded to three decimal points
    $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
    $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

    gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

  });

  // Functions
  // ----------------------------------------------------------------------------

  // Get coordinates based on mouse click. When a click event is detected....
  $rootScope.$on("clicked", function(){

    // Run the gservice functions associated with identifying coordinates
    $scope.$apply(function(){
      $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
      $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
    });
  });

  // Creates a new report based on the form fields
  $scope.createReport = function() {

    // Grabs all of the text box fields
    var reportData = {
      incident: $scope.formData.incident,
      numOfAgents: $scope.formData.numOfAgents,
      eventDescription: $scope.formData.eventDescription,
      detained: $scope.formData.detained,
      numberOfDetained: $scope.formData.numberOfDetained,
      location: [$scope.formData.longitude, $scope.formData.latitude],
    };


    // Saves the report data to the db
    $http.post('/reports', reportData)
      .success(function (data) {

        // Once complete, clear the form (except location)
        $scope.formData.incident = "";
        $scope.formData.numOfAgents = "";
        $scope.formData.eventDescription = "";
        $scope.formData.detained = "";
        $scope.formData.numberOfDetained = "";


        // Refresh the map with new data
        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });
  };
});
