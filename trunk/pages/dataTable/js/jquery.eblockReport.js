 /* jquery.eblockReport.js
 *
 * Copyright (c) 2012 
 * Jose Chang@itri
 * 
 */

var eblockReportUtils = {};
eblockReportUtils.reportTmpl = '<div class="well reportWidget" style="">'+
    '<div class="well well-small tbar" style="" >'+
        '<h4 class="reportTitle" style=""><%= title %></h4>'+
        '<span class="genReportArea" style="position:relative;">'+
            '<span class="badge badge-important dateErrorMsg" style="">The end date can not be less then the start date</span>'+
            '<span class="timeArea" style="">'+
            'Start:'+
            '<a class="input-append date mini startTime"  data-date="" data-date-format="yyyy/mm/dd" >'+
                '<input class="span2"  type="text" readonly="" size="16" type="text" value="" style="">'+
                '<span class="add-on "><i class="icon-th"></i></span>'+
            '</a>'+
            '</span>'+
           '<span class="timeArea" style="">'+
            'End:'+
            '<a class="input-append date mini endTime" data-date="" data-date-format="yyyy/mm/dd" >'+
                '<input  class="span2"  type="text" readonly="" size="16" type="text" value="" style=""> '+
                '<span class="add-on "><i class="icon-th"></i></span>'+
            '</a>'+
            '</span>'+
           '<span class="timeArea" style="position:relative;">'+
            '<button href="#" class="btn  generateReportBtn" style="">  <i class=" icon-repeat"></i></button>'+
            "<span class='loading' style=''></span>"+
           '</span>'+
           
       '</span>'+
    '</div>'+
    '<table cellpadding="0" cellspacing="0" border="0" class="reportTable table table-striped table-bordered">'+
	'<thead>'+
		'<tr>'+
        '<% _.each(header, function(obj) { %> <th width="<%= obj.width %>"><%= obj.label %></th> <% }); %>'+
		/*	'<th width="20%">Rendering engine</th>'+
			'<th width="25%">Browser</th>'+
			'<th width="25%">Platform(s)</th>'+
			'<th width="15%">Engine version</th>'+
			'<th width="15%">CSS grade</th>'+
        */
		'</tr>'+
	'</thead>'+
	'<tbody>'+
	'</tbody>'+
'</table>'+
'</div>';


eblockReportUtils.dateToString = function(date, splitStr){
                function pad(num, n) {
                    var len = num.toString().length;
                    while(len < n) {
                        num = "0" + num;
                        len++;
                    }
                    return num;
                }   
                return  ""+
                date.getFullYear()+""+splitStr+""+
                pad(date.getMonth()+1, 2)+""+splitStr+""+
                pad(date.getDate(), 2);
};

