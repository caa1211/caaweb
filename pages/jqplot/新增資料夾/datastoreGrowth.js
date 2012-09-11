﻿            var Zenoss = window.parent.Zenoss;
            $(document).ready(function () {
            
                var resData_empty = {
                    "interval": ["0"],
                    "growth": {
                        "provisioned": [1],
                        "capacity": [1],
                        "used": [1]
                    }
                };
                
                //test data
                var resData_month = {
                    "interval": ["2011-08-16 10:01:46 Tue", "2011-09-16 10:01:46 Fri", "2011-10-16 10:01:46 Sun", "2011-11-16 09:01:46 Wed", "2011-12-16 09:01:46 Fri", "2012-01-16 09:01:46 Mon", "2012-02-16 09:01:46 Thu", "2012-03-16 10:01:46 Fri", "2012-04-16 10:01:46 Mon", "2012-05-16 10:01:46 Wed", "2012-06-16 10:01:46 Sat", "2012-07-16 10:01:46 Mon", "2012-08-16 10:01:49 Thu"],
                    "growth": {
                        "provisioned": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 172424654],
                        "capacity": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 727187456],
                        "used": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 102919439]
                    }
                };
                var resData_hour = {
                    "interval": ["2012-08-15 10:55:02 Wed", "2012-08-15 11:55:02 Wed", "2012-08-15 12:55:02 Wed", "2012-08-15 13:55:02 Wed", "2012-08-15 14:55:02 Wed", "2012-08-15 15:55:02 Wed", "2012-08-15 16:55:02 Wed", "2012-08-15 17:55:02 Wed", "2012-08-15 18:55:02 Wed", "2012-08-15 19:55:02 Wed", "2012-08-15 20:55:02 Wed", "2012-08-15 21:55:02 Wed", "2012-08-15 22:55:02 Wed", "2012-08-15 23:55:02 Wed", "2012-08-16 00:55:02 Thu", "2012-08-16 01:55:02 Thu", "2012-08-16 02:55:02 Thu", "2012-08-16 03:55:02 Thu", "2012-08-16 04:55:02 Thu", "2012-08-16 05:55:02 Thu", "2012-08-16 06:55:02 Thu", "2012-08-16 07:55:02 Thu", "2012-08-16 08:55:02 Thu", "2012-08-16 09:55:02 Thu", "2012-08-16 10:55:07 Thu"],
                    "growth": {
                        "provisioned": [172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240, 172378240],
                        "capacity": [727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456, 727187456],
                        "used": [103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536, 103361536]
                    }
                };
                var resData_day = {
                    "interval": ["2012-07-17 11:05:51 Tue", "2012-07-18 11:05:51 Wed", "2012-07-19 11:05:51 Thu", "2012-07-20 11:05:51 Fri", "2012-07-21 11:05:51 Sat", "2012-07-22 11:05:51 Sun", "2012-07-23 11:05:51 Mon", "2012-07-24 11:05:51 Tue", "2012-07-25 11:05:51 Wed", "2012-07-26 11:05:51 Thu", "2012-07-27 11:05:51 Fri", "2012-07-28 11:05:51 Sat", "2012-07-29 11:05:51 Sun", "2012-07-30 11:05:51 Mon", "2012-07-31 11:05:51 Tue", "2012-08-01 11:05:51 Wed", "2012-08-02 11:05:51 Thu", "2012-08-03 11:05:51 Fri", "2012-08-04 11:05:51 Sat", "2012-08-05 11:05:51 Sun", "2012-08-06 11:05:51 Mon", "2012-08-07 11:05:51 Tue", "2012-08-08 11:05:51 Wed", "2012-08-09 11:05:51 Thu", "2012-08-10 11:05:51 Fri", "2012-08-11 11:05:51 Sat", "2012-08-12 11:05:51 Sun", "2012-08-13 11:05:51 Mon", "2012-08-14 11:05:51 Tue", "2012-08-15 11:05:51 Wed", "2012-08-16 11:05:56 Thu"],
                    "growth": {
                        "provisioned": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 172603680, 172519140, 172378240, 172378240],
                        "capacity": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 727187456, 727187456, 727187456, 727187456],
                        "used": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101214208, 102019456, 103361536, 103361536]
                    }
                };
                var resData_week = {
                    "interval": ["2012-08-09 11:11:41 Thu", "2012-08-10 11:11:41 Fri", "2012-08-11 11:11:41 Sat", "2012-08-12 11:11:41 Sun", "2012-08-13 11:11:41 Mon", "2012-08-14 11:11:41 Tue", "2012-08-15 11:11:41 Wed", "2012-08-16 11:11:43 Thu"],
                    "growth": {
                        "provisioned": [0, 0, 0, 172603680, 172519140, 172378240, 172378240],
                        "capacity": [0, 0, 0, 727187456, 727187456, 727187456, 727187456],
                        "used": [0, 0, 0, 101214208, 102019456, 103361536, 103361536]
                    }
                };
                
            

            
       function DatastoreModule($container, datastoreName){
            
           // var view = new DatastoreModule_view({});
            
            var plot;
            var UseTestData = true;
            function getData(range, unit, callback){
                
                //test data
              if(UseTestData){
                var resData;
                if(unit == "MONTH"){//12 month a year
                    resData = resData_month;
                }else if (unit == "DAY" && range == 30){//30 days a month
                    resData = resData_day;
                }else if (unit == "DAY" && range == 7){//7 days a week
                    resData = resData_week;
                }else if (unit == "HOUR"){//24 hours a day
                    resData = resData_hour;
                }else{
                
                }
                callback(resData);
              }
              else{
                var param = {
                    name: datastoreName,
                    unit: unit,
                    range: range
                };
                Zenoss.remote.vdcmApiRouter.getDatastoreGrowth(param, function(res){
                    if(res.success && res.data!=null){
                        callback(res.data);
                    }
                });
              }
            }

            $("#dayBtn").click(function(){
               
                   getData(24, "HOUR", function(resData){
                        plot.destroy();
                        drawGrowth(resData, "HOUR");
                   });
            });
                
            $("#weekBtn").click(function(){
                   getData(7, "DAY", function(resData){
                        plot.destroy();
                        drawGrowth(resData, "DAY");
                   });
            });
            
            $("#monthBtn").click(function(){
                 
                   //30 days a month
                   getData(30, "DAY", function(resData){
                        plot.destroy();
                        drawGrowth(resData, "DAY");
                   });
            });
           
            $("#yearBtn").click(function(){
                 
                   getData(12, "MONTH", function(resData){
                        plot.destroy();
                        drawGrowth(resData, "MONTH");
                   });
            });           
                
            function drawGrowth(resData, rangeUnit){   
                var provisioned_line = [];
                var capacity_line = [];
                var used_line = [];

                var usedRaw = resData.growth.used;
                var capacityRaw = resData.growth.capacity;
                var provisionedRaw = resData.growth.provisioned;
              
                function parseToGB(kbStr){
                  var bytes = parseInt(kbStr);
                  if(isNaN(bytes)){
                    return "";
                  }
                  return ((bytes/1024)/1024).toFixed(2);
                }
                
                var range = resData.growth.used.length;
                var maxGB = 0;

                for(var i=0; i<range; i++){
                    var node;
                    var time = resData.interval[i+1];

                    if(capacityRaw[i]!=0){
                        var size = parseToGB(capacityRaw[i]);
                        if(size > maxGB){
                            maxGB = size;
                        }
                        node = [time, size];
                        capacity_line.push(node);
                    }
                    if(provisionedRaw[i]!=0){
                        var size = parseToGB(provisionedRaw[i]);
                        node = [time, size];
                        provisioned_line.push(node);
                    }
                    if(usedRaw[i]!=0){
                        var size = parseToGB(usedRaw[i]);
                        node = [time, size];
                        used_line.push(node);
                    }
                }

               var xmin = resData.interval[1];
               var xmax = resData.interval[resData.interval.length-1];
               var ymin = 0;
               var ymax = Math.floor(maxGB)+50;
               //'%b %#d %Y', //, %#I %p'
               var plotOpts = {
                     "EMPTY":{
                        tickInterval: '1 month',
                        formatString: '%b %Y'
                    },
                    "MONTH":{
                        tickInterval: '1 month',
                        formatString: '%b %Y'
                    },
                    "WEEK": {
                        tickInterval: '1 day',
                        formatString: '%b %#d %Y'
                    },
                    "DAY": {
                        tickInterval: '3 day',
                        formatString: '%b %#d %Y'
                    },
                    "HOUR": {
                        tickInterval: '2 hour',
                        formatString: '%#d, %#I %p'
                    }
               
               };

               plot = $.jqplot('chart', [capacity_line, provisioned_line, used_line], {
                   // animate: !$.jqplot.use_excanvas,
                    seriesColors: ['#6f60aa', '#d93a49', '#78a355'],
                    seriesDefaults: {
                        rendererOptions: {
                            //smooth: true,
                            showMarker: false
                        },
                        lineWidth: 2,
                        showMarker: true
                    },/*
                    series: [{
                        markerOptions:{style:'filledSquare'}
                    }, {
                       markerOptions:{style:'filledDiamond '}
                    }, {
                       markerOptions:{style:'filledCircle'}
                    }],*/
                    legend: {
                        show: true,
                          location: 'nw',
                        yoffset: 6,
                        labels: ["Capacity", "Allocated", "Used"]
                    },
                    axesDefaults: {
                        tickRenderer: $.jqplot.CanvasAxisLabelRenderer
                    },
                    axes: {
                        xaxis: {
                            renderer: $.jqplot.DateAxisRenderer,
                            min: xmin,
                            max: xmax,
                           // tickInterval: plotOpts[rangeUnit].tickInterval,
                            rendererOptions: {
                                tickRenderer: $.jqplot.CanvasAxisTickRenderer
                            },
                            tickOptions: {
                                alignTicks: true,
                                forceTickAt0: true,
                                formatString: plotOpts[rangeUnit].formatString, //, %#I %p',
                                angle: -40,
                                fontSize: "8pt",
                                fontStretch: 1,
                                showMark: true,
                                showGridline: true
                            }
                        },
                        yaxis: {
                            label: "GB",
                            min: ymin,
                            max: ymax,
                            labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                            tickInterval: 50,
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
                        }
                    },
                    highlighter: {
                        show: true,
                        showLabel: true,
                        sizeAdjust: 7.5,
                        tooltipLocation: 'ne',
                        formatString: '%s, %s G'
                    }
                });

            }

            drawGrowth(resData_empty, "EMPTY");
            
            getData(12, "MONTH", function(resData){
                plot.destroy();
                drawGrowth(resData, "MONTH");
            });
            
        }
        
            $container = $("#datastoreContainer");
            new DatastoreModule($container, "datastore1");
                   
        });