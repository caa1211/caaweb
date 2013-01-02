; 
(function(){

define(function(require){

  function doChart(chartDivId){
        var l2 = [11, 9, 5, 12, 14];
        var l3 = [4, 8, 5, 3, 6];
        var l4 = [12, 6, 13, 11, 2];   
 
        var plot = $.jqplot(chartDivId,[l2, l3, l4],{
            stackSeries: true,
            showMarker: false,
            seriesDefaults: {
                fill: true
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: ["Mon", "Tue", "Wed", "Thr", "Fri"]
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
            paths: {//do not need .css, .js in each paths
              'jqplot-css': './cmps/jqplot/jquery.jqplot.min',
              'excanvas': './cmps/jqplot/excanvas.min',
              'jqplot': './cmps/jqplot/jquery.jqplot.min',
              'jqplot-categoryAxisRenderer': './cmps/jqplot/plugins/jqplot.categoryAxisRenderer.min',
              'jqplot-highlighter': './cmps/jqplot/plugins/jqplot.highlighter',
              'jqplot-canvasTextRenderer': './cmps/jqplot/plugins/jqplot.canvasTextRenderer.min',
              'jqplot-canvasAxisTickRenderer': './cmps/jqplot/plugins/jqplot.canvasAxisTickRenderer.min'
            },
            shim: {//dependency
              'jqplot-categoryAxisRenderer': ['jqplot'],
              'jqplot-highlighter': ['jqplot'],
              'jqplot-canvasTextRenderer': ['jqplot'],
              'jqplot-canvasAxisTickRenderer': ['jqplot']
            }
        });
        var requireLibs = [];
        requireLibs.push("css!jqplot-css");
        if ($.browser.msie && parseInt($.browser.version) < 9) {
            requireLibs.push("excanvas");
        }
        requireLibs.push("jqplot");
        requireLibs.push("jqplot-categoryAxisRenderer");
        requireLibs.push("jqplot-highlighter");
        requireLibs.push("jqplot-canvasTextRenderer");
        requireLibs.push("jqplot-canvasAxisTickRenderer");
    
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

