/*
Event:
    setting
    refresh
    destroy
    fullscreen
    fullscreenOn
    fullscreenOff
    settingOn
    settingOff
    settingDone
    selfDomReady
    dragStart
    dragStop
    resize
    
$view's Method:
	setConfig(JSON)  ;set new config to portlet
	setTitle(STRING) ;set new title to portlet
	refresh()
*/

//define(id?, dependencies?, factory); 
(function(){
/*
var baseJsLibs = [];
baseJsLibs.push( "require");
baseJsLibs.push( "css!./cmps/jqplot/jquery.jqplot.min.css");
if($.browser.msie){
   baseJsLibs.push( "./cmps/jqplot/excanvas.min.js");
}    
baseJsLibs.push( "./cmps/jqplot/jquery.jqplot.min.js");

var dependencyLibAry = [];    
dependencyLibAry.push( "./cmps/jqplot/plugins/jqplot.highlighter.min");
dependencyLibAry.push( "./cmps/jqplot/plugins/jqplot.cursor.min");
dependencyLibAry.push( "./cmps/jqplot/plugins/jqplot.dateAxisRenderer.min");
*/
define(function(require){

  function doChart(chartDivId){
            var plot = $.jqplot(chartDivId, [
                [[2,1], [4,2], [6,3], [3,4]],
                [[5,1], [1,2], [3,3], [4,4]],
                [[4,1], [7,2], [1,3], [2,4]]], {
                seriesDefaults: {
                    renderer:$.jqplot.BarRenderer,
                    // Show point labels to the right ('e'ast) of each bar.
                    // edgeTolerance of -15 allows labels flow outside the grid
                    // up to 15 pixels.  If they flow out more than that, they
                    // will be hidden.
                    pointLabels: { show: true, location: 'e', edgeTolerance: -15 },
                    // Rotate the bar shadow as if bar is lit from top right.
                    shadowAngle: 135,
                    // Here's where we tell the chart it is oriented horizontally.
                    rendererOptions: {
                        barDirection: 'horizontal'
                    }
                },
                axes: {
                    yaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer
                    }
                }
            });
          return plot;
  }
  var initialize = function($view, config){
    //main function here=============================
    $view.bind("selfDomReady", function(){
    
    //require is relate with index html page
    requirejs.config({
        paths: {
          'jqplot-barRenderer': './cmps/jqplot/plugins/jqplot.barRenderer.min',
          'jqplot-categoryAxisRenderer': './cmps/jqplot/plugins/jqplot.categoryAxisRenderer.min',
          'jqplot-pointLabels': './cmps/jqplot/plugins/jqplot.pointLabels.min'
        }
    });
    require(['jqplot-barRenderer', 'jqplot-categoryAxisRenderer',  'jqplot-pointLabels'], function(){
            var id = $view.id;
            var chartDivId = id+"_chartDiv";
            var $chartDiv = $view.find("#"+chartDivId);
            var chartHeight = 300;
            var chartWidthOffset = 20;
            $chartDiv.height(chartHeight); 
            $chartDiv.width($view.width() - chartWidthOffset); 
            
            var plot = doChart(chartDivId);
            //redraw plot after view resize
            
            $view.bind("resize", function(e, type){
               if($view.isFullscreen==true){
                    $chartDiv.height(500);
               }else{
                    $chartDiv.height(chartHeight);
               }
               $chartDiv.width($view.width() - chartWidthOffset); 
               try{
                    plot.replot( {resetAxes: true } );
               }catch(e){}
            });
            
        }); 
    });
    //main function here=============================

  };

  return {
    init: initialize
  };

});


}());