;(function($)
{
    $.fn.eblockReport = function(settings){
       var that = this;
       var $thisObj = $(this);
       
       var defaultSetting = 
       {
           title: "Report",
           header: [{label:"header", width:""}],
           dataSchema:[{mData:"data"}],
           isTimeRangeSelectable: false,
           sSwfPath: "cmps/TableTools/media/swf/copy_csv_xls_pdf.swf",
           timeRange:{
               startDate: new Date(),
               endDate: new Date()
           }
       };
       
       var _settings = $.extend({}, defaultSetting , settings);
       
       var reportTmp = _.template(eblockReportUtils.reportTmpl);
       var reportDomObj;
       var $report;
       var $startDatepicker;
       var $endDatepicker;
       var $generateReportBtn;
       var $loadingIcon;
       var startDate;
       var endDate;
        
       var _init = function(){
          reportDomObj = reportTmp({title: _settings.title, header: _settings.header});
          $thisObj.append(reportDomObj);
          doTable();
          return that;
       };
      

   
       function doTable(){
        var $reportWidget = $thisObj;
        $report = $reportWidget.find("table.reportTable");
        $loadingIcon = $reportWidget.find("span.loading");
        $loadingIcon.hide();

        var $dateInputs = $reportWidget.find("a.date input");
        var $dateErrorMsg = $reportWidget.find('.dateErrorMsg');
        $generateReportBtn = $reportWidget.find(".generateReportBtn");
        $generateReportBtn.disable = function(){
            $generateReportBtn.addClass('disabled');
        };
        $generateReportBtn.enable = function(){
            $generateReportBtn.removeClass('disabled');
        };
  
        $startDatepicker = $reportWidget.find(".startTime");
        $endDatepicker = $reportWidget.find(".endTime");
        var $genReportArea = $reportWidget.find(".genReportArea");
        var $tbar = $reportWidget.find('.tbar');
        var isTimeRangeSelectable = _settings.isTimeRangeSelectable;
        var sSwfPath = _settings.sSwfPath;

        var reportColumns = _settings.dataSchema;
            
	    var oTable = $report.dataTable({
	        //"sAjaxSource": "cmps/ajax/sources/objects.txt",
	        "aoColumns": reportColumns,
	        "bDeferRender": true,
            "sDom": "<'row-fluid'<'span6'T><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
	        "oTableTools": {
	            "sSwfPath": sSwfPath,
	            "aButtons": ["copy", "print", {
	                "sExtends": "collection",
	                "sButtonText": 'Export <span class="caret" />',
	                "aButtons": [	
                    {
					"sExtends": "xls",
					"sButtonText": "Excel (CSV)"
                    }
                    , "pdf"]
	            }
                ]
	        }
	    });

            //date selecter--
         if(isTimeRangeSelectable){
            startDate = _settings.timeRange.startDate;
            endDate = _settings.timeRange.endDate;
            var isValidTimeRange = true;
            $dateErrorMsg.hide();
            $dateInputs.click(function(e){
              $(this).parent().find('.add-on').trigger('click');
              e.preventDefault(); 
              e.stopPropagation();  
            });
            function  checkTimeRange(){
               isValidTimeRange = startDate.valueOf() <= endDate.valueOf();
               if(!isValidTimeRange){
                $dateErrorMsg.show();
                $generateReportBtn.disable();
               }else{
                $dateErrorMsg.hide();
                $generateReportBtn.enable();
               }
            }


            $startDatepicker.attr("data-date", eblockReportUtils.dateToString(startDate, "/")).datepicker({
            }).on('changeDate', function(ev){
                startDate = new Date(ev.date);
                checkTimeRange();
            });
            
            $endDatepicker.attr("data-date", eblockReportUtils.dateToString(endDate, "/")).datepicker({
            }).on('changeDate', function(ev){
                endDate = new Date(ev.date);
                checkTimeRange();
            });
            
            $('.date').each(function(){
                var $input = $(this).children('input');
                var date = $(this).attr('data-date');
                $input.val(date);
            });
         }else{
            $genReportArea.hide();
         }
            //date selecter--
            
            var $dataTables_filter = $reportWidget.find('.dataTables_filter'); 
            var $DTTT = $reportWidget.find('.DTTT'); 
            
            (function modifyTbarPosition(){
                $dataTables_filter.appendTo($tbar)
                $DTTT.appendTo($tbar)
            })();

       }
       
       //public api
       this.addData = function(data){
            $report.dataTable().fnAddData(data);
       };
       
       this.clearData = function(data){
            $report.dataTable().fnClearTable();
       };
       
       function updateDatePicker($datepicker, date){
            var dateStr = eblockReportUtils.dateToString(date, "/");
            $datepicker.val(dateStr);
            $datepicker.children('input').val(dateStr);
            $datepicker.datepicker('update')
            
            $datepicker.trigger({type: 'changeDate',
								date: date});
       }
       
       this.setTimeRange = function(startDate, endDate){
            updateDatePicker($startDatepicker, startDate);
            updateDatePicker($endDatepicker, endDate);
       };
       
       this.getTimeRange = function(){
            return {startDate: startDate, endDate: endDate};
       };
       
       this.getGenBtn = function(){
            return $generateReportBtn;
       };
       
       this.getLoadingIcon = function(){
            return $loadingIcon;
       };
       
       this.getDataTable = function(){
            return $report;
       };
        
       return _init();
    };
 
})(jQuery);