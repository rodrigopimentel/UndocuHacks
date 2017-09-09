var tipsCtrl = angular.module('tipsCtrl', []);
tipsCtrl.controller('tipsCtrl', function($scope) {
    // // Sets the isActive value based on the current URL location
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});
