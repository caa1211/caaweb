var docWriter = {
    topArea: function(){
                var str =
                '<div  class="topArea">'+
                      '<div class="logo"> <img src="../images/img/logo.png"></div>'+
                      '<div class="logotxt" style="right:10px; top:0px; position:absolute; width:auto;">Welcome! <span class="hint">Username</span> </div>'+
                      '<div class="verisonText" style="right:10px; top:25px; position:absolute; width:auto;">v1.12</div>'+
                '</div>';
                document.write(str);
    },
    tabArea: function(){
                var str =
                '<div class="tabArea">'+
                  '<div id="tabs" style="height:auto;">'+
                  '</div>'+
                '</div>';
                document.write(str);
                
    }, 
    jsArea: function(){
        var str = '<script src="../js/jquery-1.7.2.js" type="text/javascript"></script>'+
        '<script src="../js/jquery-ui-1.8.19.custom.min.js" type="text/javascript"></script>'+
        '<script src="../js/utils.js" type="text/javascript"></script></script>'+
        '<script src="../js/jquery.tablesorter.js" type="text/javascript"></script>'+
        //'<script src="../js/jquery.itriCSSJsonParser.js" type="text/javascript"></script>'+
        //'<script src="../js/jquery.itriFileBrowser2.js" type="text/javascript"></script>'+
        '<script src="../js/jquery.jgrowl_minimized.js"></script>';
        document.write(str);
    }
    

};