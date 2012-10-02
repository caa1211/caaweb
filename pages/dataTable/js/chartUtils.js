var chartUtils = {
    htmlTmpl:{
        br : "<br/>" 
    },
    subDate: function(s1, s2){
        s1 = s1.replace(/-/g, "/");
        s2 = s2.replace(/-/g, "/");
        s1 = new Date(s1);
        s2 = new Date(s2);

        var days= s1.getTime() - s2.getTime();
        return time = parseInt(days / (1000 * 60 * 60 * 24));
    },
    plotStore:[],
    initChartUI: function( $reportObj, chartObjs){
          var $chartTable = $reportObj.find(".chartTable");
          var $custBtnGroup = $(".custBtnGroup");
          $reportObj.find('div.row-fluid:first-child').remove();
          $reportObj.find(".tbar").after($chartTable);

          $custBtnGroup.dropdown();
          $reportObj.find('.DTTT').append($custBtnGroup.children());
          var $chartWraps = $(".chartWrap");
          var $allChartBtn = $(".allChartBtn");
          var $disableChartBtn = $(".disableChartBtn");
          var chartHeight = $chartWraps.height()+3;
          $chartWraps.height(0);
          
           $(".chartBtn").click(function(){
                var chartType = $(this).attr('type');
                $chartWraps.height(0);
                $chartWraps.filter("[type="+chartType+"]").height(chartHeight);
           });

           $disableChartBtn.click(function(){
                $chartWraps.height(0)
           }); 

           $allChartBtn.click(function(){
                $chartWraps.height(chartHeight);
           }); 

           $chartWraps.find(".resetZoom").click(function(){
                var type = $(this).parents(".chartWrap").attr("type");
                try{
                   chartObjs[type].plot.resetZoom();
                }catch(e){
                    //chart is not ready
                }
           });
         
         //-print Chart -
         $reportObj.find('.DTTT_button_print').click(function(){

             //pass the data to printWin
             var dataToSubWin = {
                 chartDef:{
                     cpu: $.extend({}, chartObjs.cpu, {plot: null}),
                     network: $.extend({}, chartObjs.network, {plot: null}),
                     disk: $.extend({}, chartObjs.disk, {plot: null})
                 },
                 data: $reportObj.data
             };
             
             dataToSubWin.selfObj = dataToSubWin;
             seen = [];
             var jsonStr = JSON.stringify(dataToSubWin, function(key, val) {
               if (typeof val == "object") {
                    if (seen.indexOf(val) >= 0)
                        return undefined
                    seen.push(val)
                }
                return val;
             });
             var dt = $reportObj.getDataTable();
             var oTT = TableTools.fnGetInstance(dt.attr('id'));
             var printWin = oTT.s.print.printWin;
             printWin.chartData =jsonStr;
             
           });
    },
    doChart: function(chartObj, data, opt){
               var htmlTmpl = chartUtils.htmlTmpl;
               var dataAry_cpu = [];
               var dataAry_network =[];
               var dataAry_disk =[]; 
               var xmin = data.interval[0];
               var xmax = 0;
               var ymax = 0;
               var ymax2 = 0;
               
               var default_opt = {
                showMarker: true,
                showHighlighter: true,
                seriesColors: ['#594c6d', '#8FBC8F', "#B0E0E6"],
                zoom: true,
                animate: true,
                lineWidth: 1
               };
               
               var _opt = $.extend({}, default_opt, opt);
              

               var makerSize = 7;
               if(data.report.usage_aver.length > 0){
                xmax = data.interval[data.report.usage_aver.length - 1];
               }
               var timeFormat = '%Y %m %d';
                        
               if(data.unit == '86400'){
                    timeFormat = '%Y %m %d';
                    var dayNum =  chartUtils.subDate(xmax, xmin);
                    var dayInterval =  Math.ceil(dayNum/20);
                    if(dayInterval == 0){
                        dayInterval = 1;
                   
                    }
                    tickInterval = dayInterval + " day";  
                    
               }else if (data.unit == '1800'){
                    timeFormat = '%H:%M:%S';
                    tickInterval = "1 hour";
               }
               
              for(var i=0; i<data.report.usage_aver.length; i++){
                var v1 = data.report.usage_aver[i];
                var d1 = [data.interval[i], v1];
                dataAry_cpu.push(d1);
                var v2 = data.report.usage_max[i];
                var d2 = [data.interval[i], v2];
                dataAry_network.push(d2);
                
                if (v1 > ymax){
                    ymax = v1;
                }
                if (v2 > ymax){
                    ymax = v2;
                }
                  
                if (data.report.latency!=undefined){
                  var v3 = data.report.latency[i];
                  var d3 = [data.interval[i], v3];
                  dataAry_disk.push(d3);
                  if (v3 > ymax2){
                    ymax2 = v3;
                  }
                }
                
              }
            
            if(chartObj.plot!=null){
                chartObj.plot.destroy();
            }  
            
            if (dataAry_cpu.length == 0 && dataAry_network.length == 0){
               var fakeData = ["0000-00-00",0];
               if(data.interval.length>0){
                  fakeData = [data.interval[0],0];
               }
               dataAry_cpu.push(fakeData);
               dataAry_network.push(fakeData);
            }
            
            var totalDataAry = [dataAry_cpu, dataAry_network]
            
             if (dataAry_disk.length!=undefined && dataAry_disk.length!=0){
                totalDataAry.push(dataAry_disk);
            }

            if( dataAry_cpu.length == 1){
                xmin = null;
                xmax = null;
            }
            

            if(dataAry_cpu.length > 50){
                //showMarker = false;
            }else{
                //showMarker = true;
            }
        
            chartObj.plot = $.jqplot(chartObj.id, totalDataAry, {
                  animate: !$.jqplot.use_excanvas && _opt.animate,
                  //animateReplot: !$.jqplot.use_excanvas && _opt.animate,
                  title: chartObj.title,
                  legend: {
                        renderer: $.jqplot.EnhancedLegendRenderer, 
                        show: true,
                        //yoffset: 6,
                        //placement: 'outsideGrid',
                        labels: ["Average", "Maximum", "Latency"],
                        location: 'nw', 
                        rendererOptions: {
                            disableIEFading: false
                        }
                  },
                  seriesDefaults: {
                    markerRenderer: $.jqplot.MarkerRenderer,    // renderer to use to draw the data
                    // point markers.
                    markerOptions: {
                        show:  _opt.showMarker,
                        lineWidth: _opt.lineWidth,       // width of the stroke drawing the marker.
                        size: makerSize           // size (diameter, edge length, etc.) of the marker.
                    }
                  },
                  series:[
                    {
                        yaxis: 'yaxis',
                        highlighter:{
                            formatString: 'Time: %s'+htmlTmpl.br+'Average: %s ' + chartObj.unit
                        }
                    },{
                        yaxis: 'yaxis',
                        highlighter:{
                            formatString: 'Time: %s'+htmlTmpl.br+'Maximum: %s ' + chartObj.unit
                        }
                    },{
                        yaxis: 'y2axis',
                        rendererOptions: {},
                        highlighter:{
                            formatString: 'Time: %s'+htmlTmpl.br+'Latency: %s ms' 
                        }
                    }
                  ],
                  seriesColors: _opt.seriesColors,
                  //ticks: ticks,
                  cursor: {
                    show: _opt.zoom,
                    zoom: _opt.zoom,
                    looseZoom: true,
                    showTooltip: false
                  },
                    axes: {
                        xaxis: {
                            pad:0,
                            min: xmin,
                            max: xmax,
                            renderer: $.jqplot.DateAxisRenderer,
                            rendererOptions: {
                                tickRenderer: $.jqplot.CanvasAxisTickRenderer
                            },
                            tickInterval: tickInterval,
                            tickOptions: {
                                //alignTicks: true,
                                forceTickAt0: true,
                                forceTickAt100: true,
                                formatString: timeFormat,
                                angle: -40,
                                fontSize: '9pt',
                                fontStretch: 1,
                                showMark: true,
                                showGridline: true
                            }
                        },
                        yaxis: {
                            label: chartObj.unit,
                            min: 0,
                            //max: ymax,
                            labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                            //tickInterval: 50,
                            //max: 700,
                            rendererOptions: {
                                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                                forceTickAt0: true,
                                forceTickAt100: true
                            },
                            tickOptions: { 
                                fontSize: '9pt',
                                fontFamily: 'Tahoma',
                                fontWeight: 'normal',
                                fontStretch: 1
                            }
                        },
                        y2axis: {
                            min: 0,
                            //max: ymax2,
                            label: "ms",
                            //useSeriesColor: true
                            labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                            tickOptions: {
                                //formatString: "%s, %s ms",
                                fontSize: '9pt',
                                fontFamily: 'Tahoma',
                                fontWeight: 'normal',
                                fontStretch: 1
                            },
                            showHighlight: false,
                            rendererOptions: {
                                // align the ticks on the y2 axis with the y axis.
                                alignTicks: true,
                                forceTickAt0: true,
                                forceTickAt100: true,
                                highlightMouseOver: false
                            }
                        }
                    },
                    highlighter: {
                        useAxesFormatters : true,
                        show: _opt.showHighlighter,
                        showLabel: true,
                        sizeAdjust: 7.5,
                        tooltipLocation: 'wn',
                        formatString: '%s, %s ' + chartObj.unit
                    }
              });
           
      }

};