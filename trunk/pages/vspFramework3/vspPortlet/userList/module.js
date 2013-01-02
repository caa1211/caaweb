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
	setConfig(JSON)  ;set a new config to portlet
	setTitle(STRING) ;set a new title to portlet
    setModel(JSON)   ;set a new model to portlet ex setModel({ title:"cc", config:{"aa":"bb"} })
	refresh()
    mask()
    unmask()
*/

; 
(function(){

define(["require", "text!./tmpl/userListtable.html"], function(require, userListTmpl){

  var applyDataTables = function($div){
		$div.dataTable( {
            //"sDom": "<'row-fluid'<'span6'T><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
            "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
			"sPaginationType": "bootstrap",
            "iDisplayLength": 5,
            "aLengthMenu": [[5, 20, 50, -1], [5, 20, 50, "All"]],
			"oLanguage": {
				"sLengthMenu": "_MENU_ records per page",
                "oPaginate":{
                    "sPrevious": "",
                    "sNext":""
                },
                "sSearch": "Filter:"
			}

		}  );
  };
  
  var initialize = function($view, config){

    //main function here=============================
        
    requirejs.config({
        paths: {//do not need .css, .js in each paths
            "dataTable-css": "./cmps/dataTables/css/jquery.dataTables",
            "dataTable-bootstrap-css": "./cmps/dataTables/css/dataTables.bootstrap",
            //"dataTable-eblockReport-css": "./cmps/dataTables/css/jquery.eblockReport",
            "dataTables" : "./cmps/dataTables/js/jquery.dataTables.min",
            "dataTables-bootstrap" : "./cmps/dataTables/js/dataTables.bootstrap"
        },
        shim: {//dependency
            'dataTables-bootstrap': ['dataTables']
        }
    });
    
    var requireLibs = [];
    //requireLibs.push("css!dataTable-css");
    requireLibs.push("css!dataTable-bootstrap-css");
    requireLibs.push("dataTables");
    requireLibs.push("dataTables-bootstrap");
    
    require(requireLibs, function(){
       var id = $view.id;
       var $userListDiv = $view.find(".userListDiv");
       var userListTmpFn = _.template(userListTmpl);
       var url =   "http://140.96.29.30:8113/hq/user";
       var tableId =  id+"_user_table";
       
       function getUserDataDone(userData){
          $userListDiv.html(userListTmpFn(userData));
          var $table = $view.find("table");
          $table.attr("id",  tableId); 
          applyDataTables($table);
       }

        $.ajax({
            url:url,
            type:"get", 
            dataType: "json",
            success: function(res){
                getUserDataDone(res);
            }, 
            error:function(){
                //alert("error");
            }
       });

        //expand dataTable
        $view.on("fullscreenOn", function(){
            //$("#userList_89f48082_user_table_length")
            var $selector = $view.find("select[name='"+tableId+"_length']");   
            var oVal = $selector.val();
            $selector.attr('oVal', oVal);
            $selector.val(-1).trigger('change.DT');
        });
        //collapse dataTable
        $view.on("fullscreenOff", function(){
            var $selector = $view.find("select[name='"+tableId+"_length']");  
            var oVal =  $selector.attr('oVal');
            if(oVal!=undefined){
                $selector.val(oVal).trigger('change.DT');
            }
        });
       
       
    });
        //main function here=============================

  };

  return {
    init: initialize
  };

});

}());
