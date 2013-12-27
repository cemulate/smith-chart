app = angular.module("RedditSearchApplication", [])

app.config(['$compileProvider', function($compileProvider) {   
    $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob):/);
}])

app.controller("MainController", ["$scope", function ($scope) {
    
    $scope.things = [
        "Thing1",
        "Thing2",
        "Thing3"
    ];
    
}])