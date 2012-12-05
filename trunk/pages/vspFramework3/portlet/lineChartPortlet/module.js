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
          var line1=[['23-May-08', 578.55], ['20-Jun-08', 566.5], ['25-Jul-08', 480.88], ['22-Aug-08', 509.84],
              ['26-Sep-08', 454.13], ['24-Oct-08', 379.75], ['21-Nov-08', 303], ['26-Dec-08', 308.56],
              ['23-Jan-09', 299.14], ['20-Feb-09', 346.51], ['20-Mar-09', 325.99], ['24-Apr-09', 386.15]];
          var plot = $.jqplot(chartDivId, [line1], {
              title:'Data Point Highlighting',
              axes:{
                xaxis:{
                  renderer:$.jqplot.DateAxisRenderer,
                  tickOptions:{
                    formatString:'%b&nbsp;%#d'
                  }
                },
                yaxis:{
                  tickOptions:{
                    formatString:'$%.2f'
                    }
                }
              },
              highlighter: {
                show: true,
                sizeAdjust: 7.5
              },
              cursor: {
                show: false
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
          'jqplot-highlighter': './cmps/jqplot/plugins/jqplot.highlighter.min',
          'jqplot-cursor': './cmps/jqplot/plugins/jqplot.cursor.min',
          'jqplot-dateAxisRenderer': './cmps/jqplot/plugins/jqplot.dateAxisRenderer.min'
        }
    });
    require(['jqplot-highlighter', 'jqplot-cursor',  'jqplot-dateAxisRenderer'], function(){
    
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

