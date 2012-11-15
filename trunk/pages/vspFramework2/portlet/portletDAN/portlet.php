
<li class="widget ui-widget" id="portlet_<?php echo $_GET['key'];?>">
        <div class="widget-head ui-widget-header ui-corner-all myheader">
            <span class="widget-title-icon"></span>
            <span class="widget-title"></span>
        </div>
        <div class="widget-content ui-widget-content"></div>
</li>
 
 
 

 

<script>

;(function(){

    var portletDef = {
        path: "./portlet/portletDAN/",
        name: "portletDAN"
    };
    require(["./js/domReady!", "./portlet/portletDAN/js/a.js", "./portlet/portletDAN/js/template.js"], function() {   

        var key = "<?php echo $_GET['key'];?>";
        var $thisPortlet = $("#portlet_"+key);
        var $head = $thisPortlet.find(".widget-head");
        var $title = $thisPortlet.find(".widget-title");
        var $content = $thisPortlet.find(".widget-content");
        
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


