
<li class="widget ui-widget" id="portlet_<?php echo $_GET['key'];?>">

        <div class="widget-head ui-widget-header ui-corner-all myheader"></div>
        <div class="widget-content ui-widget-content">
            <!--content begin-->
            <div class="controls">
            <input class="span5" type="text" placeholder=".span5">
            </div>
            <div class="controls controls-row">
            <input class="span4" type="text" placeholder=".span4">
            <input class="span1" type="text" placeholder=".span1">
            </div>
            <!--content end-->
        </div>
</li>
 
 
<script>

;(function(){

    var portletDef = {
        path: "./portlet/portletGPE/",
        name: "portletGPE"
    };
    
    require([ portletDef.path+"/js/module"], function(_module) {   

        var key = "<?php echo $_GET['key'];?>";
        var $thisPortlet = $("#portlet_"+key);
        var $head = $thisPortlet.find(".widget-head");
        var $content = $thisPortlet.find(".widget-content");
       
        $head.append(portletDef.name + " " + key);
        
        $thisPortlet.on("setting", function(){
            alert("setting portlet " + key);
        });

        $thisPortlet.on("refresh", function(){
            alert("refresh portlet " + key);
        });

        var btnTmp = _.template(_module.template.btn);
        
        var $btn = $(btnTmp({name: portletDef.name}));
        $content.append($btn);
        
        $btn.click( function(){ _module.alertFun(portletDef.name + " " + key); });
        
        
    });   

})();

</script>


