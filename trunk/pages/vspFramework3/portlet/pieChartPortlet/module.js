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
dependencyLibAry.push( "./cmps/jqplot/plugins/jqplot.pieRenderer.min.js");
dependencyLibAry.push( "./cmps/jqplot/plugins/jqplot.donutRenderer.min.js");
*/

define(function(require){

  function doChart(chartDivId){
            var data = [
                ['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14],
                ['Out of home', 16],['Commuting', 7], ['Orientation', 9]
            ];

            var plot = jQuery.jqplot(chartDivId, [data],
                {
                  seriesDefaults: {
                    // Make this a pie chart.
                    renderer: jQuery.jqplot.PieRenderer,
                    rendererOptions: {
                      // Put data labels on the pie slices.
                      // By default, labels show the percentage of the slice.
                      showDataLabels: true
                    }
                  },
                  legend: { show:true, location: 'e' }
             });
             return plot;
  }
  var initialize = function($view, config){
    //main function here=============================
    $view.bind("selfDomReady", function(){
    
        //require is relate with index html page
        requirejs.config({
            paths: {
              'jqplot-pieRenderer': './cmps/jqplot/plugins/jqplot.pieRenderer.min',
              'jqplot-donutRenderer': './cmps/jqplot/plugins/jqplot.donutRenderer.min'
            }
        });
        require(['jqplot-pieRenderer', 'jqplot-donutRenderer'], function(){
            var id = $view.id;
            var chartDivId = id+"_chartDiv";
            var $chartDiv = $view.find("#"+chartDivId);
            var chartHeight = 300;
            $chartDiv.height(chartHeight); 
            
            var plot = doChart(chartDivId);
            //redraw plot after view resize
            $view.bind("resize", function(e, type){
               if($view.isFullscreen==true){
                    $chartDiv.height(500);
               }else{
                    $chartDiv.height(chartHeight);
               }
               plot.replot();
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

