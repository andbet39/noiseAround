angular.module('starter')
  .controller('HomeCtrl',function ($scope,$state,$ionicPopup,$location,$ionicModal,$ionicViewService, $state,$stateParams,$cordovaCamera) {


    $scope.message = $stateParams.message;

    console.log($stateParams);

  $scope.goBack = function(){
    $ionicHistory.goBack();
  };

    $scope.reloadCanvas = function(image){

      $scope.canvas.clear();

      fabric.Image.fromURL(image, function(oImg) {

        oImg.scaleToWidth($scope.canvas.width);
        oImg.hasBorders=false;
        oImg.hasControls =false;
        oImg.hasRotatingPoint= false;

        $scope.canvas.setBackgroundImage(oImg);

        $scope.canvas.renderAll();
      });


      var text =  new fabric.Text($scope.message, {
        fontFamily: 'LatoWebHeavy',
        fontSize:30,
        left: $scope.canvas.width/2,
        top: $scope.canvas.height/2 ,
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false
      });

      $scope.formatted = wrapCanvasText(text,$scope.canvas,$scope.canvas.width-50,$scope.canvas.height,'center');

      $scope.formatted.fill = '#efefef';

      $scope.canvas.add($scope.formatted);

      $scope.formatted.centerV();
      $scope.formatted.centerH();

      $scope.formatted.stroke = '#000000';
      $scope.formatted.strokeWidth =  1;

      $scope.canvas.renderAll();

    };

    $scope.create = function () {

        c = document.getElementById('c');
        var size = window.innerWidth;

        c.width = size;
        c.height = size;//window.innerHeight-200;


        $scope.canvas = new fabric.Canvas("c");
        $scope.canvas.allowTouchScrolling= false;


          $scope.reloadCanvas('img/bg1.jpg');

    };


    $scope.create();


    $scope.post = function (){


      var imgData = $scope.canvas.toDataURL('png');
      console.log(imgData);


      var file = new Parse.File("image.png", { base64: imgData });

      file.save().then(function() {

        var post = new Parse.Object("Post");
            post.set("message", $scope.message);
            post.set("file", file);
            post.save();

            $ionicViewService.nextViewOptions({
            disableBack: true
            });

            $state.go('stream');

      }, function(error) {


      });
    };




    $scope.takePicture = function() {
        console.log("Take picture");

            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA, //$scope.sourceType, //Camera.PictureSourceType.CAMERA,//Camera.PictureSourceType.LIBRARY,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1000,
                targetHeight: 1000,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation:true
            };



            $cordovaCamera.getPicture(options).then(function(imageData) {
                 var imageURI= "data:image/jpeg;base64," + imageData;

                $scope.reloadCanvas(imageURI);

             });
        };




  });




//// FINE DEL CONTROLLER
////////////////////////////////////

angular.module('starter').factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}]);


function wrapCanvasText(t, canvas, maxW, maxH, justify) {

  if (typeof maxH === "undefined") {
    maxH = 0;
  }
  var words = t.text.split(" ");
  var formatted = '';

  // This works only with monospace fonts
  justify = justify || 'left';

  // clear newlines
  var sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, "");
  // calc line height
  var lineHeight = new fabric.Text(sansBreaks, {
    fontFamily: t.fontFamily,
    fontSize: t.fontSize
  }).height;

  // adjust for vertical offset
  var maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
  var context = canvas.getContext("2d");


  context.font = t.fontSize + "px " + t.fontFamily;
  var currentLine = '';
  var breakLineCount = 0;

  n = 0;
  while (n < words.length) {
    var isNewLine = currentLine == "";
    var testOverlap = currentLine + ' ' + words[n];

    // are we over width?
    var w = context.measureText(testOverlap).width;

    if (w < maxW) { // if not, keep adding words
      if (currentLine != '') currentLine += ' ';
      currentLine += words[n];
      // formatted += words[n] + ' ';
    } else {

      // if this hits, we got a word that need to be hypenated
      if (isNewLine) {
        var wordOverlap = "";

        // test word length until its over maxW
        for (var i = 0; i < words[n].length; ++i) {

          wordOverlap += words[n].charAt(i);
          var withHypeh = wordOverlap + "-";

          if (context.measureText(withHypeh).width >= maxW) {
            // add hyphen when splitting a word
            withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
            // update current word with remainder
            words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
            formatted += withHypeh; // add hypenated word
            break;
          }
        }
      }
      while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
        currentLine = ' ' + currentLine;

      while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
        currentLine = ' ' + currentLine + ' ';

      formatted += currentLine + '\n';
      breakLineCount++;
      currentLine = "";

      continue; // restart cycle
    }
    if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
      // add ... at the end indicating text was cutoff
      formatted = formatted.substr(0, formatted.length - 3) + "...\n";
      currentLine = "";
      break;
    }
    n++;
  }

  if (currentLine != '') {
    while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
      currentLine = ' ' + currentLine;

    while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
      currentLine = ' ' + currentLine + ' ';

    formatted += currentLine + '\n';
    breakLineCount++;
    currentLine = "";
  }

  // get rid of empy newline at the end
  formatted = formatted.substr(0, formatted.length - 1);

  var ret = new fabric.Text(formatted, { // return new text-wrapped text obj
    left: t.left,
    top: t.top,
    fill: t.fill,
    fontFamily: t.fontFamily,
    fontSize: t.fontSize,
    originX: t.originX,
    originY: t.originY,
    angle: t.angle,
    hasBorders: t.hasBorders,
    hasControls: t.hasControls,
    hasRotatingPoint: t.hasRotatingPoint
  });
  return ret;
}
