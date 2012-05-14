/*
 * jquery.itriCSSJsonParser.js
 *
 * Copyright (c) 2010 
 * Caa Chang
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * $Date: 2012-04-24 $
 * $Rev: 001 $
 * 
 *depend on jquery.tablesorter.js
 */

(function($)
{

   
    $.itriCSSJsonParser_event = function(settings){

        function _L(str){
        var debugDiv =  $("#debugDiv");
         if( debugDiv.length != 0){
            $("#debugDiv").append("<div>"+str+"</div>")
               // console.log(str);
            }
       }
       
 
       var defaultSetting = {
        url:"",
        success: function(e, data, textStatus, jqXHR){},
        error: function(jqXHR, textStatus, errorThrown){},
        complete: function(jqXHR, textStatus){}
       };
       
       var _settings = $.extend({}, defaultSetting , settings);

       function buildTableHeader(ary){
        /*
        <thead> 
        <tr> 
            <th>Name</th> 
            <th>Size</th> 
            <th>LastModified</th> 

        </tr> 
        </thead>
        */
           var ths = "";
           for(var i=0; i<ary.length; i++)
            ths = ths + "<th id='th_"+i+"'>"+ary[i]+"</th>";
            
           var res ="<thead>" +
                        "<tr>" +
                           ths +
                        "</tr>" +
                    "</thead>";
           return res;
       }


       
       function buildListItem(itemObj, i){
           var trStr =  "<tr  class='listItem'></tr> ";
           var tdStr =  "<td></td> ";
           var trObj = $(trStr);
           if(i!=undefined){
            trObj.attr('dataIndex', i);
           }
      
           trObj.attr('id', itemObj.id);
         
           //Name
           var nametd = $(tdStr);
           nametd.addClass('nameArea');
 
           var nameObj = $("<div class='name'></div>");
           var actObj = $('<a href="#"></a>');
           actObj.html(itemObj.label);
           //actObj.attr('href', itemObj.action);
           nameObj.append(actObj)
           nametd.append(nameObj);
           trObj.append(nametd);
           //Date
           var sizetd = $(tdStr);
           //sizetd.html(diskSizeRenderer(itemObj.size))
           sizetd.html(itemObj.Date)
           trObj.append(sizetd);

           return trObj;
       }
       
 
       
       function buildList(jsonObj){
        var tRoot = $('<table id='+ _settings.rootId +' class="tablesorter fileList">');
        var tHeader = buildTableHeader(["Event", "Modified"]);
        tRoot.append(tHeader);
          
        var tBody = $("<tbody ></tbody>");
  
    
        for(var i=0; i < jsonObj.length; i++)
        {
           var trObj = buildListItem(jsonObj[i], i);
           tBody.append(trObj);
        }
      
        tRoot.append(tBody);
        /*
        <tbody > 
        <tr  class='listItem folder'> 
            <td class='nameArea'><img src='imgs/folder2.png'/><div class='name'><a href="#">A</a></div></td>
            <td>--</td> 
            <td>--</td> 
        </tr> 
        */          
          
        return tRoot;
       }
       
       /*
       $.getJSON(_settings.url, function(response){
            var res = "";
            if(_settings.type=='fileBrowser'){
               res = buildFileBrowser(response);
            }
            
            _settings.callback(res);
       });
       */
       $.ajax({
          url: _settings.url,
          dataType: 'json',
          //data: data,
          success: function(data, textStatus, jqXHR){
                var res = "";
                 res = buildList(data);
                _settings.success(res, data, textStatus, jqXHR);
           },
           error : function(jqXHR, textStatus, errorThrown){
               _settings.error(jqXHR, textStatus, errorThrown);
           },
           complete : function(jqXHR, textStatus){
               _settings.complete(jqXHR, textStatus);
           }
        });
 
       return this;
    };
 

})(jQuery);


