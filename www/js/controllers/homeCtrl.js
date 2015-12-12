angular.module('starter')
  .controller('HomeCtrl',function ($scope,$state,$ionicPopup,$location, $state) {


    c = document.getElementById('c');

    var size = window.innerWidth;

    c.width = size;
    c.height = size;//window.innerHeight-200;



    var canvas = new fabric.Canvas("c");




  $scope.init = function(){



  };

    $scope.init();

    $scope.back = function () {
      $ionicHistory.goBack();
    };

    $scope.button = function () {

      canvas.clear();

     fabric.Image.fromURL('/img/prova.jpg', function(oImg) {
        // scale image down, and flip it, before adding it onto canvas
        oImg.scaleToHeight(canvas.height);

        canvas.setBackgroundImage(oImg);
        canvas.renderAll();
      });


      var text =  new fabric.Text('Ciao brutto ricchione frocio del cazzo pezzo di merda', {
        fontFamily: 'arial black',
        fontSize:25,
        left: canvas.width/2,
        top: canvas.height/2 ,
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false
      });

      $scope.formatted = wrapCanvasText(text,canvas,canvas.width-50,canvas.height,'center');

      $scope.formatted.fill = '#000000';

      canvas.add($scope.formatted);

      $scope.formatted.centerV();
      $scope.formatted.centerH();



    };


    $scope.reload = function(){
      console.log("reload");
      $scope.formatted.colo
      $scope.formatted.stroke = '#efefef';
      $scope.formatted.strokeWidth =  1;

      canvas.renderAll();

    }


  });


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
