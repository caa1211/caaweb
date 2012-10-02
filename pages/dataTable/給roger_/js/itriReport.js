var reportTmpl = '<div class="well reportWidget" style="">'+
    '<div class="well well-small tbar" style="" >'+
        '<h4 class="reportTitle" style="">Performance Report</h4>'+
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
           '<span class="timeArea" style="">'+
            '<a href="#" class="btn  generateReportBtn" style=""> <i class=" icon-repeat"></i></a>'+
           '</span>'+
       '</span>'+
    '</div>'+
    '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="perfReport" >'+
	'<thead>'+
		'<tr>'+
			'<th width="20%">Rendering engine</th>'+
			'<th width="25%">Browser</th>'+
			'<th width="25%">Platform(s)</th>'+
			'<th width="15%">Engine version</th>'+
			'<th width="15%">CSS grade</th>'+
		'</tr>'+
	'</thead>'+
	'<tbody>'+
	'</tbody>'+
'</table>'+
'</div>';








$(function(){
   var reportTmp = _.template(reportTmpl);
   var reportDomObj = reportTmp();
   
   $("body").append(reportDomObj);
});