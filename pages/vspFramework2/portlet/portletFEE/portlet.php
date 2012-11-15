
<li class="widget ui-widget" id="portlet_<?php echo $_GET['key'];?>">
        <div class="widget-head ui-widget-header ui-corner-all myheader">
            <span class="widget-title-icon"></span>
            <span class="widget-title"></span>
        </div>
        <div class="widget-content ui-widget-content" ></div>
</li>
 
 
<script>

;(function(){

    var portletDef = {
        path: "./portlet/portletFEE/",
        name: "portletFEE"
    };
    require(["./js/domReady!", "./portlet/portletFEE/js/a"], function(_my, _module) {   

        var key = "<?php echo $_GET['key'];?>";
        var $thisPortlet = $("#portlet_"+key);
        var $head = $thisPortlet.find(".widget-head");
        var $title = $thisPortlet.find(".widget-title");
        var $content = $thisPortlet.find(".widget-content");
        
        $title.append(portletDef.name + " " + key);
        
        $thisPortlet.on("setting", function(){
            alert("setting portlet " + key);
        });

        $thisPortlet.on("refresh", function(){
            alert("refresh portlet " + key);
        });

        var btnTmp = _.template(_module.template.btn);
        
        var $btn = $(btnTmp({name: "FeeBtn 111"}));
        $content.append($btn);
        
        $btn.click( function(){ _module.aFun(key); });
        
        
    });   

})();

</script>


