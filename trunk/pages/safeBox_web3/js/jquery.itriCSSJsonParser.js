﻿/*
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
        baseImgPath : "../images/fileImgs/",
        imgSrc:{//refer to parseNameExtension()
            folder: "folder_close_web.png",
            dll: "doc_dll.png",
            iso: "doc_iso.png",
            pdf: "doc_pdf.png",
            php: "doc_php.png",
            pps: "doc_pps.png",
            ppt: "doc_ppt.png",
            rar: "doc_rar.png",
            zip: "doc_zip.png",
            txt: "doc_txt.png",
            doc: "doc_doc.png",
            xlsx: "doc_xls.png",
            xls: "doc_xls.png",
            xml: "doc_xml.png",
            ai: "img_ai.png",
            bmp: "img_bmp.png",
            eps: "img_eps.png",
            gif: "img_gif.png",
            jpg: "img_jpg.png",
            jpeg: "img_jpg.png",
            png: "img_png.png",
            psd: "img_psd.png",
            tiff: "img_tiff.png",
            aac: "music_aac.png",
            aiff: "music_aiff.png",
            flac: "music_flac.png",
            mp3: "music_mp3.png", 
            wma: "music_wma.png",
            avi: "video_avi.png",    
            flv: "video_flv.png",    
            mov: "video_mov.png",    
            mpg: "video_MPG.png",  
            mpeg: "video_MPG.png",            
            rm: "video_rm.png",    
            rmvb: "video_rm.png",
            wmv: "video_wmv.png", 
            wav: "file_music.png", 
            unknow: "doc_unknown.png"
        },
        success: function(e, data, textStatus, jqXHR){},
        error: function(jqXHR, textStatus, errorThrown){},
        complete: function(jqXHR, textStatus){}
       };
       
       var _settings = $.extend({}, defaultSetting , settings);
   
       $.each(_settings.imgSrc, function(i, t){
            _settings.imgSrc[i] = _settings.baseImgPath + _settings.imgSrc[i];
       });
      
      this.getImgSrc = function(){
        return _settings.imgSrc;
      };
      
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
            ths = ths + "<th id='th_"+i+"'>"+ary[i]+"</th>";
            
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
               nameType.html(1);
            }
            else{
               nameType.html(2);
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


