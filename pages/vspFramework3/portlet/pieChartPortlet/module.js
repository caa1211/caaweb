﻿; 
(function(){

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
              'jqplot-highlighter': './cmps/jqplot/plugins/jqplot.highlighter',
              'jqplot-pieRenderer': './cmps/jqplot/plugins/jqplot.pieRenderer.min',
              'jqplot-donutRenderer': './cmps/jqplot/plugins/jqplot.donutRenderer.min'
            },
            shim: {//dependency
              'jqplot-highlighter': ['jqplot'],
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
        requireLibs.push("jqplot-highlighter");
        requireLibs.push("jqplot-donutRenderer");
    
        require(requireLibs, function(){
        
            var id = $view.id;
            var chartDivId = id+"_chartDiv";
            var $chartDiv = $view.find("#"+chartDivId);
            var chartHeight = 300;
            var chartHeightOffset = 150;
            var chartWidthOffset = 20;
            $chartDiv.height(chartHeight); 

            var plot;// = doChart(chartDivId);
            
            //redraw plot after view resize
            function doResize(){
                if($view.isFullscreen==true){
                    $chartDiv.height($view.height() - chartHeightOffset); 
                }else{
                    $chartDiv.height(chartHeight);
                }
                $chartDiv.width($view.width() - chartWidthOffset); 
                try{
                    if(plot!=undefined){
                        plot.destroy();
                    }
                    plot = doChart(chartDivId);
                    /*
                    //official method will cause failed result
                    if(plot==undefined){
                        plot = doChart(chartDivId);
                    }else{
                        plot.replot( {resetAxes: true, clear: true} );
                    }
                    */
                }catch(e){}
            }
            
            $view.bind("resize", function(e, type){
               //if(type!="lazyResize"){
                    doResize();
               //}
               e.stopPropagation();
            });
            doResize();
            
        }); 
    });
    //main function here=============================

  };

  return {
    init: initialize
  };

});


}());

