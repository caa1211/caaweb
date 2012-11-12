
<li class="widget ui-widget" id="portlet_<?php echo $_GET['key'];?>">
        <div class="widget-head ui-widget-header ui-corner-all myheader"></div>
        <div class="widget-content ui-widget-content"></div>
</li>
 
 
 

 

<script>

;(function(){

    require(["./js/domReady!", "./portlet/portletDAN/js/a.js", "./portlet/portletDAN/js/template.js"], function() {   
             
             
        var key = "<?php echo $_GET['key'];?>";
        
        var $thisPortler = $("#portlet_"+key);
        var $head = $thisPortler.find(".widget-head");
        var $content = $thisPortler.find(".widget-content");
        
        $thisPortler.find(".testBtn").click(function(){
            a(key);
        });

        $thisPortler.on("setting", function(){
            alert("setting portlet " + key);
        });

        $thisPortler.on("refresh", function(){
            alert("refresh portlet " + key);
        });


        
    });   

})();

</script>


