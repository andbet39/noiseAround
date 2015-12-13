angular.module('starter')
  .controller('StreamCtrl',function ($scope,$rootScope,$state,$ionicPopup,$location, $state) {


    $scope.posts=[];

    $scope.newPost =  function(){

      $state.go('message');
    };

    $scope.init = function () {

      $scope.posts=[];
      
      if($rootScope.parse != true){
          console.log('initialize parse');
         Parse.initialize("dcG3cpe1HQAwfzKBV9Tsuxaici1AKlb3udRrx2Me", "1HHiju4wsBWeSlbJ7WSZw0YUTENuDUtk9ujwAXLe");
         $rootScope.parse = true;

      }

      var query = new Parse.Query('Post');
      query.descending("createdAt");

      query.find({
        success: function(results) {

          for (var i = 0; i < results.length; i++) {
            var object = results[i];

            var post ={}
            post.imgUrl = object.get('file').url();
            post.message= object.get('message');
            post.created = object.get('createdAt');

            console.log(post);

            $scope.posts.push(post);
                   $scope.$broadcast('scroll.refreshComplete');

            $scope.$apply();

          }



        },
        error: function(error) {
          alert("Error: " + error.code + " " + error.message);
        }
      });



    };

    $scope.init();

  });


