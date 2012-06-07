/*
 * itriFileBrowser.js
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

   
    $.itriCSSJsonParser = function(settings){

        function _L(str){
        var debugDiv =  $("#debugDiv");
         if( debugDiv.length != 0){
            $("#debugDiv").append("<div>"+str+"</div>")
               // console.log(str);
            }
       }
       
       var defaultSetting = {
        url:"",
        rootId: "itriFileBrowser",
        type: 'fileBrowser',
        typeAry : ["folder", "file"],
        imgSrc:{//refer to parseNameExtension()
            folder: "imgs/flavour-extended-png/folder_blue_stuffed.png",
            png: "imgs/flavour-extended-png/file_png.png",
            jpg: "imgs/flavour-extended-png/file_jpg.png",
            jpeg: "imgs/flavour-extended-png/file_jpg.png",
            gif: "imgs/flavour-extended-png/file_gif.png",
            pdf: "imgs/flavour-extended-png/file_pdf.png",
            mp3: "imgs/flavour-extended-png/file_mp3.png",
            txt: "imgs/flavour-extended-png/file_txt.png",
            doc: "imgs/flavour-extended-png/file_doc.png",
            wav: "imgs/flavour-extended-png/file_wav.png",
            mpg: "imgs/flavour-extended-png/file_mpg.png",
            mpeg: "imgs/flavour-extended-png/file_mpg.png",
            html: "imgs/flavour-extended-png/file_html.png",
           
            unknow: "imgs/flavour-extended-png/document_blank.png"
        },
        success: function(e, data, textStatus, jqXHR){},
        error: function(jqXHR, textStatus, errorThrown){},
        complete: function(jqXHR, textStatus){}
       };
       
       var _settings = $.extend({}, defaultSetting , settings);
       
       function imgPreload(imgSrc){
           $.each(imgSrc, function(i, t){
                    var imageObj = new Image();
                   imageObj.src = t;
           });
       }
       imgPreload(_settings.imgSrc);
       
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
            ths = ths + "<th>"+ary[i]+"</th>";
            
           var res ="<thead>" +
                        "<tr>" +
                           ths +
                        "</tr>" +
                    "</thead>";
           return res;
       }


       function parseNameExtension(name){
        
        //var ename = (/[.]/.exec(name)) ? /[^.]+$/.exec(name) : 'unknow';
        var ename = name.split('.').pop();
        ename = ename.toLowerCase();
        var typing = false;
        if(typing){
            switch(ename){
                case 'jpg':
                case 'png':
                case 'gif':
                case 'bmp':
                    ret = "img";
                break;
                case 'doc':
                case 'pdf':
                    ret = "doc";
                break;
                
                default:
                    ret = ename;
                break;
            };
        }
        else{
            ret = ename;
        }
        
        
        return ret;
       }
       
       function buildListItem(itemObj, i){
           var trStr =  "<tr  class='listItem'></tr> ";
           var tdStr =  "<td></td> ";
           var trObj = $(trStr);
           if(i!=undefined){
            trObj.attr('dataIndex', i);
           }
           trObj.attr('id', itemObj.id);
           trObj.addClass(_settings.typeAry[itemObj.type]);
           //Name
           var nametd = $(tdStr);
           nametd.addClass('nameArea');
           var nameExtension 
           if(_settings.typeAry[itemObj.type] == "folder"){
             nameExtension= 'folder';
             }
           else{
             nameExtension = parseNameExtension(itemObj.name);
           }
           var imgSrc = _settings.imgSrc[nameExtension];
           if(imgSrc == undefined){
             imgSrc = _settings.imgSrc["unknow"];
           }
          
           nametd.append("<img src='"+ imgSrc +"'/>");
           
           var nameType = $("<span class='type'></span>");
            if(nameExtension == "folder"){
               nameType.html("1_");
            }
            else{
               nameType.html("2_");
            }
            
            nametd.append(nameType);
              
           var nameObj = $("<div class='name'></div>");
           var actObj = $('<a href="#"></a>');
           actObj.html(itemObj.name);
           actObj.attr('href', itemObj.action);
           nameObj.append(actObj)
           nametd.append(nameObj);
           trObj.append(nametd);
           //Size
           var sizetd = $(tdStr);
           //sizetd.html(diskSizeRenderer(itemObj.size))
           sizetd.html(itemObj.size)
           trObj.append(sizetd);
            
           //LastModify
           var lmtd = $(tdStr);
           lmtd.html(itemObj.lastMod);
           
           trObj.append(lmtd);
           return trObj;
       }
       
       function buildFileBrowser(jsonObj){
        var tRoot = $('<table id='+ _settings.rootId +' class="tablesorter fileList">');
        var tHeader = buildTableHeader(["Name", "Size", "LastModified"]);
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
                if(_settings.type=='fileBrowser'){
                   res = buildFileBrowser(data);
                }
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


