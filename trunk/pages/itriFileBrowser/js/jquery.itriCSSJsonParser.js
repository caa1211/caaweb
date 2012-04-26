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
            html: "imgs/flavour-extended-png/file_html.png",
           
            unknow: "imgs/flavour-extended-png/document_blank.png"
        },
        callback: function(e){
                
        }
       };
       
       var _settings = $.extend({}, defaultSetting , settings);
       
       function imgPreload(imgSrc){
           $.each(imgSrc, function(){
                    var imageObj = new Image();
                   imageObj.src = $(this);
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
       
       
        function diskSizeRenderer(value){
          var bytes = parseInt(value);
          if(isNaN(bytes)){
            return "";
          }
            
          var s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
          var e = Math.floor(Math.log(bytes)/Math.log(1024));
          return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
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
       
       function buildFileBrowser(jsonObj){
        var tRoot = $('<table id='+ _settings.rootId +' class="tablesorter fileList">');
        var tHeader = buildTableHeader(["Name", "Size", "LastModified"]);
          tRoot.append(tHeader);
          
        var tBody = $("<tbody ></tbody>");
        var trStr =  "<tr  class='listItem'></tr> ";
        var tdStr =  "<td></td> ";
    
        for(var i=0; i < jsonObj.length; i++)
        {
           var trObj = $(trStr);
           trObj.attr('id', jsonObj[i].id);
           trObj.addClass(_settings.typeAry[jsonObj[i].type]);
           //Name
           var nametd = $(tdStr);
           nametd.addClass('nameArea');
           var nameExtension 
           if(_settings.typeAry[jsonObj[i].type] == "folder"){
             nameExtension= 'folder';
             }
           else{
             nameExtension = parseNameExtension(jsonObj[i].name);
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
           actObj.html(jsonObj[i].name);
           actObj.attr('href', jsonObj[i].action);
           nameObj.append(actObj)
           nametd.append(nameObj);
           trObj.append(nametd);
           //Size
           var sizetd = $(tdStr);
           sizetd.html(diskSizeRenderer(jsonObj[i].size))
           trObj.append(sizetd);
            
           //LastModify
           var lmtd = $(tdStr);
           lmtd.html(jsonObj[i].lastMod)
           trObj.append(lmtd);
           
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
       
       $.getJSON(_settings.url, function(response){
            var res = "";
            if(_settings.type=='fileBrowser'){
               res = buildFileBrowser(response);
            }
            
            _settings.callback(res);
       });
       
       
    
        
       return this;
    };
 

})(jQuery);


