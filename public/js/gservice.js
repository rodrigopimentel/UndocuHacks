// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

        window.upvote = function(reportId) {
          $http.post('/reports/' + reportId + '/renew').success(function(response) {
            localStorage.setItem(reportId, new Date().getTime());
          }).error(function(e) { console.error(e); });
        };

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var googleMapService = {};

        // Array of locations obtained from API calls
        var locations = [];

        // Variables we'll use to help us pan to the right spot
        var lastMarker;
        var currentSelectedMarker;

        // Selected Location (initialize to center of America)
        var selectedLat = 34.0127624;
        var selectedLong = -118.3698837;

        // Handling Clicks and location selection
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
        googleMapService.refresh = function(latitude, longitude){

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // Perform an AJAX call to get all of the records in the db.
            $http.get('/reports').success(function(response){

                // Convert the results into Google Map Format
                locations = convertToMapPoints(response);

                // Then initialize the map.
                initialize(latitude, longitude);
            }).error(function(){});
        };

        // Private Inner Functions
        // --------------------------------------------------------------
        // Convert a JSON of reports into map points
        var convertToMapPoints = function(response){

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.length; i++) {
                var report = response[i];

                var lastUpvote = localStorage.getItem(report._id);
                var disabled = lastUpvote && new Date() < new Date(parseInt(lastUpvote) + 10800000)

                // Create popup windows for each record
                var  contentString =
                    '<p><b>Incident</b>: ' + report.incident +
                    '<br><b>Number of Agents: </b>: ' + report.numOfAgents +
                    '<br><b>Event Description: </b>: ' + report.eventDescription +
                    '<br><b>People Detained: </b>: ' + report.detained +
                    '<br><b>Number of Detained: </b>: ' + (report.numberOfDetained || '0') +
                    '<br><button onclick="this.disabled = true; upvote(\'' + report._id + '\')" class="btn btn-danger btn-block" style="margin-top: 8px"' + (disabled ? ' disabled' : '') + '>Verify</button>'
                    '</p>';

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locations.push({
                    latlon: new google.maps.LatLng(report.location[1], report.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 400
                    }),
                    incident: report.incident,
                    numOfAgents: report.numOfAgents,
                    eventDescription: report.eventDescription,
                    detained: report.detained,
                    numberOfDetained: report.numberOfDetained

            });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };

    // Initializes the map
    var initialize = function(latitude, longitude) {

      // Uses the selected lat, long as starting point
      var myLatLng = {lat: selectedLat, lng: selectedLong};

      // If map has not been created already...
      if (!map){

        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: myLatLng
        });
      }

      // Loop through each location in the array and place a marker
      locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Justice Watch Map",
            icon: "http://labs.google.com/ridefinder/images/mm_20_black.png",
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e){

          // When clicked, open the selected marker's message
          currentSelectedMarker = n;
          n.message.open(map, marker);
        });
      });

      // Set initial location as a bouncing red marker
      var initialLocation = new google.maps.LatLng(latitude, longitude);
      var marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });
      lastMarker = marker;

      // Function for moving to a selected location
      map.panTo(new google.maps.LatLng(latitude, longitude));

      // Clicking on the Map moves the bouncing red marker
      google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
          position: e.latLng,
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // When a new spot is selected, delete the old red bouncing marker
        if(lastMarker){
          lastMarker.setMap(null);
        }

        // Create a new red bouncing marker and move to it
        lastMarker = marker;
        map.panTo(marker.position);

        // Update Broadcasted Variable (lets the panels know to change their lat, long values)
        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
      });
    };

    // Refresh the page upon window load. Use the initial latitude and longitude
    google.maps.event.addDomListener(window, 'load',
      googleMapService.refresh(selectedLat, selectedLong));

    return googleMapService;
  });
