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
            paths: {//do not need .css, .js in each paths
              'jqplot-css': './cmps/jqplot/jquery.jqplot.min',
              'excanvas': './cmps/jqplot/excanvas.min',
              'jqplot': './cmps/jqplot/jquery.jqplot.min',
              'jqplot-pieRenderer': './cmps/jqplot/plugins/jqplot.pieRenderer.min',
              'jqplot-donutRenderer': './cmps/jqplot/plugins/jqplot.donutRenderer.min'
            },
            shim: {//dependency
              'jqplot-pieRenderer': ['jqplot'],
              'jqplot-donutRenderer': ['jqplot']
            }
        });
        var requireLibs = [];
        requireLibs.push("css!jqplot-css");
        if ($.browser.msie && parseInt($.browser.version) < 9) {
            requireLibs.push("excanvas");
        }
        requireLibs.push("jqplot");
        requireLibs.push("jqplot-pieRenderer");
        requireLibs.push("jqplot-donutRenderer");
    
        require(requireLibs, function(){
        
            var id = $view.id;
            var chartDivId = id+"_chartDiv";
            var $chartDiv = $view.find("#"+chartDivId);
            var chartHeight = 300;
            var chartHeightOffset = 150;
            var chartWidthOffset = 20;
            $chartDiv.height($view.height() - chartHeightOffset); 
            $chartDiv.width($view.width() - chartWidthOffset); 
            
            var plot = doChart(chartDivId);
            
            //redraw plot after view resize
            var lazyResizeTimer = null;
            function doLazyResize(){
                clearInterval(lazyResizeTimer);
                lazyResizeTimer = setTimeout(function(){
                   if($view.isFullscreen==true){
                        $chartDiv.height($view.height() - chartHeightOffset); 
                   }else{
                        $chartDiv.height(chartHeight);
                   }
                   $chartDiv.width($view.width() - chartWidthOffset); 
                   try{
                        plot.replot( {resetAxes: true } );
                   }catch(e){}
                }, 150);
            }
            $view.bind("resize", function(e, type){
               doLazyResize();
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

