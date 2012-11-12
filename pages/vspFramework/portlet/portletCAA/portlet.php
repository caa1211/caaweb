


<script>

;(function(){

    require(["./js/domReady!", "./portlet/portletCAA/js/a"], function(_my, _module) {   
        
        
        var key = "<?php echo $_GET['key'];?>";
        
        var $thisPortlet = $("#portlet_"+key);
        $thisPortlet.find(".testBtn").click(function(){
            _module.aFun(key);
        });
        
        
        $thisPortlet.on("setting", function(){
            alert("setting portlet " + key);
        });

        $thisPortlet.on("refresh", function(){
            alert("refresh portlet " + key);
        });

    });   

})();

</script>


<li class="widget ui-widget" id="portlet_<?php echo $_GET['key'];?>">
    <div class="widget-head ui-widget-header ui-corner-all myheader">
        <h3>CAA Widget <?php echo $_GET['key'];?> </h3>
        </div>

    
        <div class="widget-content ui-widget-content">
        
        <div style="display: none;" class="edit-box well">
            <div class="">CAA Widget Setting</div>
            <div class="label label-info">Heads up!</div>
            <div class="controls controls-row">
            <input class="span4" type="text" placeholder=".span4">
            <input class="span1" type="text" placeholder=".span1">
            </div>
        </div>
    
        <button class="testBtn">test</button>
           <p> eu dui auctor tempor. Morbi laoreet eleifend dolor. Suspendisse pede odio, accumsan vitae, auctor non, suscipit at, ipsum. Cras varius sapien vel lectus.</p>
        </div>
</li>



