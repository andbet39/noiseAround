angular.module('starter')
  .controller('MessageCtrl',function ($scope,$state,$ionicPopup,$location, $state) {

    $scope.message =""

    $scope.done = function (message) {
      console.log(message)

      $state.go('home', {'message':message});
    };


  });


angular.module('starter').directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                        scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                        });
                        
                        event.preventDefault();
                }
            });
        };
});
